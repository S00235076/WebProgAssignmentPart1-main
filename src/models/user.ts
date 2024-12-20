import { ObjectId } from "mongodb";
import Joi from 'joi';

enum role {admin, editor, ''}

export interface User {
    _id?: ObjectId;
    name: string;
    phonenumber: string;
    email: string;
    dateJoined? : Date;
    lastUpdated?: Date;
    password?: string;
    hashedPassword?: string;
    role?:role;
}

export const ValidateUser = (user : User) => {

    const contactJoiSchema = Joi.object<User>({
        name: Joi.string().min(3).required(),
        phonenumber: Joi.string().min(10),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(64).required(),
        role: Joi.string().valid(...Object.values(role))
    })

    return contactJoiSchema.validate(user);
}
