import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';
import { EquipoConductorDia } from './equipoconductordia.model';
import { ListaItem } from '../../listas-items/models/listas-items.model';
import { Persona } from '../../persona/models/persona.model';

export class EquipoConductorCargue {
    public id: number;
    public activo: boolean;
    public movil: string;
    public desde: string;
    public hasta: string;
    public lunes: number;
    public martes: number;
    public miercoles: number;
    public jueves: number;
    public viernes: number;
    public sabado: number;
    public domingo: number;
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
