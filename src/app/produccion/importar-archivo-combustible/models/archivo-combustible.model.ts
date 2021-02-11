import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { Archivo } from 'src/app/workflow/models/archivo.model';
import { CargueConsumoCombustible } from './cargue-consumo-combustible.model';

export class ArchivoCombustible {
    public id: number;
    public fecha: string;
    public nombre: string;
    public procesado: number;
    public totalRegistros: number;
    public archivo: Archivo;
    public tipoCargue: ListaItem;
    public activo: boolean = true;
    public cargueConsumoCombustible: CargueConsumoCombustible[];
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}