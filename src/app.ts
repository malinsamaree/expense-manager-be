import express, {Express, ErrorRequestHandler} from 'express';
import {config} from 'dotenv'
config();
import {Server} from 'http';
import createError from 'http-errors';
import router from "./routes/expenses.routes";
import cors from 'cors';
import mongoose from "mongoose";

mongoose.connect(`mongodb+srv://malinsamare:${process.env.DB_PASSWORD}@cluster0.1rw7o.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(() => console.log('mongodb connected'))
    .catch(() => {
        // has to manage this error by giving a proper feedback to the customer (may be server error)
        console.log('mongodb connection error')
    });


const app: Express = express();
app.use(express.json());
app.use(cors());
app.use("/expense-manager", router);

app.use((req, res, next) => {
    next(new createError.NotFound());
});

const errorRequestHandler:ErrorRequestHandler = (err, req, res, next) => {
    res.send({
        error: true,
        message: err.message,
        status: err.status
    });
}

app.use(errorRequestHandler);

const port  = process.env.PORT || 8085
const server:Server = app.listen(port, () => {
    console.log(`app is listening at port ${port}`);
})