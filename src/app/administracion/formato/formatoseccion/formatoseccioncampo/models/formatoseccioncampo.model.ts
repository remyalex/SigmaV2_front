import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { Lista } from 'src/app/administracion/listas/models/lista.model';

export class Formatoseccioncampo {
    public seccion: String; //Sirve para el export en excel
    public activo: boolean= true;
    public descripcion: string;
    public id: number;
    public lista: Lista;
    public nombre: string;
    public orden: number;
    public tipoCampoFormato: ListaItem;

    constructor() {

    }
}
