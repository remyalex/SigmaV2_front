export class ListaItemCriteria {
    
    public page: number = 0;
    // Pendiente Mauricio. paginacion en backend Listas
    public size: number = 10;
    public sortBy: string = 'valor';
    public sortOrder: string = 'asc';
    public listaId: number;
    public valor: string = "";
    public pageSize: any;
    public nombre: any;

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

    /**
  * Método encargado de construir la sección de
  * filtros de cadena de petición que se realizará al servidor 
  */
  public getUrlParameters ():string {
        return  "valor=" + this.valor+    
                "&listaId=" + this.listaId+
                "&page=" +(this.page)+ 
                "&size=" +this.size+
                "&sortBy=" +this.sortBy+
                "&sortOrder=" +this.sortOrder;
    }
} 