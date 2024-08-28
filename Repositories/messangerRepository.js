const { client } = require("../PGConnection/pgClientConnection");

const updateSocketId = async (employeeid, socketid) => {
    try {
        await client.query('UPDATE messangeruser SET socketid = $1 WHERE employeeid = $2', [socketid, employeeid])
        console.log(`Socket ID ${socketid} updated for Employee ID ${employeeid} ------ 1`)
    } catch (err) {
        console.error('Error updating Socket ID', err)
        throw err
    }
}

const getSocketIdByEmployeeId = async (employeeid) => {
    try {
        const res = await client.query('SELECT socketid FROM messangeruser WHERE employeeid = $1', [employeeid]);
        return res.rows.length > 0 ? res.rows[0].socketid : null;
    } catch (err) {
        console.error('Error fetching Socket ID', err);
        throw err;
    }
}

const createPrivateMessage =  async (senderid, receiverid, messagecontent ) => {
    console.log("sendPrivateMessage Repo", senderid, receiverid, messagecontent)
  
    try {
        const result = await client.query(
            `INSERT INTO allprivatemessages (senderid, receiverid, messagecontent, isread)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [senderid, receiverid, messagecontent, false]  
        )
        console.log(result.rows[0], "Message Created")
        return result.rows[0]
    } catch (err) {
        console.error('Error inserting message', err)
        throw err
    }
};

module.exports = { updateSocketId, getSocketIdByEmployeeId, createPrivateMessage };
