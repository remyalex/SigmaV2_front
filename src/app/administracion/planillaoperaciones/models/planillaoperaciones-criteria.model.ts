export class ItemPlanillaoperacionesCriteria {

    public tipoPlanilla = '';
    public actividad = '';
    public item = '';
    public unidad = '';
    public unidadId = '';
    public page = 0;
    public size = 10;
    public sortBy = 'actividad';
    public sortOrder = 'asc';
  
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

    /**
  * Método encargado de construir la sección de
  * filtros de cadena de petición que se realizará al servidor 
  */
  public getUrlParameters (): string {
      const item = this.item ? this.item : '';
        return  '&tipoPlanillaId=' + this.tipoPlanilla +
                '&actividad=' + this.actividad +
                '&itemId=' + item +
                '&unidadId=' + this.unidadId +
                '&page=' + this.page +
                '&size=' + this.size +
                '&sortBy=' + this.sortBy +
                '&sortOrder=' + this.sortOrder;
    }
  }