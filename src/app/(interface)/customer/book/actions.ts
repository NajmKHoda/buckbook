'use server';

import connectToDatabase from '@/lib/database/connection'
import { Business, BusinessObject } from '@/lib/database/models/business';

interface BusinessDescription {
    name: string,
    id: string
}

export async function handleBusinessSearch(_: BusinessDescription[], formData: FormData) {
    const search = formData.get('search');
    if (!search || typeof search != 'string') return [];

    await connectToDatabase();
    const regex = new RegExp(`^${search}`);
    const businesses = await Business.find({ name: regex }).select('name') as Pick<BusinessObject, 'name' | '_id'>[];
    
    return businesses.map(business => ({
        name: business.name,
        id: business._id.toString()
    })) as BusinessDescription[];
}