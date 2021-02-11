export class UplaCriteria {

    public id: number;
    public nombre: string;
    public page = 0;
    public size = 10;
    public sortBy = 'nombre';
    public sortOrder = 'asc';

    constructor() {}

    public getUrlPatterns(): string {
        const id = this.id ? this.id : '';
        const nombre = this.nombre ? this.nombre : '';
        return 'id=' + id +
        '&nombre=' + nombre +
        '&page='  + this.page +
        '&size=' + this.size +
        '&sortBy=' + this.sortBy +
        '&sortOrder=' + this.sortOrder;
    }

}
