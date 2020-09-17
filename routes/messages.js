const express = require("express");
const router = express.Router();
const Pertsistence = require("../persistence/persistence");
const webSocket = require("../wslib");
const Message = require("../models/message");

const messagesCollection = "messages";

router.get("/", async (req, res) => {
  let messages = await Pertsistence.getAllItems(messagesCollection);
  res.send(messages);
});

router.get("/:ts", async (req, res) => {
  let message = await Pertsistence.getItemByAtribute(
    messagesCollection,
    "ts",
    Number(req.params.ts)
  );
  if (!message) {
    res.status(404).send("No message with the given ts");
    return;
  }
  res.send(message);
});

router.post("/", async (req, res) => {
  let insertedMessage = req.body;
  insertedMessage.ts = Date.now();

  let validation = Message.validateMessage(insertedMessage);
  if (validation) {
    res.status(400).send(validation);
    return;
  }

  await Pertsistence.insertItem(insertedMessage, messagesCollection);
  res.send(insertedMessage);
  webSocket.sendMessages();
});

router.put("/", async (req, res) => {
  let messageToUpdate = req.body;

  let validation = Message.validateMessage(messageToUpdate);
  if (validation) {
    res.status(400).send(validation);
    return;
  }

  let updatedMessage = await Pertsistence.updateItemByAtribute(
    messagesCollection,
    "ts",
    messageToUpdate.ts,
    messageToUpdate
  );

  if (!updatedMessage) {
    res.status(404).send("No message with the given ts");
    return;
  }
  res.send(updatedMessage);
  webSocket.sendMessages();
});

router.delete("/:ts", async (req, res) => {
  let ts = Number(req.params.ts);
  let deletionResult = await Pertsistence.deleteItemByAtribute(
    messagesCollection,
    "ts",
    ts
  );
  if (!deletionResult) {
    res.status(404).send("No message with the given ts");
    return;
  }
  res.status(200).send(`Message with ts: ${ts} deleted`);
  webSocket.sendMessages();
});

module.exports = router;
