import { UsuarioInfo } from './usuario-info.model';
import { Predisenio } from 'src/app/mejoramiento/predisenio/models/predisenio.model';

export class SolicitudAforoModel {
  public id: number;
  public activo = true;
  public fechaRegistro: Date;
  public usuario: UsuarioInfo;
  public predisenio: Predisenio;

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}