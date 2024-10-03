import Header from '@/components/Header/Header';
import './global.css';

import { Metadata } from "next/types"
import { PropsWithChildren } from 'react';

export const metadata: Metadata = {
    title: 'Barber Appointments'
}

export default async function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang='en'>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='anonymous' />
                <link href="https://fonts.googleapis.com/css2?family=Wix+Madefor+Display&display=swap" rel="stylesheet" />
            </head>
            <body>
                {children}
            </body>
        </html>
    )
}