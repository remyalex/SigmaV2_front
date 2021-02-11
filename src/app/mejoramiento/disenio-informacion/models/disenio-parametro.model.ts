import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class DisenioParametro {

    public id: number;
    public activo = true;
    public clasificacionSubrasante: ListaItem;
    public cbrDisenio: number;
    public ks: number;
    public nee: number;
    public tpdvc: number;
    public numeroEstructuralEfectivo: number;

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}