import { ObjectId } from 'mongoose';
import { Employee, EmployeeObject } from '@/lib/database/models/employee';
import EmployeeCard from '@/components/cards/EmployeeCard/EmployeeCard';
import AddEmployeeCard from '@/components/cards/AddEmployeeCard/AddEmployeeCard';
import styles from './page.module.css';
import { getAccount } from '@/lib/session';
import { AccountType } from '@/lib/database/models/user';

export default async function BusinessDashboard() {
    const business = await getAccount(AccountType.Business);
    const employees = await Employee.find({ business: business._id }).lean() as EmployeeObject[];

    return (
        <section>
            <h2>Employees</h2>
            <div className={styles.employeesContainer}>
                {employees.toSorted((a, b) => {
                    if (a.name === b.name) return 0;
                    else if (a.name < b.name) return -1;
                    else return 1;
                }).map(employee => 
                    <EmployeeCard key={employee._id.toString()} employeeJSON={JSON.stringify(employee)} />
                )}
                <AddEmployeeCard businessId={business._id.toString()}/>
            </div>
        </section>
    )
}