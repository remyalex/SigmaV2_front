import { UsuarioInfo } from 'src/app/workflow/models/usuario-info.model';
export class ResumenDirectorObraCriteria {

  public directorObra: UsuarioInfo;
  public page = 0;
  public size = 10;
  public sortBy = 'directorObraNombre';
  public sortOrder = 'asc';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

    const directorObraId = this.directorObra ? this.directorObra.id : '';

    return 'directorObra=' + directorObraId +
      '&page=' + (this.page) +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }

}
