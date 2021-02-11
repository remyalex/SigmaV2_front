import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class EquipoMantenimiento {
    public id: number;
    public activo: boolean;
    public fecha: Date;
    public fechaInicio: Date;
    public fechaFin: Date;
    public fechaCancelacion: Date;
    public motivoCancelacion: string;
    public equipo: Equipo;
    public tipoMantenimiento: ListaItem;
    public estadoMantenimiento: ListaItem;

    constructor() {

    }
}
