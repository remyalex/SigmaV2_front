export class TipomantenimientoCriteria {
  
  public claseMantenimientoId: any = ''; 
  public descripcion: string = ''; 
  public id: string = ''; 
  public nombre: string = ''; 
  public tipoEquipoId: any = ''; 
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'nombre';
  
  public sortOrder: string = 'asc';
  public mantenimientoId;
  public equipoId;

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /**
  * Método encargado de construir la sección de
  * filtros de cadena de petición que se realizará al servidor 
  */
  public getUrlParameters ():string {
      
    this.mantenimientoId = this.claseMantenimientoId !== '' ? this.claseMantenimientoId.id : '';
    this.equipoId = this.tipoEquipoId !== '' ? this.tipoEquipoId.id : '';

      return  'claseMantenimientoId=' +this.mantenimientoId+ 
              '&descripcion=' +this.descripcion+ 
              '&id=' +this.id+ 
              '&nombre=' +this.nombre+ 
              '&tipoEquipoId=' +this.equipoId+ 
              
              '&page=' +(this.page)+
              '&size=' +this.size+
              '&sortBy=' +this.sortBy+
              '&sortOrder=' +this.sortOrder;
  }

}
