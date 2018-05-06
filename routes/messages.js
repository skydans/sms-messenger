const express = require('express');
const router = express.Router();
const sendMessage = require('../public/javascripts/send-message');
const validator = require('../public/javascripts/validate');
const messageDB = require('../public/javascripts/message-db');

const PHONE_NUMBER = '+61488811129';

/* Index route. Shows all conversations */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Messages' });
  messageDB.getAllConversations( allConvos => {
    res.render('messages/index', {allConvos: allConvos, title: "All Conversations"})
  });
});

router.get('/new', function(req, res, next) {
  res.render('messages/new', { title: 'Create New Message' });
});

router.get('/new/error', function(req, res, next) {
  res.render('messages/new', { title: 'Create New Message', error: 'Invalid number or no message. Try again.' });
});

router.get('/deleted', function(req, res, next) {
  messageDB.getAllConversations( allConvos => {
    res.render('messages/index', {allConvos: allConvos, title: "All Conversations", error: 'Conversation deleted.'})
  });
});

router.get('/error', function(req, res, next) {
  messageDB.getAllConversations( allConvos => {
    res.render('messages/index', {allConvos: allConvos, title: "All Conversations", error: 'Input error occurred.'})
  });
});

router.get('/delete/:id', function(req, res, next) {
  messageDB.getConversationById(req.params.id, convo => {
    if (convo) {
      res.render('messages/delete', { title: 'Confirm Delete' , convo:convo});
    } else {
      // nothing found with :id?
      res.redirect('/messages');
    }
  });
  // res.render('messages/delete', { title: 'Delete Message?' , id:req.params.id});
});

/* Show route. Shows one conversations with id */
router.get('/:id', function(req, res, next) {
  messageDB.getConversationById(req.params.id, convo => {
    if (convo) {
      res.render('messages/show', {title: 'Conversation with'+convo.number, convo: convo});
    } else {
      // nothing found with :id?
      res.redirect('/messages');
    }
  });
});

router.post('/send', function(req, res, next) {
  const message = req.body.message;
  const number = req.body.number.split(", ");
  if (!validator.validateBatch(number) || !validator.validateBody(message)) {
    res.redirect('/messages/new/error');
  } else {
    for (let i = 0; i < number.length; i++) {
      sendMessage.sendMessage(message, PHONE_NUMBER, number[i], true);
      messageDB.createMessage(message, PHONE_NUMBER, number[i], true);
    }
    res.redirect('/messages');
  }
});

// Receive text messages
router.post('/receive', function(req, res) {
  console.log(req.body.From + " - " + req.body.Body);
  messageDB.createMessage(req.body.Body, req.body.From, PHONE_NUMBER, false);
  res.end();
});

/* Delete convo */
router.post('/deleteAction/:id', function(req, res, next) {
  // TODO implement
  messageDB.deleteMessage(req.body.id, PHONE_NUMBER);
  res.redirect('/messages/deleted');
});

/* Process replies */
router.post('/send/:id', function(req, res, next) {
  const message = req.body.message;
  messageDB.getNumberById(req.params.id, number => {
    if (!number || !validator.validateBody(message)) {
      res.redirect('/messages/error');
    } else {
      sendMessage.sendMessage(message, PHONE_NUMBER, number, true);
      messageDB.createMessage(message, PHONE_NUMBER, number, true);
      res.redirect('/messages/' + req.params.id);
    }
  });
});

module.exports = router;
