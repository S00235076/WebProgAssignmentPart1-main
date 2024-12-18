
/* external imports */

import express, {Application, Request, Response} from "express" ;
import dotenv from "dotenv";
import morgan from "morgan";
import cors from 'cors';

/* internal imports */

import userRoutes from './routes/users';
import recipeRoutes from './routes/recipes'
import {authenticateKey} from './middleware/auth.middleware';

const PORT = process.env.PORT || 3001;

const app: Application = express();

dotenv.config();

app.use(morgan("tiny"));
app.use(express.json());
app.use (cors())

//app.use(authenticateKey); - all the routes below

app.get("/ping", async (_req : Request, res: Response) => {
    res.json({
    message: "hello from Oran ",
    });
});


app.get('/bananas', async (_req : Request, res: Response) =>
  res.send('hello world, this is bananas - ha ha ha ha ha  '));

app.use('/api/v1/users',userRoutes)
app.use('/api/v1/recipes',recipeRoutes)

//usersCollection.updateOne(query, {$set : newData});

app.listen(PORT, () => {
    console.log("Server is running on port  --", PORT);
    });


