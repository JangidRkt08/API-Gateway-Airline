const bcrypt = require("bcrypt");

const { StatusCodes } = require("http-status-codes");
const { UserRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { Auth } = require("../utils/common");
const userRepo = new UserRepository();

async function create(data) {
  try {
    // console.log("Inside services");
    const user = await userRepo.create(data);
    return user;
  } catch (error) {
    console.log(error);

    if (
      error.name == "SequelizeUniqueConstraintError" ||
      error.name == "SequelizeValidationError"
    ) {
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });

      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }
    throw new AppError(
      "cannot Create a new User Object",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function signin(data) {
  try {
    const user = await userRepo.getUserByEmail(data.email);
    if (!user) {
      throw new AppError(
        "User not found for the given email id",
        StatusCodes.NOT_FOUND
      );
    }
    const passwordMatch = Auth.checkPassword(data.password, user.password);
    if (!passwordMatch) {
      throw new AppError("Invalid Password", StatusCodes.UNAUTHORIZED);
    }
    const jwt = Auth.createToken({ id: user.id, email: user.email });
    return jwt
  } catch (error) {
    if(error instanceof AppError){
      throw error
    }   
    console.log(error);
    throw new AppError('Something Went Wrong',StatusCodes.INTERNAL_SERVER_ERROR)
  }
}

async function isAuthenticated(token) {
  try {
    if (!token) {
      throw new AppError("Token not found", StatusCodes.BAD_REQUEST);
    }

    const repsonse = Auth.verifyToken(token);
    const user = await userRepo.get(repsonse.id);
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }
    return user.id;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error.name == "JsonWebTokenError") {
      throw new AppError("Invalid Token", StatusCodes.BAD_REQUEST);
    }
    if (error.name == "TokenExpiredError") {
      throw new AppError("Token Expired", StatusCodes.BAD_REQUEST);
    }
    console.log(error);
    throw error;
  }
}

module.exports = {
  create,
  signin,
  isAuthenticated
};
