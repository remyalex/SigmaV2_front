import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
export class Tipointervencion {

    public activo: boolean = true;
    public descripcion: string;
    public id: number;
    public tipoSuperficie: ListaItem;
    public referenciaIntervencion: ListaItem;
    public valor: string;

    constructor() {

    }
}
