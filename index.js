import express from 'express';
import passport from 'passport';
import   _connectDB    from './config/db.js';
import session from 'express-session';
import userRouter from './routes/user.route.js';
import adminRouter from './routes/admin-route.js';
import MongoStore from 'connect-mongo';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import './config/passport.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 8089;
app.use(session({
    secret: 'fitaf secret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({mongoUrl:process.env.MongoDB_ATLAS, collectionName: "sessions" } ),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))
app.use(passport.initialize());
app.use(passport.session())


app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type");
      next();
    });

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());

app.listen(port, ()=>{
    console.log(`Server running on http://localhost:${port}`)
    _connectDB();
});
app.get('/', (req,res,next)=>{
    res.status(200).sendFile(path.join(__dirname, '/index.html'));

})
app.use('/api', userRouter);
app.use('/api', adminRouter);

