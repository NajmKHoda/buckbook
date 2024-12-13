import styles from './CalendarDay.module.css';

interface Props {
    day: number,
    numAppointments: number,
    type: 'out' | 'in' | 'current',
    onClick: () => unknown;
}

export function CalendarDay({ day, numAppointments, onClick, type }: Props) {
    return type === 'out' ? (
        <div className={ styles.outDay }>
            <p className={ styles.outText }>{ day }</p>
        </div> 
    ) : (
        <button type='button' onClick={ onClick } className={ type === 'in' ? styles.inDay : styles.currentDay }>
            <span className={ styles.inText }>{ day }</span>
            <span className={`no-margin text-center`}>{ numAppointments || '-' }</span>
        </button>
    );
}