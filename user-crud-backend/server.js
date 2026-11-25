import userRoutes from "./routes/userRoutes.js";
import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("User CRUD API is running!");
});

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
