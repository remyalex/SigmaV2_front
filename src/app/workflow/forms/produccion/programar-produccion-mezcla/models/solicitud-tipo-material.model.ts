import { Intervencion } from 'src/app/intervencion/models/intervencionModel.model';
import { Persona } from 'src/app/administracion/persona/models/persona.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { Usuario } from 'src/app/administracion/usuario/models/usuario.model';
import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';


export class SolicitudTipoMaterial {

    id: number;
    pk: number;
    civ: number;
    cantidad: number;
    personasContacto: string;
    fechaRetiro: string;
    horaRetiro: string;
    quienRecibe: string;
    cantidadDespachada: number;
    programado: number;
    reprogramar: number;
    capacidadDespachar: number;
    fechaReprogramacion: string;
    observaciones: string;
    intervencionEncabezado: Intervencion;
    tipoSolicitud: ListaItem;
    turno: ListaItem;
    tipoMaterial: ListaItem;
    unidad: ListaItem;
    equipo: Equipo;

}
