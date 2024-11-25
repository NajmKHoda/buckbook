'use client';

import { handleSubmit, handleEdit } from "./actions";

interface Props {
    employeeId: string,
    datetime: string,
    editAppointmentId?: string
}

export default function AppointmentConfirmButton({ employeeId, datetime, editAppointmentId }: Props) {
    const action = editAppointmentId ?
        () => handleEdit(editAppointmentId, employeeId, datetime) :
        () => handleSubmit(employeeId, datetime);

    const text = editAppointmentId ? 'Change Appointment' : 'Book Appointment'

    return <button type='button' onClick={action}>{text}</button>
}