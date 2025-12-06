import express from 'express';
import cors from 'cors';
import connectDB from './config/connectDB.js';
import mainRouter from './routes/main.routes.js'
import { DOMAIN } from './config/env.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
}));

// app.use(cors());

// connect to database
connectDB();

// all routes
app.use('/api/v1', mainRouter);

const port = process.env.PORT || 5500;

app.listen(port, () => {
    console.log(`server listening at port: ${port}`);
    console.log(`access all api at http://localhost:${port}`);
})