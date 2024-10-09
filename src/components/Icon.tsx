interface Props {
    className?: string;
    name: string;
}

export default function Icon({ className = '', name }: Props) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}