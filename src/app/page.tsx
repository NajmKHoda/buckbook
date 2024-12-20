import { AccountType } from '@/lib/database/models/user';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function RootPage() {
    const session = await getSession();

    switch (session.accountType) {
        case AccountType.Business:
            redirect('/business/dashboard');
        case AccountType.Customer:
            redirect('/customer/dashboard');
        case AccountType.Employee:
            redirect('/employee/dashboard');
    }
}