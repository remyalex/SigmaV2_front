import { UsuarioInfo } from 'src/app/workflow/models/usuario-info.model';

export class AuditoriaCriteria {

  public accion = '';
  public objetoid = '';
  public tabla = '';
  public usuario: UsuarioInfo;
  public page = 0;
  public size = 10;
  public sortBy = 'accion';
  public sortOrder = 'asc';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /**
  * Método encargado de construir la sección de
  * filtros de cadena de petición que se realizará al servidor 
  */
  public getUrlParameters (): string {
    const usuarioId = this.usuario ? this.usuario.id : '';

      return  'accion=' + this.accion +
              '&objetoid=' + this.objetoid +
              '&tabla=' + this.tabla +
              '&usuarioId=' + usuarioId +
              '&page=' + this.page +
              '&size=' + this.size +
              '&sortBy=' + this.sortBy +
              '&sortOrder=' + this.sortOrder;
  }

}
