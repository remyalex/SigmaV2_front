import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class TransicionEstadoDocumentoModel {
    public id: number;
    public activo = true;
    public estadoDocumentoInicial: ListaItem;
    public estadoDocumentoFinal: ListaItem;
    public tipoDocumento: ListaItem;
    public transicionId: number;

    
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
