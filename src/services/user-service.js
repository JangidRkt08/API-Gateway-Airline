const { StatusCodes } = require('http-status-codes');
const {UserRepository} = require('../repositories');
const AppError = require('../utils/errors/app-error');


const userRepo = new UserRepository()

async function create(data){
    try {
        // console.log("Inside services");
        const user = await userRepo.create(data);
        return user
    } catch (error) {
        console.log(error);
        
        if(error.name == "SequelizeUniqueConstraintError" ||error.name == "SequelizeValidationError" )
        {
        let explanation = [];
        error.errors.forEach((err) => {
            
            explanation.push(err.message)
        })
        
        throw new AppError(explanation,StatusCodes.BAD_REQUEST)
       }
    throw new AppError("cannot Create a new User Object",StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

module.exports = {
    create
}