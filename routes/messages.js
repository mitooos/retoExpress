const express = require("express");
const router = express.Router();
const Pertsistence = require("../persistence/persistence");

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
  await Pertsistence.insertItem(insertedMessage, messagesCollection);
  res.send(insertedMessage);
});

router.put("/", async (req, res) => {
  let messageToUpdate = req.body;
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
});

module.exports = router;
