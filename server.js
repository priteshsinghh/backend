require("dotenv").config();

const express = require("express")
const cors = require("cors");
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth-routes/authroutes");
const mySqlPool = require("./db/db");


const PORT = process.env.PORT || 5001;

const app = express();

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: [
        "Content-Type",
        'Authorization',
        'Cache-Control',
        'Expires',
        'Pragma'
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRoutes);


mySqlPool.query("SELECT 1").then(() => {

    //db connection
    console.log("Database connected successfully");

    app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
}).catch((error) => {
    console.log("DB Connection Fail")

});


