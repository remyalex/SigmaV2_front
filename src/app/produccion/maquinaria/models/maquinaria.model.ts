import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export interface Maquinaria {
  id?: number;
  linea?: number;
  anio?: number;
  placaInventario?: string;
  numeroContrato?: string;
  contratista?: string;
  tipo?: ListaItem;
  clase?: ListaItem;
  marca?: ListaItem;
  lugar?: ListaItem;
}