import { Zona } from 'src/app/administracion/ubicaciones/zona/models/zona.model';
import { Localidad } from 'src/app/administracion/ubicaciones/localidad/models/localidad.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class ChartCriteria {
    anioVigencia: ListaItem;
    zonas: Zona[] = [];
    localidades: Localidad[] = [];
    estrategias: ListaItem[] = [];
    tipoMateriales: ListaItem[] = [];
    jornadas: ListaItem[] = [];

    public getMapQuery(): string {

        let query = '';

        // if (this.pk) {
        //     query = 'PK_ID_CALZADA = ' + this.pk;
        // }

        // if (this.civ) {
        //     if (query.length > 0) {
        //         query = query + ' AND CIV = ' + this.civ;
        //     } else {
        //         query = 'CIV = ' + this.civ;
        //     }
        // }

        if (this.localidades && this.localidades.length > 0) {
            if (query.length > 0) {
                query = query + ' AND ID_LOCALIDAD IN (' + this.getIds(this.localidades) + ')';
            } else {
                query = 'ID_LOCALIDAD IN (' + this.getIds(this.localidades) + ')';
            }
        }

        // if (this.cuadrante) {
        //     if (query.length > 0) {
        //         query = query + ' AND ID_CUADRANTE = ' + this.cuadrante.id;
        //     } else {
        //         query = 'ID_CUADRANTE = ' + this.cuadrante.id;
        //     }
        // }

        // if (this.barrio) {
        //     if (query.length > 0) {
        //         query = query + ' AND ID_BARRIO = ' + this.barrio.id;
        //     } else {
        //         query = 'ID_BARRIO = ' + this.barrio.id;
        //     }
        // }

        if (this.zonas && this.zonas.length > 0 ) {
            if (query.length > 0) {
                query = query + ' AND ID_ZONA IN (' + this.getIds(this.zonas) + ')';
            } else {
                query = 'ID_ZONA IN (' + this.getIds(this.zonas) + ')';
            }
        }

        // if (this.upla) {
        //     if (query.length > 0) {
        //         query = query + ' AND ID_UPLA = ' + this.upla.id;
        //     } else {
        //         query = 'ID_UPLA = ' + this.upla.id;
        //     }
        // }

        // if (this.estadoMantenimiento) {
        //     if (query.length > 0) {
        //         query = query + ' AND ESTADO_MANTENIMIENTO_ID = ' + this.estadoMantenimiento.id;
        //     } else {
        //         query = 'ESTADO_MANTENIMIENTO_ID = ' + this.estadoMantenimiento.id;
        //     }
        // }

        // if (this.tipoSeccionVial) {
        //     if (query.length > 0) {
        //         query = query + ' AND ID_TIPO_SECCION_VIAL = ' + this.tipoSeccionVial.id;
        //     } else {
        //         query = 'ID_TIPO_SECCION_VIAL = ' + this.tipoSeccionVial.id;
        //     }
        // }

        // if (this.estadoInspeccionIntervencion) {
        //     if (query.length > 0) {
        //         query = query + ' AND ID_ESTADO_INSPECCION_INTERVENCION = ' + this.estadoInspeccionIntervencion.id;
        //     } else {
        //         query = 'ID_ESTADO_INSPECCION_INTERVENCION = ' + this.estadoInspeccionIntervencion.id;
        //     }
        // }

        // if (this.tipoMalla) {
        //     if (query.length > 0) {
        //         query = query + ' AND ID_TIPO_MALLA = ' + this.tipoMalla.id;
        //     } else {
        //         query = 'ID_TIPO_MALLA = ' + this.tipoMalla.id;
        //     }
        // }

        // if (this.actividadActualId) {
        //     if (this.actividadActualId.includes('NULL')) {
        //         if (query.length > 0) {
        //             query = query + ' AND ACTIVIDAD_MANTENIMIENTO_ID IS ' + this.actividadActualId;
        //         } else {
        //             query = 'ACTIVIDAD_MANTENIMIENTO_ID IS ' + this.actividadActualId;
        //         }

        //     } else {
        //         if (query.length > 0) {
        //             query = query + ' AND ACTIVIDAD_MANTENIMIENTO_ID = ' + this.actividadActualId;
        //         } else {
        //             query = 'ACTIVIDAD_MANTENIMIENTO_ID = ' + this.actividadActualId;
        //         }
        //     }
        // }

        // if (this.origen) {
        //     if (query.length > 0) {
        //         query = query + ' AND VALOR_ORIGEN = \'' + this.origen.valor + '\'';
        //     } else {
        //         query = 'VALOR_ORIGEN = \'' + this.origen.valor + '\'';
        //     }
        // }

        // if (this.solicitudRadicadoEntrada) {
        //     if (this.solicitudRadicadoEntrada.includes('NULL')) {
        //         if (query.length > 0) {
        //             query = query + ' AND NUMERO_RADICADO_ENTRADA IS ' + this.solicitudRadicadoEntrada;
        //         } else {
        //             query = 'NUMERO_RADICADO_ENTRADA IS ' + this.solicitudRadicadoEntrada;
        //         }
        //     } else {
        //         if (query.length > 0) {
        //             query = query + ' AND NUMERO_RADICADO_ENTRADA = ' + this.solicitudRadicadoEntrada;
        //         } else {
        //             query = 'NUMERO_RADICADO_ENTRADA = ' + this.solicitudRadicadoEntrada;
        //         }
        //     }
        // }
        // if (this.indicePriorizacion) {
        //     if (this.indicePriorizacion.includes('NULL')) {
        //         if (query.length > 0) {
        //             query = query + ' AND INDICE_PRIORIZACION IS ' + this.indicePriorizacion;
        //         } else {
        //             query = 'INDICE_PRIORIZACION IS ' + this.indicePriorizacion;
        //         }

        //     } else {
        //         if (query.length > 0) {
        //             query = query + ' AND INDICE_PRIORIZACION = ' + this.indicePriorizacion;
        //         } else {
        //             query = 'INDICE_PRIORIZACION = ' + this.indicePriorizacion;
        //         }
        //     }
        // }

        // if (this.estadoProgramacionVisita) {
        //     if (query.length > 0) {
        //         query = query + ' AND RESPONSABLE_VISITA IS NOT NULL ';
        //     } else {
        //         query = 'RESPONSABLE_VISITA IS NOT NULL ';
        //     }
        // }

        // if (this.responsable) {
        //     if (query.length > 0) {
        //         query = query + ' AND RESPONSABLE_MANTENIMIENTO_ID = ' + this.responsable.id;
        //     } else {
        //         query = 'RESPONSABLE_MANTENIMIENTO_ID = ' + this.responsable.id;
        //     }
        // }

        return query;
    }

    getIds(objects: any[]): string {
        let idsString = '';
        for (let i = 0; i < objects.length; i++) {
            if (i < objects.length - 1) {
                idsString += objects[i].id + ', ';
            } else {
                idsString += objects[i].id;
            }
        }
        return idsString;
    }
}
