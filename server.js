const express = require("express")
const cors = require("cors");
const mySqlPool = require("./db/db");


const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5001;

mySqlPool.query("SELECT 1").then(() => {

    //db connection
    console.log("Database connected successfully");
    
    app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
}).catch((error) => {console.log("DB Connection Fail")

});


