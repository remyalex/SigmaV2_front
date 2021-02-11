import { ListaItem } from '../../listas-items/models/listas-items.model';
import { Formatoseccion } from '../formatoseccion/models/formatoseccion.model';

export class Formato {
  public activo: boolean = true;
  public codigo: string;
  public id: number;
  public plantilla: string;
  public tipoDocumento: ListaItem;
  public archivo: ArchivoModel;
  public secciones: Array<Formatoseccion>;

  constructor() {}
}

export class ArchivoModel {
  public activo: Boolean;
  public id: Number;
  public nombre: String;
  public ruta: String;
  public tamanio: Number;
  public tipo: String;
}