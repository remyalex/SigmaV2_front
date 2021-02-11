export class AsignarConductoresMaquinariaCriteria {
  public fecha = '';
  public tipoEnsayoId: any = '';
  public fechaRegistroEnsayo = '';
  public page = 0;
  public size = 10;
  public sortBy = 'id';
  public sortOrder = 'asc';
  public filtroIntervencion: any = '';
  public valorIntervencion: any = '';
  public nrointervencion: number;
  public pk: number;
  public civ: number;
  public fechaInicioVisita: string;
  public fechaFinVisita: string;

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {
    const id = this.nrointervencion !== undefined && this.nrointervencion != null ? this.nrointervencion : '';
    const valorPk = this.pk !== undefined && this.pk != null ? this.pk : '';
    const valorCiv = this.civ !== undefined && this.civ != null ? this.civ : '';
    const valorFechaInicio =
      this.fechaInicioVisita !== undefined && this.fechaInicioVisita != null && this.fechaInicioVisita !== '' ? this.fechaInicioVisita : '';
    const valorFechaFin =
      this.fechaFinVisita !== undefined && this.fechaFinVisita != null && this.fechaFinVisita !== '' ? this.fechaFinVisita : '';


    return 'id=' + id +
      '&civ=' + valorCiv +
      '&fechaInicioVisita=' + valorFechaInicio +
      '&fechaFinVisita=' + valorFechaFin +
      '&page=' + this.page +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }
}


export class AsignarConductoresMaquinariaList {
  public fecha = '';
  public tipoEnsayoId = '';
  public fechaRegistroEnsayo = '';
  public page = 0;
  public size = 10;
  public sortBy = 'id';
  public sortOrder = 'asc';
  public filtroIntervencion: any = '';
  public valorIntervencion: any = '';
  public nrointervencion: number;
  public pk: number;
  public civ: number;
  public fechaInicioVisita: string;
  public fechaFinVisita: string;

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {
    const id = this.nrointervencion !== undefined && this.nrointervencion != null ? this.nrointervencion : '';
    const valorPk = this.pk !== undefined && this.pk != null ? this.pk : '';
    const valorCiv = this.civ !== undefined && this.civ != null ? this.civ : '';
    const valorFechaInicio =
     this.fechaInicioVisita !== undefined && this.fechaInicioVisita != null && this.fechaInicioVisita !== '' ? this.fechaInicioVisita : '';
    const valorFechaFin =
     this.fechaFinVisita !== undefined && this.fechaFinVisita != null && this.fechaFinVisita !== '' ? this.fechaFinVisita : '';


    return 'id=' + id +
      '&civ=' + valorCiv +
      '&fechaInicioVisita=' + valorFechaInicio +
      '&fechaFinVisita=' + valorFechaFin +
      '&page=' + this.page +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }
}


export class AsignarConductoresMaquinariaPersonas {
  public fecha = '';
  public tipoEnsayoId: any = '';
  public fechaRegistroEnsayo = '';
  public page = 0;
  public size = 10;
  public sortBy = 'id';
  public sortOrder = 'asc';
  public filtroIntervencion: any = '';
  public valorIntervencion: any = '';
  public nrointervencion: number;
  public pk: number;
  public civ: number;
  public fechaInicioVisita: string;
  public fechaFinVisita: string;
  public nombreCompleto: string;

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters_Personas(): string {
    const id = this.nrointervencion !== undefined && this.nrointervencion != null ? this.nrointervencion : '';
    const valorPk = this.pk !== undefined && this.pk != null ? this.pk : '';
    const valorCiv = this.civ !== undefined && this.civ != null ? this.civ : '';
    const valorFecha = this.fecha !== undefined && this.fecha != null && this.fecha !== '' ? this.fecha : '';

    const valornombreCompleto =
     this.nombreCompleto !== undefined && this.nombreCompleto != null && this.nombreCompleto !== '' ? this.nombreCompleto : '';
    const valorFechaFin =
     this.fechaFinVisita !== undefined && this.fechaFinVisita != null && this.fechaFinVisita !== '' ? this.fechaFinVisita : '';
    const prueba = '';


    return '?fecha=' + prueba +
      '&horario=' + prueba +
      '&nombreCompleto=' + valornombreCompleto +
      '&fechaInicio=' + valorFecha +
      '&fechaFin=' + prueba +
      '&page=' + this.page +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

}



