import Link from 'next/link'
import Image from 'next/image'
import addIcon from '@/../public/add_icon.png'
import styles from '../card.module.css'

export default function AddAppointmentCard() {
    return (
        <Link className='no-underline' href='/customer/newappointment'>
            <div className={styles.addCard}>
                <Image src={addIcon} alt='Add icon' width={80} height={80} />
                <h3 className='no-margin text-center'>New Appointment</h3>
            </div>
        </Link>
    )
}