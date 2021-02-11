import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';

export interface MantenimientoProgramado {
    id?: number;
    cancelado?: boolean;
    activo?: boolean;
    eliminado?: Date;
    fechaCancelacion?: Date;
    fechaFin?: Date;
    fechaInicio?: Date;
    motivoCancelacion?: string;
    equipo?: Equipo;
    estado?: string;
}
