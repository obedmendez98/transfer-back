const Account = require('../models/accountModel');
const Transfer = require('../models/transfersModel');

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

exports.getAccountBalances = async (req, res) => {
    const { user } = req;
    const { username } = user;
    try {
        const accounts = await Account.find({ user_id: username });
        const balances = await Promise.all(accounts.map(async account => {
            const initialBalance = account.amount;

            const debitTransfers = await Transfer.aggregate([
                { $match: { id_origin_account: account._id, type: 'debit' } },
                { $group: { _id: null, totalDebit: { $sum: '$amount' } } }
            ]);
            const totalDebits = debitTransfers.length > 0 ? debitTransfers[0].totalDebit : 0;

            const creditTransfers = await Transfer.aggregate([
                { $match: { id_origin_account: account._id, type: 'credit' } },
                { $group: { _id: null, totalCredit: { $sum: '$amount' } } }
            ]);
            const totalCredits = creditTransfers.length > 0 ? creditTransfers[0].totalCredit : 0;

            const lastTransfer = await Transfer.findOne({ id_origin_account: account._id }).sort({ transfer_date: -1 });

            return {
                account: account.account,
                total: initialBalance,
                lastTransferDate: lastTransfer ? new Date(lastTransfer.transfer_date).toISOString().split('T')[0] : null
            };
        }));
        return res.status(200).json({ balances });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};