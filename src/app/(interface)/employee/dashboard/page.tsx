import AppointmentCalendar from "@/components/AppointmentCalendar/AppointmentCalendar";
import { Appointment } from "@/lib/database/models/appointment";
import { Business } from "@/lib/database/models/business";
import { AccountType } from "@/lib/database/models/user";
import { getAccount } from "@/lib/session";

export default async function EmployeeDashboard() {
    const account = await getAccount(AccountType.Employee);

    const [appointments, business] = await Promise.all([
        Appointment
            .find({ employee: account._id })
            .populate({
                path: 'customer',
                select: 'name'
            })
            .lean() as Promise<any[]>,

        Business
            .findById(account.business)
            .select('appointmentDuration')
            .lean() as Promise<any>
    ])

    const details = appointments.map(appt => ({
        customerName: appt.customer.name,
        date: appt.date
    }));

    return (
        <>
            <h2 className='text-center'>View upcoming appointments below.</h2>
            <AppointmentCalendar
                appointments={ details }
                duration={ business.appointmentDuration }/>
        </>
    )
}