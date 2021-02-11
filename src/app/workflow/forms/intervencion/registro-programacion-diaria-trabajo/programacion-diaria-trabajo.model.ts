import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { IntervencionEncabezado } from 'src/app/intervencion/visitatecnicaverificacion/visita-verificacion-admin/models/intervencionEncabezado.model';
import { ProgramacionDiariaTrabajoPersonal } from './programacion-diaria-trabajo-personal.model';
import { ProgramacionDiariaTrabajoMaquinaria } from './programacion-diaria-trabajo-maquinaria.model';
import { ProgramacionDiariaTrabajoMaterial } from './programacion-diaria-trabajo-material.model';
import { ProgramacionDiariaTrabajoEquipo } from './programacion-diaria-trabajo-equipo.model';

/**
 * Representación de la entidad ProgramacionDiariaTrabajo
 */
export class ProgramacionDiariaTrabajo {
    id: number;
    activo: boolean;
    fechaCreacion: string;
    jornada: ListaItem;
    fechaProgramacion: string;
    estrategia: string;
    estado: ListaItem;
    zona: string;
    localidad: string;
    barrio: string;
    ejeVial: string;
    ejeVialDesde: string;
    ejeVialHasta: string;
    actividad: string;
    civ: number;
    pk: number;
    tipoIntervencion: string;
    residenteObra: string;
    residenteObraTelefono: string;
    directorObra: string;
    directorObraTelefono: string;
    ingenieroApoyo: string;
    ingenieroApoyoTelefono: string;
    intervencionEncabezado: IntervencionEncabezado;
    observaciones: string;
    personal: ProgramacionDiariaTrabajoPersonal[];
    material: ProgramacionDiariaTrabajoMaterial[];
    maquinaria: ProgramacionDiariaTrabajoMaquinaria[];
    equipo: ProgramacionDiariaTrabajoEquipo[];
    nombreJornada: string;
    nombreEstado: string;
}

