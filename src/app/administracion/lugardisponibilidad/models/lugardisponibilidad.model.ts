import { Lugar } from '../../lugar/models/lugar.model';
import { Lista } from '../../listas/models/lista.model';

export class Lugardisponibilidad {

    public activo: boolean = true;
    public fechaDesde: string;
    public fechaHasta: string;
    public id: number;
    public intervalo: string;
    public lugar: Lugar;
    public lugarcalendario: Array<any>;
    public turno: Lista;
    public nombre: string;

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
