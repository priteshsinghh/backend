const mySqlPool = require('../db/db'); // Import promise-based pool

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

module.exports = { createTable, checkRecordExists, insertRecord };
