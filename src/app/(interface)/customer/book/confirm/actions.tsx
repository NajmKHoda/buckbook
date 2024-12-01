'use server';

import { isObjectIdOrHexString } from "mongoose";
import { getAccount } from "@/lib/session";
import { Appointment } from "@/lib/database/models/appointment";
import { Employee } from "@/lib/database/models/employee";
import { AccountType } from "@/lib/database/models/user";
import { redirect } from "next/navigation";

export async function handleSubmit(employeeId: string, datetime: string) {
    if (!isObjectIdOrHexString(employeeId) || isNaN(Date.parse(datetime))) return;

    const date = new Date(datetime);
    const [customer, employeeExists, appointmentExists] = await Promise.all([
        getAccount(AccountType.Customer),
        Employee.exists({ _id: employeeId }),
        Appointment.exists({ employee: employeeId, date })
    ]);

    if (!employeeExists || appointmentExists) return;
    
    await Appointment.create({
        employee: employeeId,
        customer: customer._id,
        date
    });

    redirect('/customer/dashboard');
}

export async function handleEdit(appointmentId: string, employeeId: string, datetime: string){
    if (!isObjectIdOrHexString(appointmentId) ||
        !isObjectIdOrHexString(employeeId) ||
        isNaN(Date.parse(datetime))) return;

    const [_, employeeExists] = await Promise.all([
        getAccount(AccountType.Customer),
        Employee.exists({ _id: employeeId })
    ]);

    if (!employeeExists) return;
    
    const date = new Date(datetime);
    await Appointment.findByIdAndUpdate(appointmentId, {
        employee: employeeId,
        date
    });

    redirect('/customer/dashboard');
}