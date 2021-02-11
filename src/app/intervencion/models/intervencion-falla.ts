import { IntervencionEncabezado } from '../visitatecnicaverificacion/visita-verificacion-admin/models/intervencionEncabezado.model';
import { ListaItem } from '../../administracion/listas-items/models/listas-items.model';
import { DiagnosticoFallaModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.falla.model';
import { Tipofalla } from 'src/app/administracion/tipofalla/models/tipofalla.model';
import { Tipointervencion } from 'src/app/administracion/tipointervencion/models/tipointervencion.model';

export class IntervencionFalla {

    public id: number;
    public numero: number;
    public distancia: number;
    public longitud: number;
    public ancho: number;
    public areaFalla: number;
    public espesor: number;
    public volumen: number;
    public activo = true;
    public tipoFalla: Tipofalla;
    public tipoSuperficie: ListaItem;
    public tipoIntervencion: Tipointervencion;
    public diagnosticoFalla: DiagnosticoFallaModel;
    public intervencionEncabezado: IntervencionEncabezado;

    constructor() {}
}
