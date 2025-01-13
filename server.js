const express = require("express")
const cors = require("cors")
const mysql = require("mysql")


const app = express();
app.use(cors())
const PORT = process.env.PORT || 5001;






app.listen(PORT, () => console.log(`server is running on port ${PORT}`));