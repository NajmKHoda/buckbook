import { PropsWithChildren } from 'react';
import styles from "./BookingProgressCue.module.css";
import Icon from '@/components/Icon';

interface Props extends PropsWithChildren {
    state: 'incomplete' | 'current' | 'finished';
    description: string;
}

export default function BookingStepCue({ state, description }: Props) {
    let iconClass: string;
    let captionClass: string;
    let iconName: string;
    switch (state) {
        case 'incomplete':
            iconClass = styles.incompleteStepIcon;
            captionClass = styles.incompleteStepCaption;
            iconName = 'circle';
            break;
        case 'current':
            iconClass = styles.currentStepIcon;
            captionClass = styles.currentStepCaption;
            iconName = 'radio_button_checked';
            break;
        case 'finished':
            iconClass = styles.completeStepIcon;
            captionClass = styles.completeStepCaption;
            iconName = 'check_circle';
    }

    return (
        <div className={styles.stepContainer}>
            <Icon className={iconClass} name={iconName} />
            <p className={`no-margin ${captionClass}`}>{description}</p>
        </div>
    )
}