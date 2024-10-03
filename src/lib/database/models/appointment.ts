import { Schema, model, models, HydratedDocument } from 'mongoose';
import { ObjectIdType, ObjectIdSchema } from '../types';

interface IAppointment {
    employee: ObjectIdType,
    customer: ObjectIdType,
    date: Date
}

const appointmentSchema = new Schema<IAppointment>({
    employee: { type: ObjectIdSchema, ref: 'Employee', required: true },
    customer: { type: ObjectIdSchema, ref: 'Customer', required: true },
    date: { type: Date, required: true }
});

export type AppointmentDocument = HydratedDocument<IAppointment>;
export type AppointmentObject = IAppointment & { _id: ObjectIdType }
export const Appointment = models.Appointment || model<IAppointment>('Appointment', appointmentSchema);