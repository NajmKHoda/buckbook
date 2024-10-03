'use server';

import { Employee } from "@/lib/database/models/employee";
import { User } from "@/lib/database/models/user";
import { ObjectId } from "mongoose";

export async function handleEmployeeDeletion(employeeId: ObjectId) {
    await Promise.all([
        Employee.findByIdAndDelete(employeeId),
        User.findOneAndDelete({ accountId: employeeId })
    ]);
}