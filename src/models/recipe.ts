import { ObjectId } from "mongodb";
import Joi from 'joi';


export interface Recipe {
    _id: ObjectId;
    name: string;
    category: string;
    ingredients : string;
    method: string;
    dateJoined? : Date;
    lastUpdated?: Date;
}

export const ValidateUser = (Recipe : Recipe) => {

    const contactJoiSchema = Joi.object<Recipe>({
       name: Joi.string().min(3).required() ,
       category: Joi.string().min(10),
       ingredients: Joi.string().required(),
       method: Joi.string().required()    
    })

    return contactJoiSchema.validate(Recipe);
}
