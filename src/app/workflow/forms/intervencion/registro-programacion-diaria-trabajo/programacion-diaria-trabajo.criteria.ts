import { Persona } from 'src/app/administracion/persona/models/persona.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { ProgramacionDiariaTrabajoPersonal } from './programacion-diaria-trabajo-personal.model';
import { ProgramacionDiariaTrabajoMaquinaria } from './programacion-diaria-trabajo-maquinaria.model';
import { ProgramacionDiariaTrabajoMaterial } from './programacion-diaria-trabajo-material.model';
import { ProgramacionDiariaTrabajoEquipo } from './programacion-diaria-trabajo-equipo.model';
import { Utils } from 'src/app/shared/utils/global-functions';
import { Localidad } from 'src/app/administracion/ubicaciones/localidad/models/localidad.model';
import { Zona } from 'src/app/administracion/ubicaciones/zona/models/zona.model';
import { Barrio } from 'src/app/administracion/ubicaciones/barrio/models/barrio.model';

/**
 * Representación de los filtros de ProgramacionDiariaTrabajo
 */
export class ProgramacionDiariaTrabajoCriteria {
    criterio: ListaItem;
    jornada: ListaItem;
    fechaProgramacion: string;
    localidad: Localidad;
    zona: Zona;
    barrio: Barrio;
    actividad: ListaItem[];
    civ: number;
    pk: number;

    residenteObra: Persona[];
    directorObra: Persona[];
    ingenieroApoyo: Persona[];

    tipoIntervencion: ListaItem[];
    estrategia: ListaItem[];
    tipoMaquinaria: ListaItem[];
    origenMezcla: ListaItem[];
    tipoMaterial: ListaItem[];
    claseMaterial: ListaItem[];
    inspector: ListaItem[];

    page = 0;
    size = 10;
    sortBy = 'fechaProgramacion';
    sortOrder = 'asc';

    constructor() { }

    getUrlParameters() {
        const jornadaId = this.jornada != null && this.jornada.id != null ? this.jornada.id : '';

        let tiposIntervencion = '';
        if (this.tipoIntervencion != null && this.tipoIntervencion.length > 0) {
                this.tipoIntervencion.forEach(elemento => {
                    if (tiposIntervencion !== 'tipoIntervencion=&') {
                        if (typeof(elemento.id) !== 'undefined') {
                            tiposIntervencion += 'tipoIntervencion=' + elemento.valor + '&' ;
                        } else {
                            tiposIntervencion = 'tipoIntervencion=&';
                        }
                    }
                });
        } else {
            tiposIntervencion = 'tipoIntervencion=&';
        }

        let estrategias = '';
        if (this.estrategia != null && this.estrategia.length > 0) {
            this.estrategia.forEach(elemento => {
                if (estrategias !== 'estrategia=&') {
                    if (typeof(elemento.id) !== 'undefined') {
                        estrategias += 'estrategia=' + elemento.id + '&' ;
                    } else {
                        estrategias = 'estrategia=&';
                    }
                }
            });
        } else {
            estrategias = 'estrategia=&';
        }

        let tiposMaquinaria = '';
        if (this.tipoMaquinaria != null && this.tipoMaquinaria.length > 0) {
            this.tipoMaquinaria.forEach(elemento => {
                if (tiposMaquinaria !== 'tipoMaquinaria=&') {
                    if (typeof(elemento.id) !== 'undefined') {
                        tiposMaquinaria += 'tipoMaquinaria=' + elemento.id + '&';
                    } else {
                        tiposMaquinaria = 'tipoMaquinaria=&';
                    }
                }
            });
        } else {
            tiposMaquinaria = 'tipoMaquinaria=&';
        }

        let origenesMezcla = '';
        if (this.origenMezcla != null && this.origenMezcla.length > 0) {
            this.origenMezcla.forEach(elemento => {
                if (origenesMezcla !== 'origenMezcla=&') {
                    if (typeof(elemento.id) !== 'undefined') {
                        origenesMezcla += 'origenMezcla=' + elemento.id + '&';
                    } else {
                        origenesMezcla += 'origenMezcla=&';
                    }
                }
            });
        } else {
            origenesMezcla = 'origenMezcla=&';
        }

        let tiposMaterial = '';
        if (this.tipoMaterial != null && this.tipoMaterial.length > 0) {
            this.tipoMaterial.forEach(elemento => {
                if (tiposMaterial !== 'tipoMaterial=&') {
                    if (typeof(elemento.id) !== 'undefined') {
                        tiposMaterial += 'tipoMaterial=' + elemento.id + '&' ;
                    } else {
                        tiposMaterial = 'tipoMaterial=&';
                    }
                }
            });
        } else {
            tiposMaterial = 'tipoMaterial=&';
        }

        let clasesMaterial = '';
        if (this.claseMaterial != null && this.claseMaterial.length > 0) {
            this.claseMaterial.forEach(elemento => {
                if (clasesMaterial !== 'claseMaterial=&') {
                    if (typeof(elemento.id) !== 'undefined') {
                        clasesMaterial += 'claseMaterial=' + elemento.id + '&' ;
                    } else {
                        clasesMaterial += 'claseMaterial=&';
                    }
                }
            });
        } else {
            clasesMaterial = 'claseMaterial=&';
        }

        let inspectores = '';
        if (this.inspector != null && this.inspector.length > 0) {
            this.inspector.forEach(elemento => {
                if (inspectores !== 'inspector=&') {
                    if (typeof(elemento.id) !== 'undefined') {
                        inspectores += 'inspector=' + elemento.id + '&';
                    } else {
                        inspectores += 'inspector=&';
                    }
                }
            });
        } else {
            inspectores = 'inspector=&';
        }

        let actividades = '';
        if (this.actividad != null && this.actividad.length > 0) {
            this.actividad.forEach(elemento => {
                if (actividades !== 'actividad=&') {
                    if (typeof(elemento.id) !== 'undefined') {
                        actividades +=  'actividad=' + elemento.valor + '&';
                    } else {
                        actividades += 'actividad=&';
                    }
                }
            });
        } else {
            actividades = 'actividad=&';
        }

        let directoresObra = '';
        if (this.directorObra != null && this.directorObra.length > 0) {
            this.directorObra.forEach(elemento => {
                if (directoresObra !== 'directorObra=&') {
                    if (typeof(elemento.id) !== 'undefined') {
                        directoresObra +=  'directorObra=' + elemento.id + '&';
                    } else {
                        directoresObra += 'directorObra=&';
                    }
                }
            });
        } else {
            directoresObra = 'directorObra=&';
        }

        let residentesObra = '';
        if (this.residenteObra != null && this.residenteObra.length > 0) {
            this.residenteObra.forEach(elemento => {
                if (residentesObra !== 'residenteObra=&') {
                    if (typeof(elemento.id) !== 'undefined') {
                        residentesObra +=  'residenteObra=' + elemento.id + '&';
                    } else {
                        residentesObra += 'residenteObra=&';
                    }
                }
            });
        } else {
            residentesObra = 'residenteObra=&';
        }


        let ingenierosApoyo = '';
        if (this.ingenieroApoyo != null && this.ingenieroApoyo.length > 0) {
            this.ingenieroApoyo.forEach(elemento => {
                if (ingenierosApoyo !== 'ingenieroApoyo=&') {
                    if (typeof(elemento.id) !== 'undefined') {
                        ingenierosApoyo +=  'ingenieroApoyo=' + elemento.id + '&';
                    } else {
                        ingenierosApoyo += 'ingenieroApoyo=&';
                    }
                }
            });
        } else {
            ingenierosApoyo = 'ingenieroApoyo=&';
        }

        const zonaId = this.zona != null && this.zona.id != null ? this.zona.id : '';
        const localidadId = this.localidad != null && this.localidad.id != null ? this.localidad.id : '';
        const barrioId = this.barrio != null && this.barrio.id != null ? this.barrio.id : '';

        return 'jornada=' + jornadaId
            + '&fechaProgramacion=' + Utils.defEmpty(this.fechaProgramacion)
            + '&localidad=' + localidadId
            + '&zona=' + zonaId
            + '&barrio=' + barrioId
            + '&civ=' + Utils.defEmpty(this.civ)
            + '&pk=' + Utils.defEmpty(this.pk)

            + '&' + tiposIntervencion.substr(0, tiposIntervencion.length - 1)

            + '&' + actividades.substr(0, actividades.length - 1)
            + '&' + estrategias.substr(0, estrategias.length - 1)
            + '&' + tiposMaquinaria.substr(0, tiposMaquinaria.length - 1)
            + '&' + origenesMezcla.substr(0, origenesMezcla.length - 1)
            + '&' + tiposMaterial.substr(0, tiposMaterial.length - 1)
            + '&' + clasesMaterial.substr(0, clasesMaterial.length - 1)
            + '&' + inspectores.substr(0, inspectores.length - 1)

            + '&' + directoresObra.substr(0, directoresObra.length - 1)
            + '&' + residentesObra.substr(0, residentesObra.length - 1)
            + '&' + ingenierosApoyo.substr(0, ingenierosApoyo.length - 1)

            + '&page=' + this.page
            + '&size=' + this.size
            + '&sortBy=' + this.sortBy
            + '&sortOrder=' + this.sortOrder ;

    }
}

