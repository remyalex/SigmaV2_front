import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
export class Tipofalla {

    public activo: boolean = true;
    public descripcion: string;
    public id: number;
    public tipoSuperficie: ListaItem;
    public valor: number;

    constructor() {

    }
}
