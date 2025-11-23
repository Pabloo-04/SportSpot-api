import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import adminGeneralRouter from "./routes/adminGeneralRoute.js";
import canchaRouter from "./routes/canchaRoute.js";
import userRouter from "./routes/userRoute.js";
import { startReminderCron } from "./cron/sendReminder.js";

const app = express();
const port = process.env.PORT || 3000;

await connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/admin-general", adminGeneralRouter);
app.use("/api/cancha", canchaRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
    res.send("API funcional");
});

app.listen(port, () => {
    console.log("servidor corriendo en puerto", port);
    startReminderCron();
});
