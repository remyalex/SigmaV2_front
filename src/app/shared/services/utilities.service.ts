import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { CONST_SHARED } from '../constantes-shared';
import { MultipleErrorMatSnackbarComponent } from '../component/multiple-error-mat-snackbar/multiple-error-mat-snackbar.component';

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  /** Constantes a usar en el componente */
  constants = CONST_SHARED;

  // Devuelve un string que representa una fecha en foramto admitido para ser almacenado en base de datos
  // es decir, recibe una fecha formato Date (moment) y la devuelve en formato 'dd-MM-yyyy'
  getFechaActual() {
    return moment();
  }

  getDateString(fecha: Date) {
    if (fecha == null) {
      return '';
    }
    const fechaStr = fecha.toJSON();
    return fechaStr.substring(8, 10) + '/' + fechaStr.substring(5, 7) + '/' + fechaStr.substring(0, 4);
  }

  // Devuelve un string que representa una fecha en foramto admitido para ser almacenado en base de datos
  // es decir, recibe una fecha formato Date (moment) y la devuelve en formato 'dd-MM-yyyy'
  getFechaServerFormat(fecha: any) {
    if (typeof fecha == 'undefined' || fecha == null) {
      return null;
    }

    if (Object.prototype.toString.call(fecha) == '[object Object]') {
      if (fecha.isValid() == false) {
        return null;
      }
    }

    if (Object.prototype.toString.call(fecha) == '[object Date]' && isNaN(fecha.getTime())) {
      // No es una fecha válida
      return null;
    }

    let fechaStr = fecha.toJSON().substring(0, 10);
    const tieneFormatoLatino = fechaStr.search('/');
    // if (tieneFormatoLatino > 0) {
    fechaStr = fechaStr.substring(8, 10) + '-' + fechaStr.substring(5, 7) + '-' + fechaStr.substring(0, 4);
    // }
    return fechaStr;
  }

  // Deprecated
  // Devuelve un string que representa una fecha en foramto para clientes (Web)
  // es decir, recibe una fecha formato 'dd-MM-yyyy'   y la devuelve en formato Date (moment)
  getFechaClientFormat(fechaString: string) {
    if (fechaString == null || fechaString == '') {
      return null;
    }
    return moment(fechaString, 'DD-MM-YYYY');
  }

  // Devuelve un string que representa una fecha en foramto para clientes (Web)
  // es decir, recibe una fecha formato 'dd-MM-yyyy'   y la devuelve en formato Date (moment)
  getFechaClientFormatFix(fechaString: string): Date {
    if (fechaString == null || fechaString == '') {
      return null;
    }
    const fechaConvertida = moment(fechaString, 'DD-MM-YYYY');
    return moment(fechaConvertida, 'YYYY-MM-DD').toDate();
  }

  // Devuelve un string que representa una fecha en foramto para usuarios finales
  // es decir, recibe una fecha formato 'dd-MM-yyyy'   y la devuelve en formato dd/MM/yyyy
  getFechaFinalUserFormat(fechaString: string) {
    if (fechaString == null || fechaString == '') {
      return null;
    }
    const fecha = fechaString.replace('-', '/');
    return fecha.replace('-', '/');
  }

  // Devuelve un string que representa una hora del dia en foramto admitido para ser almacenado en base de datos
  // es decir, recibe una hora en formato 'hh:mm' y la devuelve en formato '0 hh:mm:0.0'
  getHoraServerFormat(hora: string) {

    if (typeof hora == 'undefined' || hora == '') {
      return null;
    }
    return '0 ' + hora + ':0.0';
  }

  // Devuelve un string que representa una hora del dia en foramto (hh:mm) para ser visualizado en un cliente
  // es decir, recibe una hora en formato '0 hh:mm:0.0' y la devuelve en formato 'hh:mm'
  getHoraClientFormat(hora: string) {
    if (hora == null || hora == '') {
      return '';
    }
    const posicionLimiteHora = hora.lastIndexOf(':'); // es decir el ultimo caracter : (dos puntos)
    if (posicionLimiteHora > 0) {
      const dataTimeFix = hora.split(' ');
      const dataTime = dataTimeFix[1].split(':');
      let onlyHora = dataTime[0];
      let onlyMinuto = dataTime[1];

      if (Number(dataTime[0]) < 10) {
        if(dataTime[0].split('0')) {
          onlyHora =  dataTime[0];
        } else {
          onlyHora = '0' + dataTime[0];
        }
      }
      if (Number(dataTime[1]) < 10) {
        if(dataTime[1].split('0')) {
          onlyMinuto =  dataTime[1];
        } else {
          onlyMinuto = '0' + dataTime[1];
        }
      }
      return onlyHora + ':' + onlyMinuto;
    } else {
      return '';
    }
  }

  getFechaServerFormat_aaaaMMdd(fecha: Date) {
    if (fecha == null) {
      return '';
    }
    let fechaStr = fecha.toJSON().substring(0, 10);
    const tieneFormatoLatino = fechaStr.search('/');
    // if (tieneFormatoLatino > 0) {
    fechaStr = fechaStr.substring(0, 4) + '-' + fechaStr.substring(5, 7) + '-' + fechaStr.substring(8, 10);
    // }
    return fechaStr;
  }

  getFechaServerFormat_aaaaMMddNoSeparator(fechaStr: string) {
    const fechaStrOut = fechaStr.substring(6, 10) + fechaStr.substring(3, 5) + fechaStr.substring(0, 2);
    return fechaStrOut;
  }

  //Recibe una fecha string en formato dd-mm-yyyy y le incremente un dia
  //Esta funcion se usa por ejemplo en filtros de fecha hasta.
  getFechaMasUnDia(fechaHasta: string) {
    var array = fechaHasta.split("-");

    var dd = parseInt(array[0]);
    var mm = parseInt(array[1]) - 1;
    var y = parseInt(array[2]);

    var date = new Date(y, mm, dd);

    date.setDate(date.getDate() + 1);

    var newDay = "";
    var newMonth = "";
    var newYear = "";

    if (date.getDate() < 10) {
      newDay = '0' + date.getDate().toString();
    }
    else {
      newDay = date.getDate().toString();
    }

    if (date.getMonth() < 9) {
      newMonth = '0' + (date.getMonth() + 1).toString();
    }
    else {
      newMonth = (date.getMonth() + 1).toString();
    }

    newYear = date.getFullYear().toString();

    var someFormattedDate = newDay + '-' + newMonth + '-' + newYear;

    return someFormattedDate;
  }

  getFechaServerFormat_ddMMaaaa(fecha: Date) {
    if (fecha == null) {
      return '';
    }
    let fechaStr = fecha.toJSON().substring(0, 10);
    const tieneFormatoLatino = fechaStr.search('/');
    fechaStr = fechaStr.substring(8, 10) + '-' + fechaStr.substring(5, 7) + '-' + fechaStr.substring(0, 4);
    return fechaStr;
  }

  getFechaServerFormatLite_ddMMaaaa(fecha: Date) {
    if (fecha == null) {
      return '';
    }
    let fechaStr = fecha.toJSON().substring(0, 10);
    const tieneFormatoLatino = fechaStr.search('/');
    fechaStr = fechaStr.substring(8, 10) + fechaStr.substring(5, 7) + fechaStr.substring(0, 4);

    return fechaStr;
  }

  validateFechasMayorMenor(fechaInicio: Date, fechaFin: Date): boolean {
    if (fechaInicio != null && fechaFin != null) {
      if (fechaInicio > fechaFin) {
        return false;
      }
    }
    return true;
  }


  validateHorasMayorMenor(horaInicial: any, horaFinal: any): boolean {

    if (typeof horaInicial == 'undefined' || typeof horaFinal == 'undefined' || horaInicial == '' || horaFinal == '') {
      return true;
    }
    const fechaFromHourInitial = moment('01-01-2000 ' + horaInicial, 'DD-MM-YYYY hh:mm');
    const fechaFromHourEnd = moment('01-01-2000 ' + horaFinal, 'DD-MM-YYYY hh:mm');
    if (fechaFromHourInitial != null && fechaFromHourEnd != null) {
      if (fechaFromHourInitial > fechaFromHourEnd) {
        return false;
      }
    }
    return true;
  }

  // convierte un string a una fecha.
  convertStringToDate(dateString: string, format: string = '') {
    if (!dateString || dateString == null) {
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

  // convierte una fecha a un string.
  convertDateToString(dateString: any, format: string = null): string {
    if (!format) {
      format = 'YYYY/MM/DD';
    }

    if (typeof dateString == 'string') {
      dateString = this.convertStringToDate(dateString, format);
    }

    return moment(dateString).format(format).toString();
  }

  // convierte una fecha a un string.
  convertDateValueToString(datedate: any, format: string = null): string {
    // if (!format) {
    //   format = 'YYYY/MM/DD';
    // }

    // if (typeof datedate == 'string') {
    //   datedate = this.convertStringToDate(datedate, format);
    // }

    return moment.unix(datedate).format(format).toString();
  }

  // convierte un string a una hora.
  convertStringToHour(hourString: string, format: string = '') {
    if (!hourString) {
      return moment(new Date(), format).toDate();
    }

    const hora: Date = moment(hourString, format).toDate();
    const dateConvert = moment(hourString, format);
    return moment(dateConvert, format).toDate();
  }

  // convierte una hora a un string.
  convertHourToString(hourString: any, format: string = null): string {
    if (!format) {
      format = 'HH:mm';
    }

    if (typeof hourString == 'string') {
      hourString = this.convertStringToHour(hourString, format);
    }

    return moment(hourString).format(format).toString();
  }

  getWeekDay(date): string {
    let fecha = this.convertStringToDate(date, "DD-MM-YYYY");
    let day = fecha.getDay();
    let stringDay = '';

    switch (day) {
      case 1:
        stringDay = this.constants.week.lunes;
        break;
      case 2:
        stringDay = this.constants.week.martes;
        break;
      case 3:
        stringDay = this.constants.week.miercoles;
        break;
      case 4:
        stringDay = this.constants.week.jueves;
        break;
      case 5:
        stringDay = this.constants.week.viernes;
        break;
      case 6:
        stringDay = this.constants.week.sabado;
        break;
      case 0:
        stringDay = this.constants.week.domingo;
        break;
      default:
        break;
    }
    return stringDay;
  }

  // Presenta la información que tengan los pks consultados por el Argis
  showInfoPKData(pkData: any, atributo = ''): string {
    if (!pkData || !atributo) {
      return this.constants.noEncontrado;
    }

    if (pkData.features) {
      if (pkData.features.length <= 0) {
        return this.constants.noEncontrado;
      }
      if (pkData.features[0].attributes) {
        if (typeof pkData.features[0].attributes[atributo] != 'undefined') {
          return pkData.features[0].attributes[atributo];
        } else {
          return this.constants.noEncontrado;
        }
      }
    } else {
      return this.constants.noEncontrado;
    }

    return this.constants.noEncontrado;
  }

  uppercase(value) {
    if (value.length <= 0) {
      return '';
    }

    return value.toUpperCase();
  }

  uniqArray(items: any): any {
    return Array.from(new Set(items.map(item => JSON.stringify(item)))).map((item: string) => JSON.parse(item));
  }

  orderArray(data: any, campo = 'descripcion'): any {
    if (!data) {
      return [];
    }
    if (data.length > 0) {
      try {
        return data.sort((a, b) => (a[campo].localeCompare(b[campo])));
      } catch (error) {
        return data.sort((a, b) => (a[campo] > b[campo]) ? 1 : -1);
      }
    }

    return [];
  }

  clearHora(hora) {
    if (!hora) {
      return null;
    }

    if (typeof hora != 'string') {
      return null;
    }

    const replaces = ['+00 ', '+00', '0 ', '.0', , ' 0 '];
    let date = new Date();

    replaces.map(data => {
      hora = hora.replace(data, '');
    });

    let fecha = date.getFullYear() + '/01/01 ' + hora;
    return fecha;
  }

  formSuccessMessages(message, snackBar) {
    snackBar.open(
      message, 'X', {
      duration: 5000,
      panelClass: ['success-snackbar']
    }
    );
  }

  ErrorMessages(message, snackBar) {
    snackBar.open(
      message, 'X', {
      duration: 6000,
      panelClass: ['error-snackbar']
    }
    );
  }

  formErrorMessages(error, form, snackBar) {
    if (error.status === 400 || error.status === 409) {
      let errorMessage: String;
      try {
        form.controls[error.error[0].field].setErrors({ 'incorrect': true });
      } catch (error) { }
      snackBar.openFromComponent(
        MultipleErrorMatSnackbarComponent,
        {
          data: error.error,
          duration: 6000,
          panelClass: ['error-snackbar']
        }
      );
    } else if (error.status == 401 || error.status == 403) {
      snackBar.open(
        this.constants.unauthorized, 'X', {
        duration: 6000,
        panelClass: ['error-snackbar']
      }
      );
    } else if (error.status == 404) {
      snackBar.open(
        this.constants.noResultados, 'X', {
        duration: 6000,
        panelClass: ['error-snackbar']
      }
      );
    } else if (error.status == 500) {
      let errorMessage: String;
      try {
        snackBar.open(
          error.error.message, 'X', {
          duration: 6000,
          panelClass: ['error-snackbar']
        }
        );
      } catch (error) {
        snackBar.open(
          this.constants.error500, 'X', {
          duration: 6000,
          panelClass: ['error-snackbar']
        }
        );
      }

    } else {
      snackBar.open(
        this.constants.error500, 'X', {
        duration: 6000,
        panelClass: ['error-snackbar']
      }
      );
    }
  }

  formatoHora(value): string {
    let formato = "HH:mm:ss";
    return this.convertDateToString(this.clearHora(value), formato);
  }

  scrollToTop() {
    try {
      let element: HTMLElement = document.getElementsByClassName('back-to-top')[0] as HTMLElement;
      element.click();
    } catch (error) { }
  }

  getFechaFormatServer_dd_mm_yyyy(fecha: Date) {
    const dia = fecha.getDate().toString().length > 1 ? fecha.getDate() : '0' + fecha.getDate();
    const mes = (fecha.getMonth() + 1).toString().length > 1 ? (fecha.getMonth() + 1) : '0' + (fecha.getMonth() + 1);
    return dia + '-' + mes + '-' + fecha.getFullYear();
  }

  getSundayDateFromStringDate(fechaString: string, formato: string = ''): Date {
    let fecha = this.convertStringToDate(fechaString, formato);
    while (fecha.getDay() !== 6) {
      const fechaMas1 = fecha.getTime() + 86400000;
      fecha = new Date(fechaMas1);
    }
    const fechaLastMas1 = fecha.getTime() + 86400000;
    fecha = new Date(fechaLastMas1);
    return fecha; //this.convertDateValueToString(fecha, 'dd-MM-yyyy');
  }

  getFridayDateFromStringDate(fechaString: string, formato: string = ''): Date {
    let fecha = this.convertStringToDate(fechaString, formato);
    while (fecha.getDay() !== 5) {
      const fechaMas1 = fecha.getTime() + 86400000;
      fecha = new Date(fechaMas1);
    }
    return fecha; //this.convertDateValueToString(fecha, 'dd-MM-yyyy');
  }

  // parseDiasCalendario(action: string, object:any):any {
  //   const dias= [];
  //   if (action === 'set') {
  //     this.equipoconductor.dias = [];
  //     this.equipoconductor.diasSemana.forEach(element => {
  //       //const itemDia:  EquipoConductorDia= null;
  //       //const itemDia: EquipoConductorDia = new EquipoConductorDia();
  //       const itemDia= null;
  //       itemDia.dia = element;
  //       itemDia.activo = true;
  //       dias.push(itemDia );
  //     });
  //   }
  // }

  addDays(fecha: Date, days: number): Date {
    fecha.setDate(fecha.getDate() + days);
    return fecha;
  }

  removeDays(fecha: Date, days: number): Date {
    fecha.setDate(fecha.getDate() - days);
    return fecha;
  }

  public isValidDateWithFormat(fecha: string, format: string): Boolean {
    return moment(this.getFechaClientFormat(fecha), 'DD-MMM-YYYY', true).isValid();
  }

}