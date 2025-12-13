const { UserService } = require("../services");
const { StatusCodes } = require("http-status-codes");
const { ErrorResponse , SuccessResponse} = require("../utils/common");
const { log } = require("winston");


/**
 *
 * POSt : /signup
 * req-body : {email:'jhon@eacmpl.com', passsword: "ewrfd"}
 *
 */
async function signup(req, res) {
    try {
    //  console.log("inside controller");
     
      const user = await UserService.create({
       email:req.body.email,
       password:req.body.password
      });
      SuccessResponse.data = user
      return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
      // console.log("conroller catch block");
      
      ErrorResponse.error = error
      res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
    }
  }

  async function signin(req, res) {
    try {
    //  console.log("inside controller");
     
      const user = await UserService.signin({
       email:req.body.email,
       password:req.body.password
      });
      SuccessResponse.data = user
      return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
      // console.log("conroller catch block");
      
      ErrorResponse.error = error
      res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
    }
  }



module.exports = {
    signup,
    signin
}