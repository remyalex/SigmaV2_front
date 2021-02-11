import { UsuarioInfo } from 'src/app/workflow/models/usuario-info.model';
import { Tipointervencion } from 'src/app/administracion/tipointervencion/models/tipointervencion.model';
import { Zona } from 'src/app/administracion/ubicaciones/zona/models/zona.model';
import { Localidad } from 'src/app/administracion/ubicaciones/localidad/models/localidad.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class PeriodicElement {
    id: number;
    mantenimientoId: number;
    nroId: any;
    nroActa: string;
    fechaInicio: string;
    fechaFinal: string;
    fechaVisita: string;
    estadoProgramacion: ListaItem;
    radicadoIntervencion: string;
    zona: Zona;
    localidad: Localidad;
    directorObra: UsuarioInfo;
    tipoIntervencion: string;
    requiereActualizacion: boolean;
    acciones: any;
}
