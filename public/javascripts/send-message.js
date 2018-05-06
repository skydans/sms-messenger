const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const sendMessage = async (body, from, to) => {
  client.messages
      .create({
        body,
        from,
        to
      })
      .then(message => console.log(message.sid))
      .done();
};


module.exports = {
  sendMessage
};
