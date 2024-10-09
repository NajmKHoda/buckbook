'use server';

import { redirect } from 'next/navigation';
import { hash } from 'bcrypt'
import connectToDatabase from '@/lib/database/connection';
import { Customer, CustomerDocument } from '@/lib/database/models/customer';
import { User, AccountType } from '@/lib/database/models/user';
import { createSession } from '@/lib/session';
import { Business, BusinessDocument } from '@/lib/database/models/business';
import { z } from 'zod';
import { arrayFromGenerator, objectFromFormData } from '@/lib/formDataParsing';

const customerSchema = z.object({
    name: z.string().trim(),
    email: z.string().includes('@'),
    phone: z.string().regex(/^\d{3}-\d{3}-\d{3}/),
    username: z.string().trim().min(5).max(20).regex(/^\w+$/),
    password: z.string()
})

const customerFormat = {
    name: 'name',
    email: 'email-address',
    phone: 'phone-number',
    username: 'username',
    password: 'password'
}

export async function handleCustomerSignUp(formData: FormData) {
    const rawData = objectFromFormData(formData, customerFormat);
    const parseResult = customerSchema.safeParse(rawData);
    if (!parseResult.success) return;

    const { name, email, phone, username, password } = parseResult.data;
    const encryptedPassword = await hash(password, 12);

    await connectToDatabase();
    const newCustomer: CustomerDocument = new Customer({ name, email, phone });
    await Promise.all([
        newCustomer.save(),
        User.create({
            username,
            password: encryptedPassword,
            accountType: AccountType.Customer,
            accountId: newCustomer.id
        }),
        createSession(newCustomer.id, AccountType.Customer)
    ]);
    
    redirect('/customer/dashboard');
}

const businessSchema = z.object({
    name: z.string().trim().min(1),
    description: z.string().min(1),
    email: z.string().includes('@'),
    phone: z.string().regex(/^\d{3}-\d{3}-\d{3}/),
    hours: z.object(
        {
            opening: z.string().regex(/^\d{2}:\d{2}$/).optional(),
            closing: z.string().regex(/^\d{2}:\d{2}$/).optional(),
        })
        .refine(value =>
            !value.opening && !value.closing ||
            (value.opening && value.closing &&
            value.opening < value.closing &&
            value.opening >= '00:00' && value.closing <= '23:59')
        ).array(),
    appointmentDuration: z.coerce.number().int(),
    username: z.string().trim().min(5).max(20).regex(/^\w+$/),
    password: z.string()
})

const businessFormat = {
    name: 'business-name',
    description: 'description',
    email: 'email-address',
    phone: 'phone-number',
    hours: arrayFromGenerator(7, i => ({
        opening: `opening${i}`,
        closing: `closing${i}`
    })),
    appointmentDuration: 'appointment-duration',
    username: 'username',
    password: 'password'
}

export async function handleBusinessSignUp(formData: FormData) {
    const rawData = objectFromFormData(formData, businessFormat);
    const parseResult = businessSchema.safeParse(rawData);
    if (!parseResult.success) return;

    const {
        name,
        description,
        phone,
        email,
        hours,
        appointmentDuration,
        username,
        password 
    } = parseResult.data;
    const encryptedPassword = await hash(password, 12);

    await connectToDatabase();
    const newBusiness: BusinessDocument = new Business({
        name,
        description,
        phone,
        email,
        hours: hours.map(day => {
            if (day.opening && day.closing) {
                return { isOpen: true, ...day }
            } else {
                return { isOpen: false }
            }
        }),
        appointmentDuration
    });
    
    await Promise.all([
        newBusiness.save(),
        User.create({
            username,
            password: encryptedPassword,
            accountId: newBusiness.id,
            accountType: AccountType.Business
        }),
        createSession(newBusiness.id, AccountType.Business)
    ]);

    redirect('/business/dashboard');
}