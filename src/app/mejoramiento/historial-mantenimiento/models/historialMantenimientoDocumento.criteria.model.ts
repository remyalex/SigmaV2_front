import { Lista } from 'src/app/administracion/listas/models/lista.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class HistorialMantenimientoDocumentoCriteria {

    public id: number;
    public fecha: string = '';
    public nombre: string = '';
    public page = 0;
    public size = 5;
    public sortBy = 'id';
    public sortOrder = 'asc';

    constructor() {
    }

    /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {
        const id = this.id ? this.id : '';
        const fecha = this.fecha !== '' ? this.fecha : '';
        const nombre = this.nombre ? this.nombre : '';

        return 'id=' + id +
        '&fecha=' + fecha +
        '&nombre=' + nombre +
        '&page=' + this.page +
            '&size=' + this.size +
            '&sortBy=' + this.sortBy +
            '&sortOrder=' + this.sortOrder;
    }

    public getUrlQuery(): string {
        return 'id=' + this.id +
            '&nombre=' + this.nombre +
            '&pageNumber=' + this.page +
            '&pageSize=' + this.size +
            '&sortBy=' + this.sortBy +
            '&sortOrder=' + this.sortOrder;
    }
}





