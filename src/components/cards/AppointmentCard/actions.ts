'use server';

import { Appointment, AppointmentObject } from "@/lib/database/models/appointment";
import { AccountType } from "@/lib/database/models/user";
import { getAccount } from "@/lib/session";
import { isObjectIdOrHexString } from "mongoose";

export async function handleAppointmentDeletion(appointmentId: string) {
    if (!isObjectIdOrHexString(appointmentId)) return;

    const [appointment, account] = await Promise.all([
        Appointment
            .findById(appointmentId)
            .select('customer employee')
            .lean() as unknown as Promise<Pick<AppointmentObject, 'customer' | 'employee' | '_id'>>,
        
        getAccount(AccountType.Customer)
    ]);
    
    if (!account._id.equals(appointment.customer)) return;

    await Appointment.findByIdAndDelete(appointmentId);
}