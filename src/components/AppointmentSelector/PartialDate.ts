type Specificity = 'year' | 'month' | 'day' | 'hours' | 'minutes';

const specificities: Specificity[] = ['year', 'month', 'day', 'hours', 'minutes'];

export default class PartialDate {
    // Date components
    readonly year: number;
    readonly month?: number;
    readonly day?: number;
    readonly hours?: number;
    readonly minutes?: number;

    readonly weekday?: number;
    readonly specificity: Specificity;

    /** Creates a `PartialDate` equivalent to the given date (the current moment if none given) up to `specificity`. */
    constructor(specificity: Specificity, date?: Date)
    constructor(specificity: Specificity, dateString: string)
    constructor(specificity: Specificity, dateVal: number)
    constructor(specificity: Specificity, partialDate: PartialDate)
    constructor(year: number, month?: number, day?: number, hours?: number, minutes?: number)
    constructor(
        arg1: Specificity | number,
        arg2?: Date | PartialDate | string | number,
        day?: number,
        hours?: number,
        minutes?: number
    ) {
        let specificity: Specificity;
        let date: Date;

        // Differentiate between different "overloads" and determine a specificity + date.
        if (typeof arg1 === 'string') {
            specificity = arg1;
            const dateArg = arg2;
            if (dateArg === undefined) {
                date = new Date();
            } else if (dateArg instanceof Date) {
                date = dateArg;
            } else if (dateArg instanceof PartialDate) {
                date = dateArg.asDate();
            } else {
                date = new Date(dateArg);
            }
        } else {
            arg2 = arg2 as number | undefined;

            // Use the last defined component to infer the specificity.
            let i = [arg1, arg2, day, hours, minutes].indexOf(undefined) - 1;
            specificity = i > 0 ? specificities[i] : 'minutes';

            date = new Date(arg1, arg2 ?? 0, day ?? 1, hours ?? 0, minutes ?? 0);
        }

        // Assign components to the date up to the given specificity.
        switch (specificity) {
            case 'minutes':
                this.minutes = date.getMinutes();
            case 'hours':
                this.hours = date.getHours();
            case 'day':
                this.day = date.getDate();
                this.weekday = date.getDay();
            case 'month':
                this.month = date.getMonth();
            case 'year':
                this.year = date.getFullYear();
                break;
        }

        this.specificity = specificity;
    }

    /** Compares two `PartialDate`s using the least of their specificities and `specificity` (if given). */
    static compare(a: PartialDate, b: PartialDate, specificity?: Specificity) {

        // Condense the parts of each date into arrays.
        const partsA = partsToArray(a);
        const partsB = partsToArray(b);
        const end = specificity ? specificities.indexOf(specificity) : 4;

        // Check each part of both dates, from least specific to most specific.
        for (let i = 0; i <= end; i++) {
            // Stop upon reaching the end of the most specific date.
            if (partsA[i] === undefined || partsB[i] === undefined) break;
            else if (partsA[i]! > partsB[i]!) return 1; // a > b
            else if (partsA[i]! < partsB[i]!) return -1; // a < b
        }
        
        // No difference was found (a = b).
        return 0;
    }

    /** Checks two `PartialDates` for equality. 
     * 
     * If `specificity` is greater than either date's specificity, this returns `false`.
     * 
     * Otherwise, checks for equality using the least of both date's specificities and `specificity`.
    */
    static areEqual(a: PartialDate, b: PartialDate, specificity?: Specificity) {
        if (specificity) {
            const precisionA = specificities.indexOf(a.specificity);
            const precisionB = specificities.indexOf(b.specificity);
            const givenPrecision = specificities.indexOf(specificity);

            if (givenPrecision > precisionA || givenPrecision > precisionB) return false;
        }

        return PartialDate.compare(a, b, specificity) === 0;
    }

    /**
     * Converts this `PartialDate` to a native `Date` object.
     *  
     * Any undefined date components are set to 0.
    */
    asDate() {
        return new Date(
            this.year,
            this.month ?? 0,
            this.day ?? 1,
            this.hours ?? 0,
            this.minutes ?? 0
        )
    }

    /**
     * Returns a new `PartialDate` object adjusted by the specified amounts.
     * 
     * Any changes that are more specific than this `PartialDate` are silently dropped.
     */
    adjust(yearChange = 0, monthChange = 0, dayChange = 0, hoursChange = 0, minutesChange = 0) {
        let newYear = this.year + yearChange;
        let newMonth = coalescingAdd(this.month, monthChange);
        let newDay = coalescingAdd(this.day, dayChange);
        let newHours = coalescingAdd(this.hours, hoursChange);
        let newMinutes = coalescingAdd(this.minutes, minutesChange);
        
        return new PartialDate(newYear, newMonth, newDay, newHours, newMinutes);
    }

    /**
     * Returns this `PartialDate` as an ISO string. Undefined parts are set to 0.
     * 
     * Equivalent to `PartialDate.asDate().toISOString()`.
     * */
    toISOString() { return this.asDate().toISOString(); }

    /**
     * Converts this `PartialDate` as a string by connecting defined parts with a hyphen (-).
     *  
     * Undefined parts are excluded from the string.
     */
    toString() {
        return partsToArray(this)
            .filter(x => x !== undefined)
            .join('-');
    }
}

// Helper functions

// Converts a PartialDate's components to an array.
function partsToArray(date: PartialDate) {
    return [ date.year, date.month, date.day, date.hours, date.minutes ];
}

// Returns x + y if x is defined, or undefined otherwise. 
function coalescingAdd(x: number | undefined, y: number) {
    return x !== undefined ? x + y : undefined;
}