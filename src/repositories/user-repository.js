const Crudrepository = require("./crud-repository");
const { User } = require("../models");
class UserRepository extends Crudrepository {
    constructor() {
        super(User);
    }
}
module.exports = UserRepository;