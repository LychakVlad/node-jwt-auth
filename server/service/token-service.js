const jwt = require('jsonwebtoken');
const db = require('../db');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await db.query(
      'SELECT * FROM tokens WHERE user_id = $1',
      [userId]
    );

    if (tokenData.rows[0]) {
      const newRefreshToken = await db.query(
        'UPDATE tokens SET refreshToken = $1 WHERE user_id = $2',
        [refreshToken, userId]
      );
      return newRefreshToken;
    }
    const token = await db.query(
      'INSERT INTO tokens (user_id, refreshToken) values ($1,$2)',
      [userId, refreshToken]
    );
    return token;
  }
}

module.exports = new TokenService();
