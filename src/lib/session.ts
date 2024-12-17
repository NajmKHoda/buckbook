import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { JWTPayload, jwtVerify, SignJWT } from 'jose';
import { ObjectIdType } from '@/lib/database/types';
import getEnv from './environment';
import { Session, SessionObject } from '@/lib/database/models/session';
import { AccountType } from '@/lib/database/models/user';
import connectToDatabase from '@/lib/database/connection';
import { Business, BusinessObject } from './database/models/business';
import { Employee, EmployeeObject } from './database/models/employee';
import { Customer, CustomerObject } from './database/models/customer';

interface SessionPayload extends JWTPayload {
    id: string;
}

const secret = getEnv('SESSION_SECRET');
const encodedSecret = new TextEncoder().encode(secret);
const sessionDurationMs = Number(getEnv('SESSION_DURATION')) * 1000;

/**
 * Creates a session for the user with the specified information.
 * @param accountId The account ID associated with this session.
 * @param accountType The account type associated with this session.
 */
export async function createSession(accountId: ObjectIdType, accountType: AccountType) {
    try {
        await connectToDatabase();
        const session = await Session.create({
            accountId,
            accountType,
            lastActive: new Date(Date.now())
        });

        const expirationTime = new Date(Date.now() + sessionDurationMs);
        const payload: SessionPayload = { id: session._id.toString() }
        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256'})
            .setIssuedAt()
            .setExpirationTime(expirationTime)
            .sign(encodedSecret);

        cookies().set('session', token, {
            httpOnly: true,
            expires: expirationTime,
            sameSite: 'lax',
            path: '/'
        });
    } catch {
        console.error('Failed to create session.');
    }
}

/**
 * Retrieves the current session.
 * @returns The session data, if found.
 */
export function getSession(redirectIfFound?: true): Promise<SessionObject>;
export function getSession(redirectIfFound: false | boolean): Promise<SessionObject | null>;
export async function getSession(redirectIfFound = true) {
    const sessionToken = cookies().get('session')?.value;
    if (!sessionToken) {
        if (redirectIfFound) redirect('/login');
        return null;
    }

    try {
        const { payload } = await jwtVerify<SessionPayload>(
            sessionToken, 
            encodedSecret,
            { algorithms: ['HS256'] }
        );

        const sessionId = payload.id;
        
        await connectToDatabase();
        const session = await Session.findById(sessionId).lean() as SessionObject | null;

        if (!session) {
            if (redirectIfFound) redirect('/login');
            return null;
        }

        return session;
    } catch {
        console.error('Session data retrieval failed.');

        if (redirectIfFound) redirect('/login');
        return null;
    }
}

type AccountObject<T extends AccountType | undefined> =
    T extends typeof AccountType.Business ? BusinessObject :
    T extends typeof AccountType.Customer ? CustomerObject :
    EmployeeObject

/**
 * Retrieves the account associated with the current session, if any.
 * @returns A Business/Employee/Customer account, or null if the account isn't found.
 */
export function getAccount(
    accountType?: undefined,
    redirectIfNone?: true
): Promise<BusinessObject | CustomerObject | EmployeeObject>
export function getAccount(
    accountType: undefined,
    redirectIfNone: false | boolean
): Promise<BusinessObject | CustomerObject | EmployeeObject | null>

/**
 * Retrieves the account of the specified type associated with the current session, if any.
 * @param accountType The expected account type.
 * @returns The account of the specified type, or null if the account isn't found.
 */
export function getAccount<T extends AccountType>(accountType: T, redirectIfNone?: true) : Promise<AccountObject<T>>
export function getAccount<T extends AccountType>(accountType: T, redirectIfNone: false) : Promise<AccountObject<T> | null>

export async function getAccount<T extends AccountType>(accountType?: T, redirectIfNone = true) {
    const session = await getSession(redirectIfNone);
    if (!session) {
        if (redirectIfNone) redirect('/login');
        return null;
    }

    if (accountType && session.accountType != accountType) {
        if (redirectIfNone) redirect('/login');
        return null;
    }

    let account: BusinessObject | EmployeeObject | CustomerObject | null;
    switch (session.accountType) {
        case AccountType.Business:
            account = await Business.findById(session.accountId).lean() as BusinessObject | null;
            break;
        case AccountType.Employee:
            account = await Employee.findById(session.accountId).lean() as EmployeeObject | null; 
            break;
        case AccountType.Customer:
            account = await Customer.findById(session.accountId).lean() as CustomerObject | null;
            break;
    }

    if (!account) {
        if (redirectIfNone) redirect('/login');
        return null;
    }

    return account;
}

export async function destroySession() {
    const session = await getSession();
    await Session.findByIdAndDelete(session._id);
    await cookies().delete('session');
    redirect('/login');
}