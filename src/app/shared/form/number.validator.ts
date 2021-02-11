import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { AbstractControl } from '@angular/forms';

export function MaxValue(max = 0) {
    return (control: AbstractControl): { [key: string]: object } | null => {
        if (max <= 0) {
            return null;
        }

        if (control.value) {
            let valor = control.value;
            if (valor > max) {
                return { 'maxValue': { max: max, actual: valor } };
            }
        }

        return null;
    };
}

export function MaxDecimalValue(enteros = 18, decimales = 2) {
    return (control: AbstractControl): { [key: string]: object } | null => {
        if (enteros <= 0 || decimales <= 0) {
            return null;
        }

        if (control.value) {
            const valor: string[] = (control.value + '').split('.');
            const enterosValores = valor[0].length;
            const decimalesValores = valor.length > 1 ? valor[1].length : 0;
            if (enterosValores > enteros || decimalesValores > decimales) {
                return {
                    'maxDecimalValue':
                        { max: '{' + enteros + ',' + decimales + '}', actual: '{' + enterosValores + ',' + decimalesValores + '}' }
                };
            }
        }

        return null;
    };
}


export class NumberValidator {

    static numberMax(grupo: FormGroup) {
        if (grupo.controls.hasOwnProperty('numeroMinimo') && grupo.controls.hasOwnProperty('numeroMaximo')) {
            let numeroMinimo = grupo.get('numeroMinimo').value;
            let numeroMaximo = grupo.get('numeroMaximo').value;

            if (numeroMinimo && numeroMaximo) {
                if (numeroMinimo > numeroMaximo) {
                    grupo.get('numeroMinimo').setErrors({ errorNumberMinMayor: true });
                    return null;
                }
            }

            grupo.get('numeroMinimo').setErrors(null);
            return null;
        }
    }

    static abscisaMaxima(grupo: FormGroup) {
        if (grupo.controls.hasOwnProperty('abscisaInicial') && grupo.controls.hasOwnProperty('abscisaFinal')) {

            let abscisaInicial: any = null;
            let abscisaFinal: any = null;

            if (grupo.get('abscisaInicial')) {
                abscisaInicial = grupo.get('abscisaInicial').value;
            }

            if (grupo.get('abscisaFinal')) {
                abscisaFinal = grupo.get('abscisaFinal').value;
            }

            if (abscisaInicial != null && abscisaFinal != null &&
                typeof abscisaInicial !== undefined && typeof abscisaFinal !== undefined) {
                if (parseFloat(abscisaFinal) - parseFloat(abscisaInicial) <= 0) {
                    grupo.get('abscisaFinal').setErrors({ errorNumberMinMayor: true });
                }
            } else {
                if (typeof abscisaInicial === undefined || abscisaInicial == null) {
                    grupo.get('abscisaInicial').setErrors({ required: true });
                }
                if (typeof abscisaFinal === undefined || abscisaFinal == null) {
                    grupo.get('abscisaFinal').setErrors({ required: true });
                }
            }

            return null;
        }
    }
}