import { Employee } from "@/lib/database/models/employee";
import { isObjectIdOrHexString } from "mongoose";
import { notFound, redirect } from "next/navigation";
import AppointmentConfirmButton from "./AppointmentConfirmButton";
import Icon from "@/components/Icon";
import styles from './page.module.css';
import Link from 'next/link';

interface Props {
    searchParams: {
        employeeId: string;
        datetime: string;
    }
}

export default async function ConfirmAppointmentPage({ searchParams }: Props) {
    const { employeeId, datetime } = searchParams;

    if (!isObjectIdOrHexString(employeeId)) notFound();

    const date = new Date(datetime);
    if (isNaN(date.valueOf())) redirect(`../employee/${employeeId}`);

    const employee: any = await Employee
        .findById(employeeId)
        .select('name business')
        .populate('business', 'name')
        .lean();

    
    return (
        <section>
            <h2 className='text-center'>Confirm your appointment details.</h2>
            <div className={styles.container}>
                <table>
                    <tbody>
                        <tr>
                            <th><Icon name='apartment' /> <span className={styles.infoLabel}>Business</span></th>
                            <td>
                                <>{employee.business.name} </>
                                <Link href='./'>(Change)</Link>
                            </td>
                        </tr>
                        <tr>
                            <th><Icon name='person' /> <span className={styles.infoLabel}>Employee</span></th>
                            <td>
                                <>{employee.name} </>
                                <Link href={`business/${employee.business._id}`}>(Change)</Link>
                            </td>
                        </tr>
                        <tr>
                            <th><Icon name='calendar_month' /> <span className={styles.infoLabel}>Date</span></th>
                            <td>
                                <>{date.toLocaleDateString('en-US', { dateStyle: 'full' })} </>
                                <Link href={`employee/${employee._id}`}>(Change)</Link>
                            </td>
                        </tr>
                        <tr>
                            <th><Icon name='schedule' /> <span className={styles.infoLabel}>Time</span></th>
                            <td>
                                <>{date.toLocaleTimeString('en-US', { timeStyle: 'short' })} </>
                                <Link href={`employee/${employee._id}`}>(Change)</Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <AppointmentConfirmButton employeeId={employeeId} datetime={datetime} />
            </div>
        </section>
    )
}