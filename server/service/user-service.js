const db = require('../db');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const TokenService = require('./token-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');

class UserService {
  async registration(email, password) {
    const candidate = await db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (candidate.rows[0]) {
      throw new Error(`User with email ${email} already exists`);
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();

    const user = await db.query(
      'INSERT INTO users (email, password, activationLink) values ($1, $2, $3) RETURNING *',
      [email, hashPassword, activationLink]
    );

    await mailService.sendActivationMail(email, activationLink);

    const userDto = new UserDto(user.rows[0]);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }
}

module.exports = new UserService();
