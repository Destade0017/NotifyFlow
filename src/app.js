import express from "express";

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

export default app;