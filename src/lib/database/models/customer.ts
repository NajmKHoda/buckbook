import { HydratedDocument, Schema, model, models } from 'mongoose';
import { ObjectIdType } from '../types';

interface ICustomer {
    name: string,
    email: string,
    phone: string
}

const customerSchema = new Schema<ICustomer>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
});

export type CustomerDocument = HydratedDocument<ICustomer>;
export type CustomerObject = ICustomer & { _id: ObjectIdType }
export const Customer = models.Customer || model<ICustomer>('Customer', customerSchema);