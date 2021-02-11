import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { Archivo } from 'src/app/workflow/models/archivo.model';
import { FormulaMateriaPrima } from '../../registrar-insumos-de-formula-mezcla/models/formula-materia-prima.model';

export class Formula {

    public id: number;
    public activo = true;
    public tipoMezcla: ListaItem;
    public especificacion: ListaItem;
    public masaUnitaria = '';
    public fechaInicial = '';
    public fechaFinal = '';
    public soporte: Archivo;
    public materiasPrimas: FormulaMateriaPrima[] = [];

    constructor() {

    }
}
