export class EquipoCriteria {

  /**Filtro para la clase del equipo */
  public claseEquipoId: any = '';
  /** Filtro para la marca del equipo */
  public marcaEquipoId: any = '';
  /** Filtro para el estado del equipo */
  public estadoEquipoId: any = '';
  /** Filtro para el lugar del equipo */
  public lugarEquipoId: any = '';
  /** Filtro para el número de móvil */
  public movil = '';
  /** Filtro del número interno del vehículo*/
  public numeroInterno = '';
  /** Filtro del numero de placa del equipo */
  public placa = '';
  /** Filtro para el numero de placa del inventario */
  public placaInventario = '';
  /** Filtro para el origen del equipo */
  public origenEquipoId: any = '';
  /** Filtro para el tipo de equipo */
  public tipoEquipoId: any = '';
  /** Filtro de tipo del equipo */
  public tipoId;
  /** Filtro de clase del equipo */
  public claseId;
  /** Filtro de marca del equipo */
  public marcaId;
  /** Filtro de estado actual del equipo */
  public estadoId;
  /**Filtro de lugar del equipo */
  public lugarId;
  /**Filtro de origen del equipo */
  public origenId;

  /** Filtro para identificar si es activo */
  public activo = '';

  public esMaquinariaProduccion = false;

  /** Filtro de la pagina actual usado para paginador */
  public page = 0;
  /** Filtro de cantidad de registros por página */
  public size = 10;
  /** nombre de la columna por la cual se realizará el ordenamiento */
  public sortBy = 'numeroInterno';
  /** tipo de ordenamiento de la grilla */
  public sortOrder = 'asc';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    this.tipoId = this.tipoEquipoId !== undefined ? this.tipoEquipoId !== '' ? this.tipoEquipoId.id : '' : '';
    this.claseId = this.claseEquipoId !== undefined ? this.claseEquipoId !== '' ? this.claseEquipoId.id : '' : '';
    this.marcaId = this.marcaEquipoId !== undefined ? this.marcaEquipoId !== '' ? this.marcaEquipoId.id : '' : '';
    this.estadoId = this.estadoEquipoId !== undefined ? this.estadoEquipoId !== '' ? this.estadoEquipoId.id : '' : '';
    this.lugarId = this.lugarEquipoId !== undefined ? this.lugarEquipoId !== '' ? this.lugarEquipoId.id : '' : '';
    this.origenId = this.origenEquipoId !== undefined ? this.origenEquipoId !== '' ? this.origenEquipoId.id : '' : '';

    return 'claseEquipoId=' + this.claseId +
      '&movil=' + this.movil +
      '&numeroInterno=' + this.numeroInterno +
      '&placa=' + this.placa +
      '&placaInventario=' + this.placaInventario +
      '&origenEquipoId=' + this.origenEquipoId +
      '&tipoEquipoId=' + this.tipoId +
      '&marcaEquipoId=' + this.marcaId +
      '&estadoEquipoId=' + this.estadoId +
      '&lugarEquipoId=' + this.lugarId +
      '&esMaquinariaProduccion=' + this.esMaquinariaProduccion +
      '&activo=' + this.activo +
      '&page=' + (this.page) +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

}
