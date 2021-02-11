import { FormGroup } from '@angular/forms';
import { UtilitiesService } from '../services/utilities.service';

export class PersonadisponibilidadValidator {

    static datosNecesarios(grupo: FormGroup) {
        if (grupo.controls.hasOwnProperty('persona')) {
            let persona = grupo.get('persona').value;
            if(persona){
            //if(persona != null && typeof persona.id !== 'undefined'){
                if(!persona.horaInicioProgramacion || !persona.horaFinProgramacion){
                    grupo.get('persona').setErrors({ errorDatosNecesariosPersona: true });
                    return null;
                }else{
                    grupo.get('persona').setErrors(null);
                    return null;
                }
            }
        }
    }

    static intervaloMax(grupo: FormGroup) {
        let utilitiesService = new UtilitiesService();
        if(grupo.controls.hasOwnProperty('fechaHasta') && grupo.controls.hasOwnProperty('fechaDesde') && grupo.controls.hasOwnProperty('intervalo')){
            let intervalo = grupo.get('intervalo').value;
            if(intervalo && typeof intervalo == 'string'){
                intervalo = intervalo.replace('2019-01-01 ', '');
                let fechaDesde = grupo.get('fechaDesde').value;
                let fechaHasta = grupo.get('fechaHasta').value;
                if(fechaDesde && fechaHasta){
                    let horaInicio = new Date(utilitiesService.clearHora(utilitiesService.convertDateToString(fechaDesde, 'HH:mm:ss')));
                    let horaFin = new Date(utilitiesService.clearHora(utilitiesService.convertDateToString(fechaHasta, 'HH:mm:ss')));
                    let diff = horaFin.getTime() - horaInicio.getTime();
                    let minutes = Math.round((diff) / 60000);

                    let today = new Date(utilitiesService.clearHora(utilitiesService.convertDateToString(utilitiesService.clearHora("00:00:00"), 'HH:mm:ss')));
                    intervalo = new Date(utilitiesService.clearHora(utilitiesService.convertDateToString(utilitiesService.clearHora(intervalo), 'HH:mm:ss')));
                    let diff2 = intervalo.getTime() - today.getTime();
                    let minutesIntervalo = Math.round((diff2) / 60000);
                    if(minutesIntervalo > minutes){
                        grupo.get('intervalo').setErrors({ intervaloNoPermitido: true });
                        return null;
                    }
                    grupo.get('intervalo').setErrors(null);
                    return null;
                }
            }
        }
    }

    static intervaloIgual(grupo: FormGroup) {
        let utilitiesService = new UtilitiesService();
        if(grupo.controls.hasOwnProperty('fechaHasta') && grupo.controls.hasOwnProperty('fechaDesde') && grupo.controls.hasOwnProperty('intervalo')){
                let fechaDesde = grupo.get('fechaDesde').value;
                let fechaHasta = grupo.get('fechaHasta').value;
                if(fechaDesde && fechaHasta){
                    
                    let horaInicio = new Date(utilitiesService.clearHora(utilitiesService.convertDateToString(fechaDesde, 'HH:mm:ss')));
                    let horaFin = new Date(utilitiesService.clearHora(utilitiesService.convertDateToString(fechaHasta, 'HH:mm:ss')));
                    let diff = horaFin.getTime() - horaInicio.getTime();

                    if( diff === 0 ){
                        grupo.get('fechaDesde').setErrors({ intervaloFechasNoPermitido: true });
                        return null;
                    }
                    grupo.get('fechaDesde').setErrors(null);
                    return null;
                    /*let minutes = Math.round((diff) / 60000);

                    let today = new Date(utilitiesService.clearHora(utilitiesService.convertDateToString(utilitiesService.clearHora("00:00:00"), 'HH:mm:ss')));
                    intervalo = new Date(utilitiesService.clearHora(utilitiesService.convertDateToString(utilitiesService.clearHora(intervalo), 'HH:mm:ss')));
                    let diff2 = intervalo.getTime() - today.getTime();
                    let minutesIntervalo = Math.round((diff2) / 60000);
                    if(minutesIntervalo > minutes){
                        grupo.get('intervalo').setErrors({ intervaloNoPermitido: true });
                        return null;
                    }
                    grupo.get('intervalo').setErrors(null);
                    return null;*/
                }
            }
        
        // grupo.get('intervalo').setErrors(null);
        // return null;
    }
}