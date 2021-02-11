import { ListaItem } from '../../listas-items/models/listas-items.model';

export class Lista {
    public id: number;
    public nombre: string;
    public descripcion: string;
    public activo: boolean = true;
    public eliminado: boolean;
    public deSistema: boolean = false;
    public items: ListaItem[];
    /** Método encargado de crear uns instancia vacía del componente */
    constructor() { 
    }
} 
