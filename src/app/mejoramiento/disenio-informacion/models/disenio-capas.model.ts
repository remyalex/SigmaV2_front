import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class DisenioCapas {

    public id: number;
    public activo = true;
    public tipo: ListaItem;
    public espesor: number;
    
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}