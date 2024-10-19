'use server';

import { isObjectIdOrHexString } from "mongoose";
import { getSession } from "@/lib/session";
import { Appointment } from "@/lib/database/models/appointment";
import { Employee } from "@/lib/database/models/employee";
import { AccountType } from "@/lib/database/models/user";
import { redirect } from "next/navigation";

export async function handleSubmit(employeeId: string, datetime: string) {
    if (!isObjectIdOrHexString(employeeId)) return;

    const date = new Date(datetime);
    const [session, employeeExists, appointmentExists] = await Promise.all([
        getSession(),
        Employee.exists({ _id: employeeId }),
        Appointment.exists({ employee: employeeId, date })
    ]);

    if (!session ||
        session.accountType != AccountType.Customer ||
        !employeeExists ||
        appointmentExists) return;
    
    await Appointment.create({
        employee: employeeId,
        customer: session.accountId,
        date
    });

    redirect('/customer/dashboard');
}