const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const messangerSocket = require("./Websocket/messangerSocket");
const { connectDB } = require("./PGConnection/pgClientConnection")
require('dotenv').config()

const app = express();
app.use(express.json());
app.use(express.urlencoded());

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'],
    credentials: true,
}));
// app.use(route);
const server = createServer(app)
connectDB()
messangerSocket(server)


const PORT = process.env.PORT || 9002
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))