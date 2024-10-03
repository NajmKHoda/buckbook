import { NextResponse } from "next/server";

interface Statuses {
    [code: number]: string;
}

const statuses: Statuses = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found'
}

export function status(statusCode: number) {
    const statusMessage = statuses[statusCode] || '';

    return new NextResponse(null, {
        status: statusCode,
        statusText: statusMessage
    });
}