import Header from "@/components/Header/Header";
import { PropsWithChildren } from "react";

export default function RootTemplate({ children }: PropsWithChildren) {
    return (
        <>
            <Header />
            <main>
                {children}
            </main>
        </>
    )
}