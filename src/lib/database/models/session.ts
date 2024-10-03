import { Schema, model, models, HydratedDocument} from 'mongoose'
import { ObjectIdType, ObjectIdSchema } from '../types';
import { AccountType } from './user';
import getEnv from '@/lib/environment';

interface ISession {
    accountId: ObjectIdType;
    accountType: AccountType;
    lastActive: Date;
}

const accountTypes = Object.values(AccountType);
const sessionDuration = Number(getEnv('SESSION_DURATION'));
const sessionSchema = new Schema<ISession>({
    accountId: { type: ObjectIdSchema, required: true },
    accountType: { type: String, required: true, enum: accountTypes },
    lastActive: { type: Date, required: true, expires: sessionDuration }
});

export type SessionDocument = HydratedDocument<ISession>;
export type SessionObject = ISession & { _id: ObjectIdType };
export const Session = models.Session || model<ISession>('Session', sessionSchema);