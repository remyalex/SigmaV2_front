import { ListaItem } from '../../../administracion/listas-items/models/listas-items.model';
import { Archivo } from 'src/app/workflow/models/archivo.model';

export class Documento {
    public id: number;
    public activo = true;
    public autor: string;
    public archivo: Archivo;
    public descripcion: string;
    public fecha: string;
    public estadoDocumento: ListaItem;
    public nombre: string;
    public version: number;
    public tipoDocumento: ListaItem;
    public mantenimientoId: number;

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}