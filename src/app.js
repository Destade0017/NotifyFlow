import express from "express";
import authRoutes from "./routes/auth.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";

const app = express();

app.use(express.json());

//basic routes
app.get("/", (req, res) => {
    res.send("Api is running!!!")
})

//simple health endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Notifyflow API is running",
        timestamps: Date()
    })
})

//basic app routes 
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);

export default app;