type FormatValue = string | Format | FormatValue[];
interface Format {
    [property: string]: FormatValue
};

type ResultValue<T extends FormatValue> = 
    T extends Format ? ResultObject<T> :
    T extends Array<infer T2 extends FormatValue> ? ResultValue<T2>[] :
    (FormDataEntryValue | undefined)
type ResultObject<T extends Format> = {
    [property in keyof T]: ResultValue<T[property]>
}

function valueFromFormData<T extends FormatValue>(formData: FormData, formatValue: T): ResultValue<T> {
    if (typeof formatValue === 'string') {
        return (formData.get(formatValue) || undefined) as ResultValue<T>;
    } else if (Array.isArray(formatValue)) {
        return arrayFromFormData(formData, formatValue) as ResultValue<T>;
    } else {
        return objectFromFormData(formData, formatValue) as ResultValue<T>
    }
}

function arrayFromFormData<T extends FormatValue>(formData: FormData, formatArr: T[]) {
    const resultArr: ResultValue<T>[] = [];
    for (const formatValue of formatArr) {
        const result = valueFromFormData(formData, formatValue)
        resultArr.push(result);
    }
    return resultArr;
}

export function objectFromFormData<T extends Format>(formData: FormData, format: T) {
    const result: ResultObject<T> = {} as ResultObject<T>;

    for (const property in format) {
        const formatValue = format[property];
        result[property] = valueFromFormData(formData, formatValue);
    }

    return result;
}

type Generator<T extends FormatValue> = (index: number) => T
export function arrayFromGenerator<T extends FormatValue>(length: number, generator: Generator<T>) {
    const arr: T[] = [];
    for (let i = 0; i < length; i++) {
        arr.push(generator(i));
    }
    return arr;
}