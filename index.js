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
      undefined,
      {
        headless: "new", // Use the new headless mode
        useChrome: false, // If you're using the Chromium installed via snap, disable Chrome usage
        browserArgs: ["--no-sandbox", "--disable-setuid-sandbox"], // Additional arguments to bypass sandboxing issues
      }
    )
    .then((clientInstance) => {
      client = clientInstance;
      start(client);
      console.log("WhatsApp client initialized and listen messages!");
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
    const chats = await client.getAllChats();
    const groupChat = chats.find((chat) => chat.name === group_name);

    console.log(" ==> group name ==> ", group_name);
    console.log(" ==> group chat ==> ", JSON.stringify(groupChat));

    if (!groupChat) {
      return res.status(404).send("Group not found");
    }

    const messages = await client.getAllMessagesInChat(
      groupChat.id._serialized,
      true,
      false
    ); // Fetch messages from the last month

    console.log(
      " ==> group messages ==> ",
      JSON.stringify(messages.slice(messages.length - 2))
    );

    res.json({ messages });
  } catch (error) {
    console.error("Error fetching messages", error);
    res.status(500).send("Error fetching messages");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function start(client) {
  client.onMessage((message) => {
    console.log(" ==> start function ==> message: ", JSON.stringify(message));

    // client
    //   .sendText(message.from, "Welcome Venom 🕷")
    //   .then((result) => {
    //     console.log("Result: ", result); //return object success
    //   })
    //   .catch((error) => {
    //     console.error("Error when sending: ", error); //return object error
    //   });
  });
}
