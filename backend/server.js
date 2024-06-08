import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/Database.js";
import router from "./routes/index.js";
import storage from "./config/Firebase.js";
import InfraModel from "./models/InfraModel.js";
import Users from "./models/UserModel.js";
import Aplikasi from "./models/Aplikasi.js";
import Sekretariat from "./models/SekretariatModel.js";

dotenv.config();

const app = express();

app.get('/hello', (req, res) => {
    res.send('Hello, World!');
});

app.use((req, res, next) => {
    const clientTimezone = req.get("Client-Timezone");
    if (clientTimezone) {
        req.clientTimezone = clientTimezone;
    }
    next();
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

const startServer = async () => {
    try {
        await db.authenticate();
        console.log("Database Connected...");
        console.log("Firestorage initialized " + JSON.stringify(storage));
        
        await Aplikasi.sync();
        await InfraModel.sync();
        await Users.sync();
        await Sekretariat.sync();
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1); // Exit process with failure
    }

    const PORT = process.env.DB_PORT; // Default to port 3000 if PORT is not set
    app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
};

startServer();