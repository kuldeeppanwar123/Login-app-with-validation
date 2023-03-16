import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { dbConfig } from './src/config/dbConfig.js';
import router from './src/routers/loginRouter.js';
import 'dotenv/config'
const app = express();


app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by')


app.get('/',(req,res)=>{
    res.status(201).json("Home page");
})

app.use('/api',router);

dbConfig().then(()=>{
    try {
        const port = process.env.PORT;
        app.listen(port,()=>{
            console.log('server is listening at '+port);
        })
    } catch (error) {
        console.log("can't connect to server");
    }
}).catch(function(error){
    console.log('invalid database connection!');
})