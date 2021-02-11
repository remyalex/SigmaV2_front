import { Persona } from 'src/app/administracion/persona/models/persona.model';
import { Usuario } from './../../../administracion/usuario/models/usuario.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class RegistrarValePlantaCriteria {
  public numeroVale: number;
  public horaEntrada: string;
  public horaSalida: string;
  public turno: ListaItem;
  public producto: ListaItem;
  public proveedor: Persona;
  public jefeBascula: Usuario;

  public placa: string;
  public pesoBruto: number;
  public pesoTara: number;
  public pesoNeto: number;
  public recibe: Persona;
  public Fecha: string;

  public sortOrder = 'asc';
  public size = 10;
  public page = 1;
  public sortBy = 'numeroVale';

  constructor() {}

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    return (
      'numeroVale=' + ( this.numeroVale ? this.numeroVale : '' ) +
      '&horaEntrada=' + ( this.horaEntrada ? this.horaEntrada : '' ) +
      '&horaSalida=' +  ( this.horaSalida ? this.horaSalida : '' ) +
      '&producto=' + ( this.producto != null ? this.producto.id : '' ) +
      '&turno=' + ( this.turno  != null ? this.turno.id : '' ) +
      '&proveedor=' + ( this.proveedor  != null ? this.proveedor.id : '' ) +
      '&jefeBascula=' + ( this.jefeBascula  != null ? this.jefeBascula.id : '' ) +

      '&placa=' +  ( this.placa ? this.placa : '' ) +
      '&pesoBruto=' +  ( this.pesoBruto ? this.pesoBruto : '' ) +
      '&pesoTara=' +  ( this.pesoTara ? this.pesoTara : '' ) +
      '&pesoNeto=' +  ( this.pesoNeto ? this.pesoNeto : '' ) +
      '&recibe=' +  ( this.recibe ? this.recibe.id : '' ) +
      '&Fecha=' +  ( this.Fecha ? this.Fecha : '' ) +

      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder
    );
  }
}
