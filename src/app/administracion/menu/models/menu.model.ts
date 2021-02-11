import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { Permiso } from '../../permisos/models/permiso.model';

export class Menu {

    public activo: boolean = true;
    public eliminado: boolean = false;
    public hasSubMenu: boolean = false;
    public href: string = '';
    public icon: string = '';
    public id: number;
    public orden: number;
    public parent: Menu;
    public routerLink: string = '';
    public target: string = '';
    public titulo: string = '';
    public permiso: Permiso;
    public descripcion: string = '';
    constructor() {

    }
}
