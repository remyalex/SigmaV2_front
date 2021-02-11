import { Usuario } from 'src/app/administracion/usuario/models/usuario.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class Eventousuario {
    public activo: boolean = true;
    public evento: String;
    public eventoValor: string;
    public fechaDesde: string;
    public fechaDesdeDate: string;
    public fechaHasta: string;
    public fechaHastaDate: string;
    public id: number;
    public usuario: Usuario;
    public valorPermitido = {
        'id': null,
        'valor': null
    };
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
