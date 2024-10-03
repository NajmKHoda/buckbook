import { Business, BusinessObject } from "@/lib/database/models/business";
import { Employee, EmployeeObject } from "@/lib/database/models/employee";
import { isObjectIdOrHexString } from "mongoose"
import Image from "next/image";
import { redirect } from "next/navigation"
import accountIcon from '@/../public/account_pfp.png'
import styles from './page.module.css';
import Link from "next/link";

interface Props {
    params: { businessId: string }
}

export default async function BusinessAppointmentPage({ params }: Props) {
    if (!isObjectIdOrHexString(params.businessId)) redirect('/customer/newappointment');

    const business = await Business
        .findById(params.businessId)
        .select('name')
        .lean() as Pick<BusinessObject, 'name' | '_id'> | null;
    if (!business) redirect('/customer/newappointment');

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
                        <Link className={styles.employeeEntry} href={`../employee/${employee._id}`}>
                            <Image
                                src={accountIcon}
                                width={80}
                                height={80}
                                alt={`Picture of ${employee.name}`} />
                            <p className='no-margin'>{employee.name}</p>
                        </Link>
                    </li>
                )}
            </ul>
        </section>
    )
}