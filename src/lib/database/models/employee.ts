import { Schema, model, models, Types, HydratedDocument } from 'mongoose';
import { ObjectIdType, ObjectIdSchema } from '../types';

interface IEmployee {
    name: string,
    bio: string,
    email: string,
    phone: string,
    business: ObjectIdType
}

const employeeSchema = new Schema<IEmployee>({
    name: { type: String, required: true },
    bio: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    business: { type: ObjectIdSchema, ref: 'Business', required: true }
});

export type EmployeeDocument = HydratedDocument<IEmployee>;
export type EmployeeObject = IEmployee & { _id: ObjectIdType }
export const Employee = models.Employee || model<IEmployee>('Employee', employeeSchema);