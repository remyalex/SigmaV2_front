import { Modelcalendario } from './../models/modelcalendario.model';
import { Injectable } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import * as _moment from 'moment';
import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** Variable encargada de gestionar la propiedad momento de una hora  */
const moment = (_moment as any).default ? (_moment as any).default : _moment;
/** Constante con posibles valores de formatos de fecha/hora aceptados por el componente */
export const MY_CUSTOM_FORMATS = {
  parseInput: 'DD-MM-YYYY',
  parseInputHours: '+00 HH:mm:ss',
  fullPickerInput: 'DD-MM-YYYY HH:mm',
  datePickerInput: 'DD-MM-YYYY',
  timePickerInput: 'HH:mm',
  formatoInput: 'YYYY/MM/DD HH:mm'
};
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  green: {
    primary: '#0f9112',
    secondary: '#065307'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({
  providedIn: 'root'
})
export class CalendariosUtilitiesService {
 /** Constantes a usar en el componente */
  constants = CONST_SHARED;
  // private utilitiesService: UtilitiesService;
   constructor() {}
  obtenerEventosDeCalendario( calendarios: any): any[] {
    let events = [];
    calendarios.forEach((itemCalendario: Modelcalendario) => {
      const fechaInicio = itemCalendario.inicio.split(' ');
      const horaInicio = fechaInicio[1].split(':');
      const fechaFin = itemCalendario.fin.split(' ');
      const horaFin = fechaFin[1].split(':');
      let hora = (horaInicio + ' - ' + horaFin);
      hora = hora.replace(',', ':');
      hora = hora.replace(',', ':');
      let labelDisponible = ''; let labelTipoAsignacion = '';
      if (itemCalendario.disponible) {
        labelDisponible = '&nbsp <b>Disponible:</b> SÍ.';
        labelTipoAsignacion = '';
      } else {
        labelDisponible = '&nbsp <b>Disponible:</b> NO. ';
        if (itemCalendario.tipoAsignacion) {
          labelTipoAsignacion = '<p>  <b>Tipo Asignación:</b> ' + itemCalendario.tipoAsignacion.descripcion + '' ;
        } else {
          labelTipoAsignacion = '<p>  <b>Tipo Asignación:</b> ' + this.constants.noEncontrado ;
        }
      }
      events.push({
        title: hora + labelDisponible + labelTipoAsignacion,
        start: new Date(this.convertStringToDate(itemCalendario.inicio, MY_CUSTOM_FORMATS.parseInput)),
        end: new Date(this.convertStringToDate(itemCalendario.fin, MY_CUSTOM_FORMATS.parseInput)),
        color: itemCalendario.disponible ? colors.green : colors.red
      });
    });
    return events;
  }

  // Cambiar y Utilizar el metodo de utilitiesService (para mejorar)
  convertStringToDate(dateString: string, format: string = '') {
    if (!dateString) {
      return moment(new Date(), format).toDate();
    }

    if (typeof dateString == 'string') {
      dateString = dateString.replace(/-/g, '/');
    }

    if (dateString.split('/')[0].length < 4) {
      format = 'DD-MM-YYYY HH:mm:ss'
    } else {
      format = 'YYYY-MM-DD HH:mm:ss'
    }

    const dateConvert = moment(dateString, format);
    return moment(dateConvert, format).toDate();
  }
}