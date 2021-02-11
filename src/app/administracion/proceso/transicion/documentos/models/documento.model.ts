import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class Documento {
    public id: number;
    public activo = true;
    public archivo = {
        'id': null
    };
    public descripcion: string;
    public estadoDocumentoInicial: ListaItem;
    public estadoDocumentoFinal: ListaItem;
    public nombre: string;
    public tipoDocumento: ListaItem;
    public mantenimientoId: number;

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
