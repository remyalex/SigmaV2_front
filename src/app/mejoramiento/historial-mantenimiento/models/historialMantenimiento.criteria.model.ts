import { Lista } from 'src/app/administracion/listas/models/lista.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class HistorialMantenimientoCriteria {

    public pk: number;
    public tipoSolicitud: ListaItem;
    public estadoPk: ListaItem;
    public estadoMantenimiento: ListaItem;
    public localidad: ListaItem;
    public zona: ListaItem;
    public barrio: ListaItem;
    public upz: ListaItem;
    public upla: ListaItem;
    public tipoIntervencion: ListaItem;
    public fechaInicio: string;
    public fechaFin: string;
    public query: string;
    public queryURL: string;
    public page = 0;
    public size = 10;
    public sortBy = 'fechaInicio';
    public sortOrder = 'asc';

    constructor() {
    }

    /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {
        const pk = this.pk ? this.pk : '';
        const tipoSolicitud = this.tipoSolicitud ? this.tipoSolicitud.id : '';
        const estadoPkId = this.estadoPk ? this.estadoPk.id : '';
        const estadoMantenimientoId = this.estadoMantenimiento ? this.estadoMantenimiento.id : '';
        const localidadId = this.localidad ? this.localidad.id : '';
        const zonaId = this.zona ? this.zona.id : '';
        const barrioId = this.barrio ? this.barrio.id : '';
        const uplaId = this.upla ? this.upla.id : '';
        const tipoIntervencionTotalId = this.tipoIntervencion ? this.tipoIntervencion.id : '';
        const fechaInicio = this.fechaInicio ? this.fechaInicio : '';
        const fechaFin = this.fechaFin ? this.fechaFin : '';

        return 'pk=' + pk +
            '&tipoSolicitudId=' + tipoSolicitud +
            '&estadoPkId=' + estadoPkId +
            '&estadoMantenimientoId=' + estadoMantenimientoId +
            '&localidadId=' + localidadId +
            '&zonaId=' + zonaId +
            '&barrioId=' + barrioId +
            '&uplaId=' + uplaId +
            '&tipoIntervencionTotalId=' + tipoIntervencionTotalId +
            '&fechaInicio=' + fechaInicio +
            '&fechaFin=' + fechaFin +
            '&page=' + this.page +
            '&size=' + this.size +
            '&sortBy=' + this.sortBy +
            '&sortOrder=' + this.sortOrder;
    }

    public getUrlQuery(): string {
        return 'search=' + this.queryURL +
            '&pageNumber=' + this.page +
            '&pageSize=' + this.size +
            '&sortBy=' + this.sortBy +
            '&sortOrder=' + this.sortOrder;
    }
}





