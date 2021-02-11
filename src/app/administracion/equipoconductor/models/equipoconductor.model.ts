import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';
import { EquipoConductorDia } from './equipoconductordia.model';
import { ListaItem } from '../../listas-items/models/listas-items.model';
import { Persona } from '../../persona/models/persona.model';

export class EquipoConductor {
    public id: number;
    public activo: boolean;
    public equipo: Equipo;
    public desde: string;
    public hasta: string;
    public celular: string;
    public tipoVehiculoContratado: ListaItem;
    public diasSemana: Array<ListaItem>;
    public dias: Array<EquipoConductorDia>;
    public conductor: Persona;
    // Campos auxiliares (solo lectura)
    public placa: string;
    public maxFinSemana: string;
    public minHoy: string;
    public desdeFinal: string;
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
