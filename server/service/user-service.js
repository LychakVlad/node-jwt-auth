const db = require('../db');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const TokenService = require('./token-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exeptions/api-error');

class UserService {
  async registration(email, password) {
    const candidate = await db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (candidate.rows[0]) {
      throw ApiError.BadRequest(`User with email ${email} already exists`);
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();

    const user = await db.query(
      'INSERT INTO users (email, password, activationLink) values ($1, $2, $3) RETURNING *',
      [email, hashPassword, activationLink]
    );

    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );

    const userDto = new UserDto(user.rows[0]);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async activate(activationLink) {
    const user = await db.query(
      'SELECT * FROM users WHERE activationLink = $1',
      [activationLink]
    );

    if (!user.rows[0]) {
      throw ApiError.BadRequest('Activation link is incorrect');
    }

    await db.query('UPDATE users SET isActivated = $1 WHERE user_id = $2', [
      true,
      user.rows[0].user_id,
    ]);
  }

  async login(email, password) {
    const user = await db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    console.log(user.rows[0]);

    if (!user.rows[0]) {
      throw ApiError.BadRequest(`User with email ${email} is not found`);
    }

    const isPassEquals = await bcrypt.compare(password, user.rows[0].password);

    if (!isPassEquals) {
      throw ApiError.BadRequest(`Incorrect password`);
    }

    const userDto = new UserDto(user.rows[0]);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await db.query('SELECT * FROM users WHERE user_id = $1', [
      userData.id,
    ]);
    const userDto = new UserDto(user.rows[0]);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async getAllUsers() {
    const users = await db.query('SELECT * FROM users');
    return users;
  }
}

module.exports = new UserService();
