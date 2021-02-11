import { ListaItem } from '../../../administracion/listas-items/models/listas-items.model';
import { Lugar } from '../../../administracion/lugar/models/lugar.model';

export class PlanillaOperacionEdit {
    public id?: number;
    public activo: boolean;
    public fechaDesde: string;
    public fechaHasta: string;
    public intervalo: string;
    public persona: any;
    public tipoAsignacion: string;
    public turno: any;
    public tipoDisponibilidad: any;
    public programarData: boolean = false;
    public fecha: string;



    constructor() {}
}

export class TipoTarjeta {
    public id?: number;
    public valor?: string;
    public descripcion?: string;
    public activo?: boolean;
    public registrosDependientes?: boolean;

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}

export class PersonalPlanta {
    public id?: number;
    public pk?: number;
    public civ?: number;
    public cantidad?: number;
    public personasContacto?: string;
    public fechaRetiro?: string;
    public horaRetiro?: string;
    public quienRecibe?: string;
    public cantidadDespachada?: number;
    public programado?: boolean;
    public reprogramar?: boolean;
    public capacidadDespachar?: string;
    public fechaReprogramacion?: string;
    public observaciones?: string;
    public activo?: boolean;
    public tipoSolicitud?: any;
    public turno?: any;
    public tipoMaterial?: any;
    public unidad?: any;

    constructor() {}
}

export class Actividades {

    public nombreItem?: string;
    public descripcion?: string;
    public calificacion?: string;
    public varibleControl?: string;
    public lecturaIncial?: string;
    public lecturaFinal?: string;
    public activo?: boolean = true;
    public eliminado?: 18000000;
    public observacion?: string

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}












