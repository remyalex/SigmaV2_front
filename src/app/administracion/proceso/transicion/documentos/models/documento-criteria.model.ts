export class DocumentoCriteria {

  public nombre: string = ''; 
  public objeto: string = ''; 
  public tabla: string = ''; 
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'nombre';

  public sortOrder: string = 'asc';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /**
  * Método encargado de construir la sección de
  * filtros de cadena de petición que se realizará al servidor 
  */
  public getUrlParameters ():string {

      return  'nombre=' + this.nombre + 
              '&objeto=' + this.objeto + 
              '&tabla=' + this.tabla + 
              '&page=' + this.page +
              '&size=' + this.size +
              '&sortBy=' + this.sortBy +
              '&sortOrder=' + this.sortOrder;
  }

}
