import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { Usuario } from 'src/app/administracion/usuario/models/usuario.model';
import { Persona } from 'src/app/administracion/persona/models/persona.model';

export class MantenimientoCriteria {

    public pk: string;
    public estadoMantenimiento: ListaItem;
    public tipoSeccionVial: ListaItem;
    public tipoMalla: ListaItem;
    public actividadActualId: string;
    public origen: ListaItem;
    public solicitudFecha: string;
    public solicitudRadicadoEntrada: string;
    public solicitudRadicadoSalida: string;
    public solicitudDependenciaAsignada: string;
    public radicadoSolicitudReserva: string;
    public radicadoRespuestaReserva: string;
    public indicePriorizacion: string;
    public fechaVinculacionDesde: string;
    public fechaVinculacionHasta: string;
    public fechaAsignacion: string;
    public fechaAsignacionFin: string;
    public fechaSolicitudProgramacion: string;
    public tieneRadicadoSalida: string;
    public posibleDanioRedes: string;
    public localidad: ListaItem;
    public barrio: ListaItem;
    public zona: ListaItem;
    public tipoIntervencion: ListaItem;
    public civ: string;
    public fechaTerminacion: string;
    public ejeVial: string;
    public page = 0;
    public size = 10;
    public sortBy = 'pk';
    public sortOrder = 'asc';
    public responsableId: string;
    public responsableObject: Usuario;
    public upla: ListaItem;
    public upz: ListaItem;
    public permisoId: any;
    public ingenieroDisenioId: string;
    public ingenieroDisenioObject: Persona;
    public actividadAgrupada: ListaItem;
    public estadoProgramacionDiaria: ListaItem;
    public estadoPk: ListaItem;

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

    /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {
        const pk = this.pk ? this.pk : '';
        const civ = this.civ ? this.civ : '';
        const localidadId = this.localidad ? this.localidad.id : '';
        const barrioId = this.barrio ? this.barrio.id : '';
        const zonaId = this.zona ? this.zona.id : '';
        const tipoIntervencionId = this.tipoIntervencion ? this.tipoIntervencion.id : '';
        const estadoMantenimientoId = this.estadoMantenimiento ? this.estadoMantenimiento.id : '';
        const tipoSeccionVialId = this.tipoSeccionVial ? this.tipoSeccionVial.id : '';
        const tipoMallaId = this.tipoMalla ? this.tipoMalla.id : '';
        const actividadActualId = this.actividadActualId ? this.actividadActualId : '';
        const actividadAgrupada = this.actividadAgrupada ? this.actividadAgrupada.descripcion : '';
        const origenId = this.origen ? this.origen.id : '';
        const permisoId = this.permisoId ? this.permisoId : '';
        const solicitudFecha = this.solicitudFecha ? this.solicitudFecha : '';
        const solicitudRadicadoEntrada = this.solicitudRadicadoEntrada ? this.solicitudRadicadoEntrada : '';
        const solicitudRadicadoSalida = this.solicitudRadicadoSalida ? this.solicitudRadicadoSalida : '';
        const solicitudDependenciaAsignada = this.solicitudDependenciaAsignada ? this.solicitudDependenciaAsignada : '';
        const radicadoSolicitudReserva = this.radicadoSolicitudReserva ? this.radicadoSolicitudReserva : '';
        const radicadoRespuestaReserva = this.radicadoRespuestaReserva ? this.radicadoRespuestaReserva : '';
        const indicePriorizacion = this.indicePriorizacion ? this.indicePriorizacion : '';
        const fechaVinculacionDesde = this.fechaVinculacionDesde ? this.fechaVinculacionDesde : '';
        const fechaVinculacionHasta = this.fechaVinculacionHasta ? this.fechaVinculacionHasta : '';
        const tieneRadicadoSalida = this.tieneRadicadoSalida ? this.tieneRadicadoSalida : '';
        const posibleDanioRedes = this.posibleDanioRedes ? this.posibleDanioRedes : '';
        const fechaTerminacion = this.fechaTerminacion ? this.fechaTerminacion : '';
        const fechaSolicitudProgramacion = this.fechaSolicitudProgramacion ? this.fechaSolicitudProgramacion : '';
        let responsable: any = this.responsableId != null ? this.responsableId : '';
        const fechaAsignacion = this.fechaAsignacion != null ? this.fechaAsignacion : '';
        const fechaAsignacionFin = this.fechaAsignacionFin != null ? this.fechaAsignacionFin : '';
        const estadoPkId = this.estadoPk ? this.estadoPk.id : '';
        if (this.responsableObject) {
            responsable = this.responsableObject.id;
        }
        let ingenieroDisenio: any = this.ingenieroDisenioId != null ? this.ingenieroDisenioId : '';
        if (this.ingenieroDisenioObject) {
            ingenieroDisenio = this.ingenieroDisenioObject.id;
        }
        const ejeVial = this.ejeVial ? this.ejeVial : '';

        return 'pk=' + pk +
            '&responsableId=' + responsable +
            '&civ=' + civ +
            '&localidadId=' + localidadId +
            '&barrioId=' + barrioId +
            '&zonaId=' + zonaId +
            '&tipoIntervencionId=' + tipoIntervencionId +
            '&estadoMantenimientoId=' + estadoMantenimientoId +
            '&tipoSeccionVialId=' + tipoSeccionVialId +
            '&tipoMallaId=' + tipoMallaId +
            '&actividadActualId=' + actividadActualId +
            '&origenId=' + origenId +
            '&solicitudRadicadoEntrada=' + solicitudRadicadoEntrada +
            '&solicitudRadicadoSalida=' + solicitudRadicadoSalida +
            '&solicitudDependenciaAsignada=' + solicitudDependenciaAsignada +
            '&solicitudFecha=' + solicitudFecha +
            '&radicadoSolicitudReserva=' + radicadoSolicitudReserva +
            '&radicadoRespuestaReserva=' + radicadoRespuestaReserva +
            '&indicePriorizacion=' + indicePriorizacion +
            '&fechaVinculacionDesde=' + fechaVinculacionDesde +
            '&fechaVinculacionHasta=' + fechaVinculacionHasta +
            '&tieneRadicadoSalida=' + tieneRadicadoSalida +
            '&posibleDanioRedes=' + posibleDanioRedes +
            '&fechaTerminacion=' + fechaTerminacion +
            '&fechaSolicitudProgramacion=' + fechaSolicitudProgramacion +
            '&fechaAsignacion=' + fechaAsignacion +
            '&fechaAsignacionFin=' + fechaAsignacionFin +
            '&ejeVial=' + ejeVial +
            '&permisoId=' + permisoId +
            '&page=' + (this.page) +
            '&size=' + this.size +
            '&sortBy=' + this.sortBy +
            '&sortOrder=' + this.sortOrder +
            '&actividadAgrupada=' + actividadAgrupada +
            '&ingenieroDisenioId=' + ingenieroDisenio +
            '&estadoPkId=' + estadoPkId;
    }
}
