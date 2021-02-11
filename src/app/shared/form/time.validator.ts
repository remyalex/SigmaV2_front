import { FormGroup, AbstractControl } from '@angular/forms';
import { UtilitiesService } from '../services/utilities.service';

export class TimeValidator {

    static timeMin(grupo: FormGroup) {
        let utilitiesService = new UtilitiesService();
        let formato = 'YYYY-MM-DD HH:mm';
        if (grupo.controls.hasOwnProperty('horaInicio') && grupo.controls.hasOwnProperty('horaFin')) {
            let horaInicio = utilitiesService.convertStringToDate(
                utilitiesService.clearHora(grupo.get('horaInicio').value), formato
            );
            let horaFin = utilitiesService.convertStringToDate(
                utilitiesService.clearHora(grupo.get('horaFin').value), formato
            );

            if (horaInicio && horaFin) {
                if (horaInicio > horaFin) {
                    grupo.get('horaInicio').setErrors({ errorHoraMinMayor: true });
                    return null;
                }
            }

            grupo.get('horaInicio').setErrors(null);
            return null;
        }
    }
}

export function rangoRegistroHorasValidator(horaMinima = "08:00", horaMaxima = "16:00") {

    return (control: AbstractControl): { [key: string]: object } | null => {
        let utilitiesService = new UtilitiesService();
        let formato = 'HH:mm';
        let horaInicio = utilitiesService.convertStringToDate(
            utilitiesService.clearHora(horaMinima), formato
        );
        let horaFin = utilitiesService.convertStringToDate(
            utilitiesService.clearHora(horaMaxima), formato
        );

        if (control.value) {
            let hora = utilitiesService.convertStringToDate(
                utilitiesService.clearHora(control.value), formato
            );

            if(hora >= horaInicio && hora <= horaFin){
                return { 'rangoHoraNotValid':  {horaActual: hora, horaMinima: horaMinima, horaMaxima: horaMaxima} };
            }
        }

        return null;
    };
}