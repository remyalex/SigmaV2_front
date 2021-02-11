import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { UsuarioInfo } from 'src/app/workflow/models/usuario-info.model';
import { Persona } from 'src/app/administracion/persona/models/persona.model';
import { Usuario } from 'src/app/administracion/usuario/models/usuario.model';
import { Zona } from 'src/app/administracion/ubicaciones/zona/models/zona.model';
import { Localidad } from 'src/app/administracion/ubicaciones/localidad/models/localidad.model';
import { Barrio } from 'src/app/administracion/ubicaciones/barrio/models/barrio.model';
import { Upla } from 'src/app/administracion/ubicaciones/upla/models/upla.model';
import { Upz } from 'src/app/administracion/ubicaciones/upz/models/upz.model';
import { Cuadrante } from 'src/app/administracion/ubicaciones/cuadrante/models/cuadrante.model';

export class GridMantenimientoCriteria {

    public condicionId: number;
    public id: string;
    public pk: string;
    public estadoMantenimiento: ListaItem;
    public tipoSeccionVial: ListaItem;
    public tipoMalla: ListaItem;
    public actividadActualId: string;
    public origen: ListaItem;
    public solicitudRadicadoEntrada: string;
    public solicitudRadicadoSalida: string;
    public indicePriorizacion: string;
    public indicePriorizacionDesde: string;
    public indicePriorizacionHasta: string;
    public solicitudFechaVinculacionDesde = '';
    public solicitudFechaVinculacionHasta = '';
    public tieneRadicadoSalida: string;
    public posibleDanioRedes: string;
    public localidad: Localidad;
    public cuadrante: Cuadrante;
    public barrio: Barrio;
    public zona: Zona;
    public civ: string;
    public turnoEjecucion: string;
    public fechaAsignacionDesde = '';
    public fechaAsignacionHasta = '';
    public fechaVencimientoDesde = '';
    public fechaVencimientoHasta = '';
    public fechaVisitaTecnicaDesde = '';
    public fechaInstalacionDesde = '';
    public fechaInstalacionHasta = '';
    public fechasIntervencionDesde = '';
    public fechasIntervencionHasta = '';
    public fechaProgramacionIntervencionDesde = '';
    public fechaProgramacionIntervencionHasta  = '';
    public fechaVisitaTecnicaHasta = '';
    public responsable: UsuarioInfo;
    public ejecutadoPor: UsuarioInfo;
    public estadoPk: ListaItem;
    public tipoActividad: ListaItem;
    public enSeguimiento: string;
    public fechaSeguimientoDesde = '';
    public fechaSeguimientoHasta = '';
    public upz: Upz;
    public upla: Upla;
    public tipoIntervencion: ListaItem;
    public estrategia: ListaItem;
    public fechaProgramacionVisitaDesde = '';
    public fechaProgramacionVisitaHasta = '';
    public directorDeObra: UsuarioInfo;
    public prioritarios: string;
    public tipoRadicadoRespuestaReserva: ListaItem;
    public radicadoIntervencion: string;
    public radicadoInterExclusivo: string;
    public fechaAsignacionIngenieroDisenioDesde = '';
    public fechaAsignacionIngenieroDisenioHasta = '';
    public ingenieroDisenio: Persona;
    public fechaSolicitudSmvlDesde = '';
    public fechaSolicitudSmvlHasta = '';
    public numeroRadicadoSmvl: string;
    public listaChequeoSmvl: ListaItem;
    public fechaSolicitudGasaDesde = '';
    public fechaSolicitudGasaHasta = '';
    public numeroRadicadoGasa: string;
    public listaChequeoGasa: string;
    public estadoProgramacionVisita: ListaItem;
    public radicadoSolicitudReserva: string;
    public radicadoRespuestaReserva: string;
    public fechaProgramacionDiariaDesde: '';
    public fechaProgramacionDiariaHasta: '';
    public jornada: ListaItem;
    public jornadaProgDiaria: ListaItem;
    public fechaInformeDesde = '';
    public fechaInformeHasta = '';
    public estadoObra: ListaItem;
    public estadoRegistroDiarioCuadrilla: ListaItem;
    public avancePorcentajeAcumuladoObraDesde: number;
    public avancePorcentajeAcumuladoObraHasta: number;
    public estadoProgramacionPk: ListaItem;
    public fechaIntervencionDesde = '';
    public fechaIntervencionHasta = '';
    public residenteSocial: UsuarioInfo;
    public tieneResidenteSocial: string;
    public residenteAmbiental: UsuarioInfo;
    public tieneResidenteAmbiental: string;
    public tieneResidenteSST: string;
    public residenteSST: UsuarioInfo;
    public page = 0;
    public size = 10;
    public sizeSeleccionados = 10;
    public sortBy = 'pk';
    public sortOrder = 'asc';
    public isExport = false;
    public permisoId = null;
    public responsableVisitaTecnica: UsuarioInfo;
    public responsableRevision: UsuarioInfo;
    public tieneSolicitudLaboratorio: string;
    public espesorDisenio: number;
    public frecuencia: ListaItem;
    public tipoMezcla: ListaItem;
    public fechaDespachoDesde = '';
    public fechaDespachoHasta = '';
    public fechaSolicitudDesde = '';
    public fechaSolicitudHasta = '';
    public estadoInspeccionIntervencion: ListaItem;
    public fechaProgramacionIntervencion: '';
    public actividadAgrupada: ListaItem;
    public estadoProgramacionDiaria: ListaItem;
    public actividadActualProcesoParaleloId: string;
    public fechaSolicitudEnsayo = '';
    public tipoEnsayo: ListaItem;
    public fechaRegistroEnsayo = '';

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

    public getMapQuery(): string {

        let query = '';

        if (this.pk) {
            query = 'PK_ID_CALZADA = ' + this.pk;
        }

        if (this.civ) {
            if (query.length > 0) {
                query = query + ' AND CIV = ' + this.civ;
            } else {
                query = 'CIV = ' + this.civ;
            }
        }

        if (this.localidad) {
            if (query.length > 0) {
                query = query + ' AND ID_LOCALIDAD = ' + this.localidad.id;
            } else {
                query = 'ID_LOCALIDAD = ' + this.localidad.id;
            }
        }

        if (this.cuadrante) {
            if (query.length > 0) {
                query = query + ' AND ID_CUADRANTE = ' + this.cuadrante.id;
            } else {
                query = 'ID_CUADRANTE = ' + this.cuadrante.id;
            }
        }

        if (this.barrio) {
            if (query.length > 0) {
                query = query + ' AND ID_BARRIO = ' + this.barrio.id;
            } else {
                query = 'ID_BARRIO = ' + this.barrio.id;
            }
        }

        if (this.zona) {
            if (query.length > 0) {
                query = query + ' AND ID_ZONA = ' + this.zona.id;
            } else {
                query = 'ID_ZONA = ' + this.zona.id;
            }
        }

        if (this.upla) {
            if (query.length > 0) {
                query = query + ' AND ID_UPLA = ' + this.upla.id;
            } else {
                query = 'ID_UPLA = ' + this.upla.id;
            }
        }

        if (this.estadoMantenimiento) {
            if (query.length > 0) {
                query = query + ' AND ESTADO_MANTENIMIENTO_ID = ' + this.estadoMantenimiento.id;
            } else {
                query = 'ESTADO_MANTENIMIENTO_ID = ' + this.estadoMantenimiento.id;
            }
        }

        if (this.tipoSeccionVial) {
            if (query.length > 0) {
                query = query + ' AND ID_TIPO_SECCION_VIAL = ' + this.tipoSeccionVial.id;
            } else {
                query = 'ID_TIPO_SECCION_VIAL = ' + this.tipoSeccionVial.id;
            }
        }

        if (this.estadoInspeccionIntervencion) {
            if (query.length > 0) {
                query = query + ' AND ID_ESTADO_INSPECCION_INTERVENCION = ' + this.estadoInspeccionIntervencion.id;
            } else {
                query = 'ID_ESTADO_INSPECCION_INTERVENCION = ' + this.estadoInspeccionIntervencion.id;
            }
        }

        if (this.tipoMalla) {
            if (query.length > 0) {
                query = query + ' AND ID_TIPO_MALLA = ' + this.tipoMalla.id;
            } else {
                query = 'ID_TIPO_MALLA = ' + this.tipoMalla.id;
            }
        }

        if (this.actividadActualId) {
            if (this.actividadActualId.includes('NULL')) {
                if (query.length > 0) {
                    query = query + ' AND ACTIVIDAD_MANTENIMIENTO_ID IS ' + this.actividadActualId;
                } else {
                    query = 'ACTIVIDAD_MANTENIMIENTO_ID IS ' + this.actividadActualId;
                }

            } else {
                if (query.length > 0) {
                    query = query + ' AND ACTIVIDAD_MANTENIMIENTO_ID = ' + this.actividadActualId;
                } else {
                    query = 'ACTIVIDAD_MANTENIMIENTO_ID = ' + this.actividadActualId;
                }
            }
        }

        if (this.origen) {
            if (query.length > 0) {
                query = query + ' AND VALOR_ORIGEN = \'' + this.origen.valor + '\'';
            } else {
                query = 'VALOR_ORIGEN = \'' + this.origen.valor + '\'';
            }
        }

        if (this.solicitudRadicadoEntrada) {
            if (this.solicitudRadicadoEntrada.includes('NULL')) {
                if (query.length > 0) {
                    query = query + ' AND NUMERO_RADICADO_ENTRADA IS ' + this.solicitudRadicadoEntrada;
                } else {
                    query = 'NUMERO_RADICADO_ENTRADA IS ' + this.solicitudRadicadoEntrada;
                }
            } else {
                if (query.length > 0) {
                    query = query + ' AND NUMERO_RADICADO_ENTRADA = ' + this.solicitudRadicadoEntrada;
                } else {
                    query = 'NUMERO_RADICADO_ENTRADA = ' + this.solicitudRadicadoEntrada;
                }
            }
        }
        if (this.indicePriorizacion) {
            if (this.indicePriorizacion.includes('NULL')) {
                if (query.length > 0) {
                    query = query + ' AND INDICE_PRIORIZACION IS ' + this.indicePriorizacion;
                } else {
                    query = 'INDICE_PRIORIZACION IS ' + this.indicePriorizacion;
                }

            } else {
                if (query.length > 0) {
                    query = query + ' AND INDICE_PRIORIZACION = ' + this.indicePriorizacion;
                } else {
                    query = 'INDICE_PRIORIZACION = ' + this.indicePriorizacion;
                }
            }
        }

        if (this.estadoProgramacionVisita) {
            if (query.length > 0) {
                query = query + ' AND RESPONSABLE_VISITA IS NOT NULL ';
            } else {
                query = 'RESPONSABLE_VISITA IS NOT NULL ';
            }
        }

        if (this.responsable) {
            if (query.length > 0) {
                query = query + ' AND RESPONSABLE_MANTENIMIENTO_ID = ' + this.responsable.id;
            } else {
                query = 'RESPONSABLE_MANTENIMIENTO_ID = ' + this.responsable.id;
            }
        }

        if (this.directorDeObra) {
            if (query.length > 0) {
                query = query + ' AND DIRECTOR_OBRA_ID = ' + this.directorDeObra.id;
            } else {
                query = 'DIRECTOR_OBRA_ID = ' + this.directorDeObra.id;
            }
        }

        return query;
    }


}
