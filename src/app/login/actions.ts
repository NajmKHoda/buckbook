'use server';

import { AccountType, User, UserObject } from "@/lib/database/models/user";
import { objectFromFormData } from "@/lib/formDataParsing";
import { z } from "zod";
import { compare } from 'bcrypt';
import { redirect } from "next/navigation";
import { createSession } from "@/lib/session";
import connectToDatabase from '@/lib/database/connection';

const loginFormat = {
    username: 'username',
    password: 'password'
}

const loginSchema = z.object({
    username: z.string().min(5).max(20).regex(/^\w+$/),
    password: z.string()
})

type LoginStatus = 'initial' | 'user-not-found' | 'incorrect-password' | 'unknown-error';

export async function handleLogin(_: LoginStatus, formData: FormData): Promise<LoginStatus> {
    const rawData = objectFromFormData(formData, loginFormat);
    const parseResult = loginSchema.safeParse(rawData);
    if (!parseResult.success) return 'unknown-error';

    const { username, password } = parseResult.data;

    await connectToDatabase();
    const user = await User.findOne({ username }).lean() as UserObject;
    if (!user) return 'user-not-found';
    const passwordMatches = await compare(password, user.password);
    if (!passwordMatches) return 'incorrect-password';

    await createSession(user.accountId, user.accountType);
    switch (user.accountType) {
        case AccountType.Business:
            redirect('/business/dashboard');
        case AccountType.Customer:
            redirect('/customer/dashboard');
        case AccountType.Employee:
            redirect('/employee/dashboard');
    }
}