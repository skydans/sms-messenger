const express = require('express');
const router = express.Router();
const messageDB = require('../public/javascripts/message-db');

/* GET conversation history by UID */
router.get('/conversations/id/:id', function(req, res, next) {
  messageDB.getConversationById(req.params.id, convo => {
    if (convo) {
      res.send(convo);
    } else {
      res.sendStatus(404);
    }
  });
});

router.get('/conversations/number/:number', function(req, res, next) {
  messageDB.getConversationByNumber(req.params.number, convo => {
    if (convo) {
      res.send(convo);
    } else {
      res.sendStatus(404);
    }
  });
});

router.get('/numbers/id/:id', function(req, res, next) {
  messageDB.getNumberById(req.params.id, number => {
    if (number) {
      res.send(number);
    } else {
      res.sendStatus(404);
    }
  });
});

module.exports = router;