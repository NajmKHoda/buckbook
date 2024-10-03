'use client';

import { PropsWithChildren } from "react";
import { useFormStatus } from "react-dom";

export default function SubmitButton({ children }: PropsWithChildren) {
    const { pending } = useFormStatus();
    return <button disabled={pending}>{children}</button>;
}