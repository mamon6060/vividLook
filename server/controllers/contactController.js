const Contact = require("../models/contactModel");
const {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} = require("./handleFactory");

exports.createContactController = createOne(Contact);

exports.getAllContactsController = getAll(Contact);

exports.getContactController = getOne(Contact);

exports.updateContactController = updateOne(Contact);

exports.deleteContactController = deleteOne(Contact);
