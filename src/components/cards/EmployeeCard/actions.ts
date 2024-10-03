'use server';

import { Employee } from "@/lib/database/models/employee";
import { User } from "@/lib/database/models/user";
import { ObjectIdType } from "@/lib/database/types";

export async function handleEmployeeDeletion(employeeId: ObjectIdType) {
    await Promise.all([
        Employee.findByIdAndDelete(employeeId),
        User.findOneAndDelete({ accountId: employeeId })
    ]);
}