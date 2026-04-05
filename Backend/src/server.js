import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
connectDB();

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`server is up and running on port ${PORT}`)
        });
    } catch (error) {
        console.error("failed to start server:", error.message);
        process.exit(1);
    }
};