const mySqlPool = require('../db/db'); // Import promise-based pool
const nodemailer = require("nodemailer")

const createTable = async (schema) => {
    try {
        const [results] = await mySqlPool.query(schema); // Use promise-based query
        return results;
    } catch (err) {
        throw new Error(`Error creating table: ${err.message}`);
    }
};

// const checkRecordExists = async (tableName, column, value) => {
//     try {
//         const query = `SELECT * FROM \`${tableName}\` WHERE \`${column}\` = ?`;
//         const [results] = await mySqlPool.query(query, [value]); // Use promise-based query
//         return results.length ? results[0] : null;
//     } catch (err) {
//         throw new Error(`Error checking record: ${err.message}`);
//     }
// };

const checkRecordExists = async (tableName, columns, values) => {
    try {
        // Generate query conditions for multiple columns
        const conditions = columns.map((col) => `\`${col}\` = ?`).join(" OR ");
        const query = `SELECT * FROM \`${tableName}\` WHERE ${conditions} LIMIT 1`;

        // Execute query with parameterized values
        const [results] = await mySqlPool.query(query, values);
        return results.length ? results[0] : null;
    } catch (err) {
        throw new Error(`Error checking record: ${err.message}`);
    }
};



const insertRecord = async (tableName, record) => {
    try {
        const query = `INSERT INTO \`${tableName}\` SET ?`;
        const [results] = await mySqlPool.query(query, record); // Use promise-based query
        return results;
    } catch (err) {
        throw new Error(`Error inserting record: ${err.message}`);
    }
};


const sendMail = async (email, emailSubject, content) => {

    try {

        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: emailSubject,
            html: content
        }

        transport.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);

            } else {
                console.log("Mail sent Successsfully", info.response);

            }
        });



    } catch (error) {
        console.log(error.message);

    }
}





module.exports = { createTable, checkRecordExists, insertRecord, sendMail };
