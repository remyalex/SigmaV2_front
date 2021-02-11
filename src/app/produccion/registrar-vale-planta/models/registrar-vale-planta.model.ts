import { Equipo } from './../../../administracion/equipo/models/equipo.model';
import { Usuario } from './../../../administracion/usuario/models/usuario.model';
import { Persona } from 'src/app/administracion/persona/models/persona.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class RegistrarValePlanta {

  public id: number;
  public numeroVale: number;
  public jefeBascula: Usuario;
  public planta: ListaItem;
  public tipoVale: ListaItem;
  public turno: ListaItem;
  public activo: boolean;
  public valesIngreso: Array<RegistrarDetalleValePlanta>;
  public valeArchivo: Array<RegistrarArchivoValePlanta>;
  public fechaMin: string;

  constructor() {
    this.planta = new ListaItem ();
    this.planta.id = 800003;
    this.tipoVale = new ListaItem();
    this.tipoVale.id = 800002;
    this.valesIngreso = new Array<RegistrarDetalleValePlanta>();
    this.valeArchivo = new Array<RegistrarArchivoValePlanta>();
  }
}

export class RegistrarDetalleValePlanta {

  public id: number;
  public equipo: Equipo;
  public fechaRegistro: string;
  public horaEntrada: string;
  public horaSalida: string;
  public pesoBruto: number;
  public pesoTara: number;
  public pesoNeto: number;
  public proveedor: Persona;
  public recibe: Persona;
  public tipoMaterial: ListaItem;
}

export class RegistrarArchivoValePlanta {
  public id: number;
  public activo: boolean;
  public fechaRegistro: string;
  public archivo: ArchivoModel;
}

export class ArchivoModel {
  public activo: Boolean;
  public id: Number;
  public nombre: String;
  public ruta: String;
  public tamanio: Number;
  public tipo: String;
}