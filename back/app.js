const express = require("express");
const cors = require("cors");
const app = express();

const procedureRouter = require("./routes/procedureRoutes");
const userRoutes = require('./routes/userRoutes');

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});

app.use(express.json());

app.use("/api/v1/procedures/", procedureRouter);
app.use('/api/v1/users', userRoutes);

module.exports = app;
