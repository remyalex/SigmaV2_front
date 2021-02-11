export class UbicarApiqueCriteria {
  
  public nomenclatura: string = ''; 
  public observacion: string = '';
  public page: number = 0;
  public size: number = 10;
  public sortBy: string = 'fecha';  
  public sortOrder: string = 'desc';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

}
