import './global.css';
import 'material-symbols/outlined.css';
import { Metadata } from "next/types"
import { PropsWithChildren } from 'react';
import { Wix_Madefor_Display } from 'next/font/google'

export const metadata: Metadata = {
    title: 'Barber Appointments'
}

const wixMadeforDisplay = Wix_Madefor_Display({
    subsets: ['latin'],
    display: 'swap',
    variable: '--wix-madefor-display'
});

export default async function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang='en' className={wixMadeforDisplay.variable}>
            <body>
                {children}
            </body>
        </html>
    )
}