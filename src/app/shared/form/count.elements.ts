import { AbstractControl } from '@angular/forms';

export function CountMaxElementsValidator(max = 0) {
    
    return (control: AbstractControl): { [key: string]: object } | null => {
        if (max <= 0) {
            return null;
        }

        if (control.value) {
            let total = control.value.length;
            if (total > max) {
                return { 'maxElements': { max: max, actual: total } };
            }
        }

        return null;
    };
}

export function CountMinElementsValidator(min = 0) {

    return (control: AbstractControl): { [key: string]: object } | null => {
        if (min <= 0) {
            return null;
        }
        
        if (control.value) {
            let total = control.value.length;
            if (total < min) {
                return { 'minElements': {min: min, actual: total } };
            }
        }

        return null;
    };
}