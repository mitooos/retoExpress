const express = require("express");
const router = express.Router();
const webSocket = require("../wslib");
const Joi = require("joi");
const { Message } = require("../models/message");

const messageSchema = Joi.object({
  message: Joi.string().min(5).required(),
  author: Joi.string().pattern(new RegExp("^[a-zA-Z]+ [a-zA-Z]+")).required(),
  ts: Joi.number().integer(),
});

const validateMessage = (message) => {
  let { error } = messageSchema.validate(message);
  return error ? error.message : undefined;
};

router.get("/", async (req, res) => {
  let messages = await Message.findAll();
  res.send(messages);
});

router.get("/:ts", async (req, res) => {
  let message = await Message.findAll({
    where: {
      ts: Number(req.params.ts),
    },
  });

  if (message.length === 0) {
    res.status(404).send("No message with the given ts");
    return;
  }
  res.send(message);
});

router.post("/", async (req, res) => {
  let insertedMessage = req.body;
  insertedMessage.ts = Date.now();

  let validation = validateMessage(insertedMessage);
  if (validation) {
    res.status(400).send(validation);
    return;
  }

  let createdMessage = await Message.create(insertedMessage);
  res.send(createdMessage);
  webSocket.sendMessages();
});

router.put("/", async (req, res) => {
  let messageToUpdate = req.body;

  let validation = validateMessage(messageToUpdate);
  if (validation) {
    res.status(400).send(validation);
    return;
  }

  let updatedMessage = await Message.update(messageToUpdate, {
    where: {
      ts: req.body.ts,
    },
  });

  if (updatedMessage[0] === 0) {
    res.status(404).send("No message with the given ts");
    return;
  }
  res.send(messageToUpdate);
  webSocket.sendMessages();
});

router.delete("/:ts", async (req, res) => {
  let ts = Number(req.params.ts);
  let deletionResult = await Message.destroy({
    where: { ts: ts },
  });
  if (!deletionResult) {
    res.status(404).send("No message with the given ts");
    return;
  }
  res.status(200).send(`Message with ts: ${ts} deleted`);
  webSocket.sendMessages();
});

module.exports = router;
