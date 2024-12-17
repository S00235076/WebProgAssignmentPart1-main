import { MongoClient, Db, Collection}  from "mongodb";
import  dotenv from "dotenv";
import {User} from './models/user'
import { Recipe } from "./models/recipe";


  dotenv.config();

  
  const connectionString : string  = process.env.DB_CONN_STRING || "mongodb+srv://s00235076:nonesense@ws4.agdwk.mongodb.net/?retryWrites=true&w=majority";
  const dbName : string = process.env.DB_NAME || "WS4";
  const client = new MongoClient(connectionString);

let db : Db 
  export let usersCollection : Collection<User>;
  export let recipesCollection : Collection<Recipe>;
 

  

client.connect().then
(()=>
  {
  db = client.db(dbName);
  usersCollection  = db.collection('users');
  recipesCollection  = db.collection('recipe');
  
  

  console.log('Connected to database');
}
)
.catch ((error) => 
{
    if (error instanceof Error)
    {
     console.log(`issue with db connection ${error.message}`);
    }
    else{
      console.log(`error with ${error}`)
    }
  });

  