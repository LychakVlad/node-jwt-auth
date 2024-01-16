# User Authentication Project

This project implements a user authentication system with a client-server architecture. It allows users to register, log in, log out, and perform other authentication-related actions.

## Table of Contents

- [User Authentication Project](#user-authentication-project)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Usage](#usage)
    - [Token Mechanism](#token-mechanism)
  - [API Endpoints](#api-endpoints)
  - [Environment Variables](#environment-variables)
  - [Dependencies](#dependencies)
  - [Contact](#contact)

## Overview

The project consists of a client application and a server application. The client interacts with the server to handle user authentication processes.

## Features

- User registration
- User login/logout
- Account activation
- Token-based authentication
- User data retrieval

## Usage

Ensure the server is running before starting the client. The client interacts with the server to handle user authentication. Follow the instructions in the respective client and server README files for detailed usage.

### Token Mechanism

This project uses token-based authentication with both access and refresh tokens.

- **Access Token:**

  - Generated upon successful login or account activation.
  - Has a short expiration time (e.g., 15 minutes).
  - Used to authenticate and authorize API requests.

- **Refresh Token:**
  - Generated alongside the access token.
  - Has a longer expiration time (e.g., 30 days).
  - Used to obtain a new access token without requiring the user to log in again.
  - Stored securely on the client side (e.g., as an HTTP-only cookie).

## API Endpoints

The server provides the following API endpoints:

- `POST /registration`: User registration
- `POST /login`: User login
- `POST /logout`: User logout
- `GET /activate/:link`: Activate user account
- `GET /refresh`: Refresh user token
- `GET /users`: Get all users (requires authentication)

## Environment Variables

**Server:**

- `API_URL`: URL of your API
- `SMTP_USER`: Gmail SMTP user for sending activation emails
- `SMTP_PASSWORD`: Gmail SMTP password
- `JWT_ACCESS_SECRET`: Secret key for access token generation
- `JWT_REFRESH_SECRET`: Secret key for refresh token generation
- `CLIENT_URL`: URL of the client application

**Client:**

- No specific environment variables for the client

## Dependencies

**Server:**

- Express
- Nodemailer
- JWT
- bcrypt
- PostgreSQL

**Client:**

- React
- MobX
- Axios

## Contact

Vladislav Lychak - [@LinkedIn](https://www.linkedin.com/in/vladislav-lychak/) - lycakvladislav@gmail.com

<p align="right">(<a href="#readme-top">back to top</a>)</p>
