export class TransicionCondicionesCriteria {

    public descripcion: string = '';
    public nombre: string = '';
    public page: number = 0;
    public size: number = 10;
    public sortBy: string = 'descripcion';
    public sortOrder: string = 'asc';

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

    /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {

        return 'descripcion=' + this.descripcion +
            '&nombre=' + this.nombre +
            '&page=' + (this.page) +
            '&size=' + this.size +
            '&sortBy=' + this.sortBy +
            '&sortOrder=' + this.sortOrder;
    }

}
