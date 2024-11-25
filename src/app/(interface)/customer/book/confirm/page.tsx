import { Employee } from "@/lib/database/models/employee";
import { isObjectIdOrHexString } from "mongoose";
import { notFound, redirect } from "next/navigation";
import AppointmentConfirmButton from "./AppointmentConfirmButton";
import Icon from "@/components/Icon";
import styles from './page.module.css';
import Link from 'next/link';
import { Appointment } from "@/lib/database/models/appointment";

interface Props {
    searchParams: {
        employeeId?: string;
        datetime?: string;
        edit?: string
    }
}

export default async function ConfirmAppointmentPage({ searchParams }: Props) {
    let { employeeId, datetime } = searchParams;
    const editAppointmentId = searchParams.edit;
    const query = editAppointmentId ? `?edit=${editAppointmentId}` : '';

    // Fetch the information of the appointment we want to edit.
    if (editAppointmentId) {
        if (!isObjectIdOrHexString(editAppointmentId)) notFound();
        
        const appointment = await Appointment
            .findById(editAppointmentId)
            .select('employee date');
        
        // Place non-edited information
        if (!employeeId) employeeId = appointment.employee.toString();
        if (!datetime) datetime = appointment.date.toISOString();
    }

    if (!isObjectIdOrHexString(employeeId)) notFound();
    
    if (!datetime || isNaN(Date.parse(datetime))) redirect(`employee/${employeeId}`);

    const date = new Date(datetime);
    const employee: any = await Employee
        .findById(employeeId)
        .select('name business')
        .populate('business', 'name')
        .lean();

    const instruction = searchParams.edit ? 'Confirm your changes.' : 'Confirm your appointment details.'
    
    return (
        <section>
            <h2 className='text-center'>{instruction}</h2>
            <div className={styles.container}>
                <table>
                    <tbody>
                        <tr>
                            <th className={styles.infoHeader}><Icon name='apartment' /> <span className={styles.infoLabel}>Business</span></th>
                            <td>
                                <>{employee.business.name} </>
                                <Link href={`./${query}`}>(Change)</Link>
                            </td>
                        </tr>
                        <tr>
                            <th className={styles.infoHeader}><Icon name='person' /> <span className={styles.infoLabel}>Employee</span></th>
                            <td>
                                <>{employee.name} </>
                                <Link href={`business/${employee.business._id}${query}`}>(Change)</Link>
                            </td>
                        </tr>
                        <tr>
                            <th className={styles.infoHeader}><Icon name='calendar_month' /> <span className={styles.infoLabel}>Date</span></th>
                            <td>
                                <>{date.toLocaleDateString('en-US', { dateStyle: 'full' })} </>
                                <Link href={`employee/${employee._id}${query}`}>(Change)</Link>
                            </td>
                        </tr>
                        <tr>
                            <th className={styles.infoHeader}><Icon name='schedule' /> <span className={styles.infoLabel}>Time</span></th>
                            <td>
                                <>{date.toLocaleTimeString('en-US', { timeStyle: 'short' })} </>
                                <Link href={`employee/${employee._id}${query}`}>(Change)</Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <AppointmentConfirmButton
                    employeeId={employeeId!}
                    datetime={datetime}
                    editAppointmentId={editAppointmentId} />
            </div>
        </section>
    )
}