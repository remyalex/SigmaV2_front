import { TransicionModel } from './transicion.model';
import { Permiso } from '../../permisos/models/permiso.model';
import { ListaItem } from '../../listas-items/models/listas-items.model';
import { Documento } from '../transicion/documentos/models/documento.model';
import { ComponenteUI } from './componenteUI.model';

export class ActividadModel {

    public activo = true;
    public descripcion: string;
    public id: number;
    public nombre = '';
    public duracion = '';
    public permiso: Permiso;
    public secciones = [];
    public componenteUI: ComponenteUI;
    public transiciones: TransicionModel;
    public url = '';
    public area: any;
    public cargo: any;
    public tipoReporte = '';
    constructor() {

    }
}