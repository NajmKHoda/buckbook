import { Schema, model, models, HydratedDocument } from 'mongoose';
import { ObjectIdType, ObjectIdSchema } from '../types';

export enum AccountType {
    Customer = 'CUSTOMER',
    Employee = 'EMPLOYEE',
    Business = 'BUSINESS'
}
const accountTypes = Object.values(AccountType);

interface IUser {
    username: string;
    password: string;
    accountType: AccountType;
    accountId: ObjectIdType;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accountType: { type: String, required: true, enum: accountTypes },
    accountId: { type: ObjectIdSchema, required: true }
});

export type UserDocument = HydratedDocument<IUser>;
export type UserObject = IUser & { _id: ObjectIdType };
export const User = models.User || model<IUser>('User', userSchema);