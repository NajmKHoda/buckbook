import { PropsWithChildren } from "react"
import LinkButton from "@/components/input/LinkButton/LinkButton"
import styles from './card.module.css';

interface Props extends PropsWithChildren {
    className?: string,
    addStyle?: boolean,
    href?: string,
    onClick?: () => void,
}

export default function Card({ className='', addStyle=false, href, onClick, children }: Props) {
    let cardStyle = addStyle ? styles.addCard : styles.card;
    return href ? (
        <LinkButton className={`${className} ${cardStyle}`} href={href}>
            {children}
        </LinkButton>
    ) : (
        <button type='button' onClick={onClick} className={`${className} ${cardStyle}`}>
            {children}
        </button>
    )
}