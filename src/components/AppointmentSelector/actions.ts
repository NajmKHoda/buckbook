'use server';

import { Appointment } from "@/lib/database/models/appointment";
import { Employee } from "@/lib/database/models/employee";
import { AccountType } from "@/lib/database/models/user";
import { getSession } from "@/lib/session";
import { isObjectIdOrHexString, Types } from "mongoose";
import { redirect } from "next/navigation";

export async function handleAppointmentBooking(dateString: string, employeeId: string) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return;
    if (!isObjectIdOrHexString(employeeId)) return;

    const [customer, employeeExists, appointmentExists] = await Promise.all([
        getSession(), 
        Employee.exists({ _id: employeeId }),
        Appointment.exists({ employee: new Types.ObjectId(employeeId), date: date })
    ]);
    if (!customer || 
        customer.accountType != AccountType.Customer ||
        !employeeExists || 
        appointmentExists) return;

    await Appointment.create({
        employee: employeeId,
        customer: customer.accountId,
        date
    });

    redirect('/customer/dashboard');
}