import { Persona } from '../../persona/models/persona.model';
import { ListaItem } from '../../listas-items/models/listas-items.model';

export class RecursoDisponiblidadInfo {
    public identificacion: string;
    public nombre: string;
    public numeroInterno: string;
    public fechaHasta: string;
    public fechaDesde: string;
    public intervalo: string;
    public turno: string;
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
