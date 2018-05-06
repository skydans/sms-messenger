const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  number:  String,
  history: [{ body: String, date: Date, sent: Boolean}]
});
// if sent==true, means you sent it. Otherwise number sent it

// compile into model
module.exports = mongoose.model("Conversation", conversationSchema);