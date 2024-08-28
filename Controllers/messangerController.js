const messageRepo = require("../Repositories/messangerRepository");
// const { getSocketIdByEmployeeId, updateSocketId } = require("../Repositories/messangerRepository");

const handleSocketEvents = (io) => {
    io.on("connection", (socket) => {
        console.log("User Connected", socket.id);

        socket.on('appendSocketid_into_DB', async ({ employeeid, socketid }) => {
            if (employeeid && socketid) {
                try {
                    await messageRepo.updateSocketId(employeeid, socketid);
                } catch (err) {
                    console.error('Error updating Socket ID in DB', err);
                }
            }
        });

        socket.on('sendPrivateMessage', async ({ senderid, receiverid, message }) => {
            try {
                console.log("sendPrivateMessage Controler", senderid, receiverid, message)
                const receiverSocketId = await messageRepo.getSocketIdByEmployeeId(receiverid)
                if (receiverSocketId) {

                    socket.to(receiverSocketId).emit('privateMessage', { senderid, message })  
                    // return console.log(senderid, receiverSocketId, message, "12")     
                
                    return await messageRepo.createPrivateMessage(senderid, receiverid, message)    
                
                } else {
                    console.error('Receiver not found or no socket ID available');
                }
            } catch (err) {
                console.error('Error sending private message', err);
            }
        });

        socket.on("disconnect", () => {
            console.log("User Disconnected", socket.id);
        });
    });
};

module.exports = handleSocketEvents;
