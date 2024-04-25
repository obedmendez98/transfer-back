const Account = require('../models/accountModel');

exports.getAllAccounts = async (req, res) => {
    const { user } = req;
    const { username } = user;
    try {
        const accounts = await Account.find({ user_id: username });
        return res.status(200).json({ accounts });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};