import { Types, Schema } from 'mongoose';

export type Populated<DocObject, PopulatedProperty extends keyof DocObject, PopulatingObject> = {
    [key in keyof DocObject]: key extends PopulatedProperty ? PopulatingObject | null : DocObject[key];
}

export type ObjectIdType = Types.ObjectId
export const ObjectIdSchema = Schema.Types.ObjectId;