import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class FormulaMateriaPrima {

    public id: number;
    public consecutivo = 0;
    public activo = true;
    public materiaPrima: ListaItem;
    public masaUnitaria = '';
    public valor: number;
    public unidadMedida: ListaItem;

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
