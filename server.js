require("dotenv").config();

const express = require("express")
const cors = require("cors");
const cookieParser = require("cookie-parser")
const pool = require("./db/db");
const authRoutes = require("./routes/auth-routes/authroutes");
const profileRoutes = require("./routes/home/profileroutes");
const sellerRoutes = require("./routes/seller/restaurantroutes")


const PORT = process.env.PORT || 5001;

const app = express();

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3001',
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
app.use("/shop", profileRoutes);
app.use("/seller", sellerRoutes);


pool.query("SELECT 1").then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
}).catch((error) => {
    console.error("DB Connection Fail", error)

});


