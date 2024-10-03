'use server';

import { Appointment, AppointmentObject } from "@/lib/database/models/appointment";
import { getSession } from "@/lib/session";
import { isObjectIdOrHexString } from "mongoose";

export async function handleAppointmentDeletion(appointmentId: string) {
    if (!isObjectIdOrHexString(appointmentId)) return;

    const [appointment, session] = await Promise.all([
        Appointment
            .findById(appointmentId)
            .select('customer employee')
            .lean() as unknown as Promise<Pick<AppointmentObject, 'customer' | 'employee' | '_id'>>,
        
        getSession()
    ]);
    
    if (!session) return;
    if (!session.accountId.equals(appointment.customer) && !session.accountId.equals(appointment.customer)) return;

    await Appointment.findByIdAndDelete(appointmentId);
}