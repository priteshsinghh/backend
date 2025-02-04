require("dotenv").config();

const express = require("express")
const cors = require("cors");
const cookieParser = require("cookie-parser")
const mySqlPool = require("./db/db");
const authRoutes = require("./routes/auth-routes/authroutes");
const profileRoutes = require("./routes/home/profileroutes");

const adminProductRouter = require("./routes/admin/product-rotes")


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


app.use("/admin/products",adminProductRouter)

app.use("/home", profileRoutes);


mySqlPool.query("SELECT 1").then(() => {

    //db connection
    console.log("Database connected successfully");

    app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
}).catch((error) => {
    console.log("DB Connection Fail")

});


