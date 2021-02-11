import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class DisenioInformacionComplementaria {

    public id: number;
    public activo = true;
    public geosinteticos: ListaItem;
    public sistemaDrenaje: ListaItem;

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}