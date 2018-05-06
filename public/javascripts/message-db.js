const socketio =  require('socket.io');
const Conversation = require('../../models/conversation');

let io;

const createMessage = async (body, from, to, usSender) => {
  // check if conversation already exists. It's always recorded as the number that's not us
  let otherNumber = from; // we are receiver
  if (usSender) {
    otherNumber = to; // we are sender
  }
  Conversation.findOne({number: otherNumber}, (err, convo) => {
    if (err) {
      console.log(err);  // TODO handle error
    } else {
      // found an existing conversation?
      if (convo) {
        // add a message to this conversation
        const newMessage = {
          body: body,
          date: new Date(),
          sent: usSender
        };
        convo.history.push(newMessage);
        convo.save((err, updatedConvo) => {
          if (err) {
            console.log(err);  // TODO handle error
          } else {
            console.log("updated conversation:", updatedConvo);
            // notify client that conversation was updated
            // io.on('connection', function(socket) {
            io.emit('update conversation', newMessage);
            // });
          }
        });
      } else {
        // start a new conversation
        createNewConversationWithMessage(body, from, to, usSender);
      }
    }
  });
};

const createNewConversationWithMessage = async (body, from , to, usSender) => {
  let otherNumber = from; // we are receiver
  if (usSender) {
    otherNumber = to; // we are sender
  }
  const newConvo = {
    number: otherNumber,
    history: [
      {
        body: body,
        date: new Date(),
        sent: usSender
      }
    ]
  };
  Conversation.create(newConvo, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Created new conversation: ", newlyCreated);
    }
  });
};

const deleteMessage=async(id, to)=>{
  Conversation.remove({_id:id}, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted the conversation");
    }
  });
};

// callback is callback function
const getAllConversations = (callback) => {
  Conversation.find({}, (err, allConvos) => {
    if (err) {
      console.log(err);  // TODO handle error
    } else {
      return callback(allConvos);
    }
  });
};

const getConversationById = (id, callback) => {
  Conversation.findById(id, (err, convo) => {
    if (err) {
      console.log(err);  // TODO handle error
      return null;
    } else if (!convo) {
      return callback(null);
    } else {
      // todo what if nothing found with that ID?
      return callback(convo);
    }
  });
};

const getConversationByNumber = (phoneno, callback) => {
  Conversation.findOne({number:phoneno}, (err, convo) => {
    if (err) {
      console.log(err);
    } else if (!convo) {
      return callback(null);
    } else {
      return callback(convo);
    }
  });
};

const getNumberById = (id, callback) => {
  Conversation.findById(id, (err, convo) => {
    if (err) {
      console.log(err);  // TODO handle error
    } else if (!convo) {
      return callback(null);
    } else {
      if (convo) {
        return callback(convo.number);
    }
  }});
};

// hacky way to move socket stuff to this module
const ioListen = function(server) {
  io = socketio.listen(server);
  io.on('connection', function(socket) {
    console.log('a user connected');
    socket.emit('notify', 'server acknowledges user connected');
  });
};

module.exports = {
  createMessage,
  deleteMessage,
  getAllConversations,
  getConversationById,
  getConversationByNumber,
  getNumberById,
  ioListen
};
