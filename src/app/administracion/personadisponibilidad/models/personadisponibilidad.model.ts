import { Persona } from '../../persona/models/persona.model';
import { ListaItem } from '../../listas-items/models/listas-items.model';

export class Personadisponibilidad {
    public activo = true;
    public calendario: Array<any>;
    public fechaDesde: string;
    public fechaDesdeDate: string;
    public fechaHasta: string;
    public fechaHastaDate: string;
    public id: number;
    public intervaloDate: string;
    public intervalo: string;
    public persona: Persona;
    public turno: ListaItem;
    public nombres: string;
    public tempStrDate: string;
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
