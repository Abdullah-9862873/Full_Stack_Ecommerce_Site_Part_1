const app = require("./app");

const dotenv = require("dotenv");

const connectDatabase = require("./config/database");

//config
dotenv.config({path:"backend/config/config.env"});

// Connecting Database
connectDatabase();

app.listen(process.env.PORT, ()=>{
    console.log(`Server is listening on http://localhost:${process.env.PORT}`);
})