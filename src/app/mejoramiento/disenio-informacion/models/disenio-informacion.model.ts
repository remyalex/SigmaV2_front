import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class DisenioInformacion {

    public id: number;
    public activo = true;
    public tipoSuperficie: ListaItem;
    public tipoIntervencionFinal: ListaItem;
    public metodologia: ListaItem;
    public materialGranular: ListaItem;
    public espesor: number;
    public cbrInicial: number;
    public observaciones: string;

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}