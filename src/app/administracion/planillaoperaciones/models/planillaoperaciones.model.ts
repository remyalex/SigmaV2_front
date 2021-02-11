import { ListaItem } from '../../listas-items/models/listas-items.model';

export class ListaItems {
    id: Number;
    valor: String;
}

export class ItemPlanillaoperaiconesModel {

    public id: Number;
    public item: ListaItems = {
        'id': null,
        'valor': null
    };
    public tipoPlanilla = {
        'id': null
    };
    public unidad: ListaItem;
    public actividad: String = '';
    public activo: Boolean = true;
    public eliminado: String;

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
