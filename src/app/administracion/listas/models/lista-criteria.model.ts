export class ListaCriteria {

    public page: number = 0;
    public size: number = 10;
    public sortBy: string = 'nombre';
    public sortOrder: string = 'asc';
    public nombre: string = "";
    public descripcion: string = "";

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

    /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {
        return "nombre=" + this.nombre +
            "&descripcion=" + this.descripcion +
            "&page=" + (this.page) +
            "&size=" + this.size +
            "&sortBy=" + this.sortBy +
            "&sortOrder=" + this.sortOrder;
    }

} 