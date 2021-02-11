import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { Localidad } from 'src/app/administracion/ubicaciones/localidad/models/localidad.model';
import { Upz } from 'src/app/administracion/ubicaciones/upz/models/upz.model';
import { Barrio } from 'src/app/administracion/ubicaciones/barrio/models/barrio.model';
import { PeriodicidadModel } from '../../models/periodicidad.model';
import { UsuarioInfo } from 'src/app/workflow/models/usuario-info.model';

export class ConsultarProgramacionCriteria {

    public zona: ListaItem;
    public localidad: Localidad;
    public upla: Upz;
    public barrio: Barrio;
    public directorObra: UsuarioInfo;
    public tipoIntervencion: ListaItem;
    public estrategia: ListaItem;
    public vigencia: ListaItem;
    public periodicidad: PeriodicidadModel;
    public periodo: PeriodicidadModel;
    public fechaInicioCorte: string;
    public fechaFinCorte: string;
    public pk: number;
    public estadoPk: ListaItem;
    public estadoObra: ListaItem;
    public queryURL: string;
    public page = 0;
    public size = 20;
    public sortBy = 'pk';
    public sortOrder = 'asc';

    constructor() {  }

    /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {
        const zonaId = this.zona ? this.zona.id : '';
        const localidadId = this.localidad ? this.localidad.id : '';
        const uplaId = this.upla ? this.upla.id : '';
        const barrioId = this.barrio ? this.barrio.id : '';
        const directorObraId = this.directorObra ? this.directorObra.id : '';
        const tipoIntervencionTotalId = this.tipoIntervencion ? this.tipoIntervencion.id : '';
        const estrategiaId = this.estrategia ? this.estrategia.id : '';
        const vigenciaId = this.vigencia ? this.vigencia.id : '';
        const periodicidadId = this.periodicidad ? this.periodicidad.id : '';
        const periodoId = this.periodo ? this.periodo.id : '';
        const fechaInicioCorte = this.fechaInicioCorte ? this.fechaInicioCorte : '';
        const fechaFinCorte = this.fechaFinCorte ? this.fechaFinCorte : '';
        const pk = this.pk ? this.pk : '';
        const estadoPkNombre = this.estadoPk ? this.estadoPk.descripcion : '';
        const estadoObraId = this.estadoObra ? this.estadoObra.id : '';

        return 'zonaId=' + zonaId +
            '&localidadId=' + localidadId +
            '&uplaId=' + uplaId +
            '&barrioId=' + barrioId +
            '&directorObraId=' + directorObraId +
            '&tipoIntervencionTotalId=' + tipoIntervencionTotalId +
            '&estrategiaId=' + estrategiaId +
            '&vigenciaId=' + vigenciaId +
            '&periodicidadId=' + periodicidadId +
            '&periodoId=' + periodoId +
            // '&fechaInicioCorte='+ fechaInicioCorte +
            // '&fechaFinCorte='+ fechaFinCorte +
            '&pk=' + pk +
            '&estadoPkNombre=' + estadoPkNombre +
            '&estadoObraId=' + estadoObraId +
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