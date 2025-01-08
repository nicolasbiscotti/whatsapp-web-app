const express = require("express");
const venom = require("venom-bot");
const app = express();
const port = 3000;

let client;

// Serve QR code and initialize WhatsApp
app.get("/scan_qr", (req, res) => {
  venom
    .create(
      "sessionName",
      (base64Qr, asciiQR) => {
        console.log(asciiQR); // Optional: To log ASCII QR in the terminal
        const qrCodeData = `<img src='data:image/png;base64,${base64Qr}' />`;
        res.send(qrCodeData); // Serve QR code to the browser
      },
      undefined, // Optional: You can customize session settings here
      { headless: true }
    )
    .then((clientInstance) => {
      client = clientInstance;
      res.send("WhatsApp is ready.");
    })
    .catch((error) => {
      console.error("Error initializing WhatsApp", error);
      res.status(500).send("Error initializing WhatsApp");
    });
});

// Route to handle user input (group name)
app.post("/get_messages", express.json(), async (req, res) => {
  const { group_name } = req.body;

  if (!client) {
    return res.status(500).send("WhatsApp client not initialized");
  }

  try {
    const chats = await client.getChats();
    const groupChat = chats.find((chat) => chat.name === group_name);

    if (!groupChat) {
      return res.status(404).send("Group not found");
    }

    const messages = await client.loadAndGetAllMessagesInChat(
      groupChat.id._serialized,
      true,
      false,
      [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)]
    ); // Fetch messages from the last month

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages", error);
    res.status(500).send("Error fetching messages");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
