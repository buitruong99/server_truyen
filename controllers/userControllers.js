const User = require("../models/Users");

const userController = {
    // get all users
    getAllUsers: async (req, res) => {
        try {
            const user = await User.find();
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    deleteUsers: async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json('delete successfully ');
        } catch (error) {
            res.status(500).json(error);
        }
    }
}
module.exports = userController