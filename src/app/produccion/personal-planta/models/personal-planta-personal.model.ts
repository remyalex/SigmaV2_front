export class PlanillaOperacionCriteria {
  public activo = '';
  public page = 0;
  public size = 10;
  public sortBy = 'id';
  public sortOrder = 'asc';
  public fecha: string = '';
  public estadodId: number;
  public responsableId: number;
  public fechaDesde: string = '';
  public fechaHasta: string = '';
  public turno: any = '';
  public pk: any;
  public tipoMaterial: any = '';
  public turnoId;
  public tipoMaterialId;
  public fechaTempDesde: string = '';
  public fechaTempHasta: string = '';


  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    this.turnoId = this.turno !== '' && this.turno !== undefined && this.turno !== null ? this.turno.id : '';
    this.tipoMaterialId = this.tipoMaterial !== '' && this.tipoMaterial !== undefined && this.tipoMaterial !== null  ? this.tipoMaterial.id : '';
    this.fechaTempDesde = this.fechaDesde === null || this.fechaDesde === '' ? '' : this.fechaDesde;
    this.fechaTempHasta = this.fechaHasta === null || this.fechaHasta === '' ? '' : this.fechaHasta;
    this.pk = this.pk !== '' && this.pk !== undefined && this.pk !== null ? this.pk : '';
    const actvidadId = 75;

    return 'turnoId=' + this.turnoId +
      '&tipoMaterialId=' + this.tipoMaterialId +
      '&fechaDesde=' + this.fechaTempDesde +
      '&fechaHasta=' + this.fechaTempHasta +
      '&actvidadId=' + actvidadId +
      '&responsableId=' + this.responsableId +
      '&pk=' + this.pk +
      '&page=' + this.page +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }
  public getUrlParameters_Trabajadores(): string {

    return 'eliminado=' + '' +
      '&personaId=' + '' +
      '&turnoId' + '' +
      '&fechaHasta' + '' +
      '&cargoId' + '' +
      '&nombresYApellidos' + '' +
      '&page=' + this.page +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

}


export class PersonalPlantaCriteria {
  public activo = '';
  public page = 0;
  public size = 10;
  public sortBy = 'id';
  public sortOrder = 'asc';
  public fecha: string = '';
  public estadodId: number;
  public responsableId: number;
  public fechaDesde: string = '';
  public fechaHasta: string = '';
  public turno: any = '';
  public tipoMaterial: any = '';
  public turnoId;
  public tipoMaterialId;
  public fechaTempDesde: string = '';
  public fechaTempHasta: string = '';
  public pk: any;

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    this.turnoId = this.turno !== '' && this.turno !== undefined && this.turno !== null ? this.turno.id : '';
    this.tipoMaterialId = this.tipoMaterial !== '' && this.tipoMaterial !== undefined && this.tipoMaterial !== null  ? this.tipoMaterial.id : '';

    return 'turnoId=' + this.turnoId +
      '&tipoMaterialId=' + this.tipoMaterialId +
      '&fechaDesde=' + '' +
      '&fechaHasta=' + '' +
      '&page=' + (this.page) +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

  public getUrlParameters_Trabajadores(): string {
    this.turnoId = this.turno !== '' && this.turno !== undefined && this.turno !== null ? this.turno.id : '';
    this.tipoMaterialId = this.tipoMaterial !== '' && this.tipoMaterial !== undefined && this.tipoMaterial !== null  ? this.tipoMaterial.id : '';
    this.fechaTempDesde = this.fechaDesde === null || this.fechaDesde === '' ? '' : this.fechaDesde;
    this.fechaTempHasta = this.fechaHasta === null || this.fechaHasta === '' ? '' : this.fechaHasta;

    return 'fecha=' + '' +
      '&turnoId=' + '' +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

}
