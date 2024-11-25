import AppointmentSelector from "@/components/AppointmentSelector/AppointmentSelector";
import { Appointment, AppointmentObject } from "@/lib/database/models/appointment";
import { BusinessObject } from "@/lib/database/models/business";
import { Employee, EmployeeObject } from "@/lib/database/models/employee";
import { Populated } from "@/lib/database/types";
import { isObjectIdOrHexString } from "mongoose"
import { redirect } from "next/navigation"

interface Props {
    searchParams: { edit?: string }
    params: { employeeId: string }
}

export default async function AppointmentEmployeePage({ searchParams, params }: Props) {
    if (!isObjectIdOrHexString(params.employeeId)) redirect('../');

    const employee = await Employee
        .findById(params.employeeId)
        .select('business')
        .populate('business', 'hours appointmentDuration')
        .lean() as Populated<
            Pick<EmployeeObject, 'business'>,
            'business',
            Pick<BusinessObject, 'hours' | 'appointmentDuration'>> | null;
    if (!employee || !employee.business) redirect('../');
    const { hours, appointmentDuration } = employee.business;

    const times = (await Appointment
        .find({ employee: params.employeeId })
        .select('date')
        .lean() as Pick<AppointmentObject, 'date' | '_id'>[])
        .map(appointment => appointment.date.toISOString());

    return (
        <>
            <h2 className='text-center'>Select an appointment date and time.</h2>
            <AppointmentSelector
                hours={hours}
                appointmentDuration={appointmentDuration}
                bookedTimes={times}
                appointmentEditId={searchParams.edit} />
        </>
    )
}