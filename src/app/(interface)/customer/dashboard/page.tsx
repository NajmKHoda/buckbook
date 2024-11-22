import styles from './page.module.css'
import { Appointment } from '@/lib/database/models/appointment';
import AppointmentCard from '@/components/cards/AppointmentCard/AppointmentCard'
import { getAccount } from '@/lib/session';
import { redirect } from 'next/navigation';
import { AccountType } from '@/lib/database/models/user';
import Card from "@/components/cards/Card";
import Icon from "@/components/Icon";

export default async function CustomerDashboard() {
    const customer = await getAccount(AccountType.Customer);
    if (!customer) redirect('/login');

    const appointments: any = await Appointment
        .find({ customer: customer._id })
        .select('date employee')
        .populate({
            path: 'employee',
            select: 'name business',
            populate: { path: 'business', select: 'name' }
        })
        .lean()

    return (
        <section>
            <h2>Your Appointments</h2>
            <div className={styles.appointmentsContainer}>
                {appointments.map((appointment: any) =>
                    <AppointmentCard 
                        key={appointment._id.toString()}
                        dateString={appointment.date.toISOString()}
                        businessName={appointment.employee.business.name}
                        employeeName={appointment.employee.name}
                        appointmentId={appointment._id.toString()}/>
                )}
                <Card addStyle href='book'>
                    <Icon name='add' className={styles.addIcon} />
                    <h3 className='no-margin text-center'>New Appointment</h3>
                </Card>
            </div>
        </section>
    )
}