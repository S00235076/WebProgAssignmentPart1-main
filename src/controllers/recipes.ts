import { Request, Response } from 'express';
import { usersCollection } from "../database";
import {User, ValidateUser} from '../models/user'
import { ObjectId} from 'mongodb';
import Joi from 'joi';
import { Recipe } from '../models/recipe';
import {recipesCollection} from "../database";

export const getRecipes =async  (req: Request, res: Response) => {
   
  try {
   const recipes = (await recipesCollection.find({}).toArray()) as Recipe[];
   res.status(200).json(recipes);

 } catch (error) {

  if (error instanceof Error)
  {
    console.log(`Error with get ${error.message}`)
  }
   res.status(500).send("oppss");
 }
};


export const getRecipeById = async (req: Request, res: Response) => {
  //get a single  user by ID from the database
  
  let id:string = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };
    const user = (await usersCollection.findOne(query)) as User;

    if (user) {
        res.status(200).send(user);
    }
} catch (error) {
  if (error instanceof Error)
  {
    console.log(`issue with getting a single recipe ${error.message}`)
  }
  else{
    console.log(`issue with getting a single recipe ${error}`)
  }

    res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
}
};

export const createRecipe = async (req: Request, res: Response) => {
  // create a new user in the database
  try {

   // let validateResult : Joi.ValidationResult = ValidateUser(req.body)

    // if (validateResult.error) {
    //   res.status(400).json(validateResult.error);
    //   return;
    // }
   

    const newRecipe = req.body as Recipe;
    console.table(newRecipe)

    newRecipe.dateJoined = new Date();
    newRecipe.lastUpdated = new Date();

    const result = await recipesCollection.insertOne(newRecipe)

    if (result) {
        res.status(201)
        .location(`${result.insertedId}`)
        .json({message : 
          `Created a new recipe with id ${result.insertedId}`})}
        else {
        res.status(500).send("Failed to create a new recipe.");
        }
    }
   catch (error) {
    if (error instanceof Error)
    {
     console.log(`issue with inserting ${error.message}`);
    }
    else{
      console.log(`error with ${error}`)
    }
    res.status(400).send(`Unable to create new recipe`);
}
};


export const updateRecipe = async (req: Request, res: Response) => {
  // update a user in the database

 const {name, category, ingredients, method } = req.body;

  let id:string = req.params.id;
 

  const newData: Partial<Recipe> =
  {
    lastUpdated: new Date(),
  }

  if (name) newData.name = name;
  if(category) newData.category = category;
  if (ingredients) newData.ingredients = ingredients;
  if(method) newData.method = method;

  // still need to validate the data

  try {

    const query = { _id: new ObjectId(id) };
    const result = await recipesCollection.updateOne(query, {$set : newData});

    if (result.modifiedCount > 0) {
      res.status(200).json({message : `Updated recipe`})}
    else if (result.matchedCount = 0){
      res.status(400).json({message: `Failed to update recipe.`});
      }
      else 
      {
        res.status(404).json({"Message" : `${id} not found `});
      }
  }
  catch (error) {
    if (error instanceof Error)
    {
      console.log(`error with ${error.message}`);
    }
    else {
      console.error(error);
    }
    res.status(400).send(`Unable to update recipe ${req.params.id}`);
}
};


export const deleteRecipe = async (req: Request, res: Response) => { 
  
  let id:string = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };
    const result = await recipesCollection.deleteOne(query);

    if (result && result.deletedCount) {
        res.status(202).json({message :`Successfully removed recipe with id ${id}`});
    } else if (!result) {
        res.status(400).json({message: `Failed to remove recipe with id ${id}`});
    } else if (!result.deletedCount) {
        res.status(404).json({message: `no recipe found with id ${id}`});
    }
} catch (error) {
  if (error instanceof Error)
   console.error(`eror with ${error.message}`);
   else {
    console.error(error);
  }
  res.status(400).send(`Unable to delete recipe ${req.params.id}`);
}
};
