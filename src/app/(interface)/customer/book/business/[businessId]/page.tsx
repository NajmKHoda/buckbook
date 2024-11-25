import { Business, BusinessObject } from "@/lib/database/models/business";
import { Employee, EmployeeObject } from "@/lib/database/models/employee";
import { isObjectIdOrHexString } from "mongoose"
import { redirect } from "next/navigation"
import styles from './page.module.css';
import Card from "@/components/cards/Card";
import Icon from '@/components/Icon';

interface Props {
    searchParams: { edit?: string; }
    params: { businessId: string; }
}

export default async function BusinessAppointmentPage({ searchParams, params }: Props) {
    if (!isObjectIdOrHexString(params.businessId)) redirect('../');

    const query = searchParams.edit ? `?edit=${searchParams.edit}` : '';

    const business = await Business
        .findById(params.businessId)
        .select('name')
        .lean() as Pick<BusinessObject, 'name' | '_id'> | null;
    if (!business) redirect('../');

    const employees = await Employee
        .find({ business: params.businessId })
        .select('name')
        .lean() as Pick<EmployeeObject, 'name' | '_id'>[];

    return (
        <section>
            <h1 className='text-center'>Who will be serving you?</h1>
            <ul className={styles.employeeList}>
                {employees.map(employee => 
                    <li key={employee._id.toString()}>
                        <Card href={`../employee/${employee._id}${query}`}>
                            <Icon name='account_circle' className={styles.employeeIcon} />
                            <p className='no-margin'>{employee.name}</p>
                        </Card>
                    </li>
                )}
            </ul>
        </section>
    )
}