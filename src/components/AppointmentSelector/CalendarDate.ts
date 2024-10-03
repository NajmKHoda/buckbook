export default class CalendarDate {
    readonly weekDay: number;
    readonly day: number;
    readonly month: number;
    readonly year: number;

    constructor(date: Date);
    constructor(value: number);
    constructor(dateString: string);
    constructor(dateValue: Date | number | string) {
        let date: Date;
        if (typeof dateValue === 'number') {
            date = new Date(dateValue);
        } else if (typeof dateValue === 'string') {
            const day = Number(dateValue.slice(0, 2));
            const month = Number(dateValue.slice(3, 5));
            const year = Number(dateValue.slice(6, 10));
            date = new Date(year, month, day);
        } else {
            date = dateValue;
        }

        this.weekDay = date.getDay();
        this.day = date.getDate();
        this.month = date.getMonth();
        this.year = date.getFullYear();
    }

    static now() {
        return new CalendarDate(new Date());
    }

    equals(date: CalendarDate | Date) {
        if (date instanceof CalendarDate) {
            return this.day === date.day &&
            this.month === date.month &&
            this.year === date.year;
        }
        
        return this.day === date.getDate() &&
        this.month === date.getMonth() &&
        this.year === date.getFullYear();
    }

    toString() {
        const dayString = this.day.toString().padStart(2, '0');
        const monthString = this.month.toString().padStart(2, '0');
        const yearString = this.year.toString().padStart(4, '0');

        // DD-MM-YYYY
        return `${dayString}-${monthString}-${yearString}`;
    }
}