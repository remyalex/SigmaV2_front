import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';


export class Modelcalendario {
    public id: number;
    public activo: boolean;
    public inicio: string;
    public fin: string;
    public disponible: boolean;
    public tipoAsignacion: ListaItem;
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
