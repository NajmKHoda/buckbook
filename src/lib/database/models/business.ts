import { HydratedDocument, Schema, model, models } from 'mongoose';
import { ObjectIdType } from '../types';

export interface Hours {
    isOpen: boolean
    opening?: string,
    closing?: string
}

interface IBusiness {
    name: string,
    description: string,
    phone: string,
    email: string,
    hours: Hours[],
    appointmentDuration: number;
}

const businessSchema = new Schema<IBusiness>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    hours: [{
        _id: false,
        isOpen: Boolean,
        opening: String,
        closing: String
    }],
    appointmentDuration: { type: Number, required: true }
});

export type BusinessDocument = HydratedDocument<IBusiness>;
export type BusinessObject = IBusiness & { _id: ObjectIdType };
export const Business = models.Business || model<IBusiness>('Business', businessSchema);