import { ListaItem } from '../../../../administracion/listas-items/models/listas-items.model';
import { UsuarioInfo } from '../../../../workflow/models/usuario-info.model';

export class IntervencionEncabezado {

    public id: number;

    public nroActa: String;

    public observaciones: String;

    public fechaVisita: String;

    public activo: Boolean;

    public tipoEjecucion: ListaItem;

    public rutaTransporte: ListaItem ;

    public usuario: UsuarioInfo ;

    public tipoSuperficie: ListaItem ;

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
