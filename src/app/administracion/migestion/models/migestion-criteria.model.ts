import { UtilitiesService } from 'src/app/shared/services/utilities.service';

export class MiGestionCriteria {

  public page = 0;
  public size = 10;
  public sortBy = 'fechaAsignacion';
  public sortOrder = 'desc';
  public responsableId: string;
  public pk: string;
  public actividadActual : any;
  public fechaDesde: string;
  public fechaHasta: string;
  public estadoPk: any;
  public tieneActividadActual = true;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private utilitiesService: UtilitiesService
  ) {}


  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    const estadoPkId = this.estadoPk ? this.estadoPk.id : '';
    const actividadActuald = this.actividadActual ? this.actividadActual.id : '';
    const responsableId = this.responsableId ? this.responsableId : '';
    const pk = this.pk ? this.pk : '';
    const fechaDesde = this.fechaDesde ? this.fechaDesde : '';
    const fechaHasta = this.fechaHasta ? this.utilitiesService.getFechaMasUnDia(this.fechaHasta) : '';

    return 'responsableId=' + responsableId +
      '&pk=' + pk +
      '&actividadActualId=' + actividadActuald +
      '&fechaDesde=' + fechaDesde +
      '&fechaHasta=' + fechaHasta +
      '&estadoPkId=' + estadoPkId +
      '&tieneActividadActual=' + this.tieneActividadActual +
      '&page=' + this.page +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }


  

}
