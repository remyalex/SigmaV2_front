export class ListaItem {
    public id: number;
    public listaId: number;
    public valor: string = '';
    public descripcion: string = '';
    // Temporal: se crea para evitar conflicto con lista.
    //public itemDescripcion: string;
    public activo: boolean;
    public eliminado: boolean;
    constructor() {

    }
}
