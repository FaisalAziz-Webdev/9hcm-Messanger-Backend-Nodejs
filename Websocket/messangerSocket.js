const { Server } = require("socket.io");
const { client } = require('../PGConnection/pgClientConnection'); // Importing from pgClient

const messangerSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", 
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("User Connected", socket.id);

        socket.on('appendSocketid_into_DB', ({ employeeid, socketid }) => {
            // console.log(employeeid, socketid,"appendSocketid_into_DB")
            if (employeeid && socketid) {
                client.query(`UPDATE messangeruser SET socketid = $1 WHERE employeeid = $2`, [socketid, employeeid])
                    .then(() => console.log(`Socket ID ${socketid} inserted or updated for Employee ID ${employeeid}`))
                    .catch((err) => console.error('Error updating Socketid', err))
            }
        })

        socket.on('privateMessage', ({ senderid, message }) => {
            console.log(`Private message from ${senderid}: ${message}`);
            // You can update the UI or perform other actions with the received message here
        })
        
        socket.on('sendPrivateMessage', async ({ senderid, receiverid, message }) => {

            console.log(senderid, receiverid, message, "resresresresresres")
            // return

            try {
                // Fetch the receiver's socket ID from the database
                const res = await client.query('SELECT socketid FROM messangeruser WHERE employeeid = $1', [receiverid]);

                console.log(res, "resresres")
                if (res.rows.length > 0) {
                    const receiverSocketId = res.rows[0].socketid;
                    console.log(receiverSocketId, "receiverSocketId")


                    // Send the private message to the receiver
                    socket.to(receiverSocketId).emit('privateMessage', { senderid, message })
                    console.log(`Message sent`)
                } else {
                    console.error('Receiver not found or no socket ID available');
                }
            } catch (err) {
                console.error('Error sending private message', err);
            }

        })


        socket.on("disconnect", () => {
            console.log("User Disconnected", socket.id)
        })
    })
    return io;
}

module.exports = messangerSocket
