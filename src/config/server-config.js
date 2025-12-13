const dotenv = require('dotenv')

dotenv.config();

module.exports={
    PORT:process.env.PORT,
    SALT_ROUNDS:process.env.SALT_ROUNDS,
    JWT_EXPIRY_TIME:process.env.JWT_EXPIRY_TIME,
    JWT_SECRET:process.env.JWT_SECRET
}