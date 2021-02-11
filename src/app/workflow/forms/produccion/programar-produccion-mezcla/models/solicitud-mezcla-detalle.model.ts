import { SolicitudMezcla } from './solicitud-mezcla.model';
import { Intervencion } from 'src/app/intervencion/models/intervencionModel.model';
import { Persona } from 'src/app/administracion/persona/models/persona.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { Usuario } from 'src/app/administracion/usuario/models/usuario.model';
import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';


export class SolicitudMezclaDetalle {

    id: number;
    solicitud: SolicitudMezcla;
    intervencion: Intervencion;
    unidad: ListaItem;
    cantidad: number;
    personasContacto: Persona[] = [];
    horaRetiro: string;
    fechaRetiro: string;
    quienRecibe: Usuario;
    cantidadDespachada: number;
    programado: boolean;
    reprogramar: boolean;
    capacidadDespachar: number;
    fechaReprogramacion: string;
    observaciones: string;
    activo = true;
    equipo: Equipo;
}
