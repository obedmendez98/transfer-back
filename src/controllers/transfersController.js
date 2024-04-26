const Transfer = require('../models/transfersModel');
const Account = require('../models/accountModel');

exports.getAllTransfers = async (req, res) => {
  const { user, body } = req;
    const { username } = user;
    try {
      const transfers = await Transfer.find({ user_id:  username });
      return res.status(200).json(transfers);
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener las transferencias' });
    }
};

exports.createTransfer = async (req, res) => {
  const { user, body } = req;
  const { username } = user;
  const { origin_account, id_origin_account, amount, concept, destination_account } = body;

  try {
    const originAccount = await Account.findOne({ _id: id_origin_account, user_id: username });
    if (!originAccount) {
      return res.status(400).json({ message: 'La cuenta de origen no pertenece al usuario.' });
    }

    if (originAccount.balance < amount) {
      return res.status(400).json({ message: 'Saldo insuficiente en la cuenta de origen.' });
    }

    const newTransfer = new Transfer({
      user_id: username,
      origin_account,
      id_origin_account,
      amount,
      concept,
      destination_account,
      transfer_date: new Date(),
    });

    originAccount.amount -= amount;
    await originAccount.save();

    const savedTransfer = await newTransfer.save();
    return res.status(201).json(savedTransfer);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error al agregar la transferencia' });
  }
};
  
exports.getTransfersGroupedByDestinationAccount = async (req, res) => {
  const { user, body } = req;
  const { username } = user;
    try {
      const transfers = await Transfer.aggregate([
        { $match: { user_id: username } },
        { $group: { _id: '$destination_account', total: { $sum: '$amount' } } }
      ]);
      return res.status(200).json(transfers);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error al obtener las transferencias agrupadas por cuenta de destino' });
    }
};
  
exports.getTop3TransfersByAmount = async (req, res) => {
  const { user, body } = req;
  const { username } = user;
    try {
      const transfers = await Transfer.find({ user_id: username }).sort({ amount: -1 }).limit(3);
      return res.status(200).json(transfers);
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener las 3 transferencias con el monto más alto' });
    }
};
  
exports.getTransfersGroupedByOriginAccount = async (req, res) => {
  const { user } = req;
  const { username } = user;
  try {
    const transfers = await Transfer.find({ user_id: username }).sort('origin_account');

    const groupedTransfers = transfers.reduce((acc, transfer) => {
      const originAccount = transfer.origin_account;
      if (!acc[originAccount]) {
        acc[originAccount] = [];
      }
      acc[originAccount].push(transfer);
      return acc;
    }, {});

    return res.status(200).json(groupedTransfers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener las transferencias agrupadas por cuenta de origen' });
  }
};