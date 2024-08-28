const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { connectDB } = require("./PGConnection/pgClientConnection")
const { Server } = require("socket.io");
const handleSocketEvents = require("./Controllers/messangerController");
require('dotenv').config()

const app = express();
app.use(express.json());
app.use(express.urlencoded());

app.use(cors({origin: '*', methods: ['GET', 'POST'], credentials: true}))
// app.use(route);

const server = createServer(app)
const io = new Server(server, {cors: { origin: "*",  methods: ["GET", "POST"], credentials: true }})


connectDB()
handleSocketEvents(io)


const PORT = process.env.PORT || 9002
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))