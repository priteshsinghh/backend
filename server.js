const express = require("express")
const cors = require("cors");
const authRoutes = require("./routes/auth-routes/authroutes");
const mySqlPool = require("./db/db");


const PORT = process.env.PORT || 5001;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", authRoutes);


mySqlPool.query("SELECT 1").then(() => {

    //db connection
    console.log("Database connected successfully");
    
    app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
}).catch((error) => {console.log("DB Connection Fail")

});


