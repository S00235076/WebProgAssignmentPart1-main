import { ObjectId } from "mongodb";
import Joi from 'joi';


export interface User {
    _id?: ObjectId;
    name: string;
    phonenumber: string;
    email: string;
    dateJoined? : Date;
    lastUpdated?: Date;
    password?: string;
    hashedPassword?: string;
  
}

export const ValidateUser = (user : User) => {

    const contactJoiSchema = Joi.object<User>({
        name: Joi.string().min(3).required(),
        phonenumber: Joi.string().min(10),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(64).required(),
    
    })

    return contactJoiSchema.validate(user);
}
