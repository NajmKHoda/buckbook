import Link from "next/link"
import { PropsWithChildren } from "react"

interface Props extends PropsWithChildren {
    className?: string,
    href: string
}

export default function LinkButton({ className, href, children }: Props) {
    return <Link href={href} className={`button ${className}`}>{children}</Link>
}