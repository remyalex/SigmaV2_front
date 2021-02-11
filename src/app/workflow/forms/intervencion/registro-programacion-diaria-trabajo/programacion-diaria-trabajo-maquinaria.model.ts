import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { IntervencionEncabezado } from 'src/app/intervencion/visitatecnicaverificacion/visita-verificacion-admin/models/intervencionEncabezado.model';
import { ProgramacionDiariaTrabajo } from './programacion-diaria-trabajo.model';
import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';
import { Equipocalendario } from 'src/app/administracion/equipocalendario/models/equipocalendario.model';


/**
 * Representación de la entidad ProgramacionDiariaTrabajoMaquinaria
 */
export class ProgramacionDiariaTrabajoMaquinaria {
    id: number;
    activo: boolean;
    programacionDiariaTrabajo: ProgramacionDiariaTrabajo;
    idMaquinaria: string;
    tipoMaquinaria: ListaItem;
    hora: '';
    observacion: string;
    maquinaria: Equipo;

    equipoCalendarios: Equipocalendario[];
    equipo: Equipo; // Atributo usado unicamente en el front
    equipoAnterior: Equipo; // Atributo usado unicamente en el front
    numeroInterno: string; // Atributo usado unicamente en el front
    nombreTipoMaquinaria: string; // Atributo usado unicamente en el front

}

