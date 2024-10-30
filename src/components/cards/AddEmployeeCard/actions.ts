'use server';

import { objectFromFormData } from '@/lib/formDataParsing';
import { Types } from 'mongoose'
import { z } from 'zod'
import { hash } from 'bcrypt'
import { Employee } from '@/lib/database/models/employee';
import { AccountType, User } from '@/lib/database/models/user';

const employeeFormat = {
    name: 'name',
    bio: 'bio',
    email: 'email-address',
    phone: 'phone-number',
    username: 'username',
    password: 'password'
}

const employeeSchema = z.object({
    name: z.string().trim(),
    bio: z.string(),
    email: z.string().includes('@'),
    phone: z.string().regex(/^\d+$/),
    username: z.string().trim().min(5).max(20).regex(/^\w+$/),
    password: z.string()
})

export async function handleEmployeeCreation(businessId: string, formData: FormData) {
    const rawData = objectFromFormData(formData, employeeFormat)
    const parseResult = employeeSchema.safeParse(rawData);
    if (!parseResult.success) return;

    const { name, bio, email, phone, username, password } = parseResult.data;
    const encryptedPassword = await hash(password, 12);

    const newEmployee = new Employee({
        name,
        bio,
        email,
        phone,
        business: new Types.ObjectId(businessId)
    })

    await Promise.all([
        newEmployee.save(),
        User.create({
            username,
            password: encryptedPassword,
            accountType: AccountType.Employee,
            accountId: newEmployee._id
        })
    ]);
}