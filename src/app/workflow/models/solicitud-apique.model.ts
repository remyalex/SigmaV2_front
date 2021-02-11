import { UsuarioInfo } from './usuario-info.model';

export class SolicitudApiqueModel {
  public id: number;
  public activo = true;
  public fechaRegistro: Date;
  public usuario: UsuarioInfo;

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}