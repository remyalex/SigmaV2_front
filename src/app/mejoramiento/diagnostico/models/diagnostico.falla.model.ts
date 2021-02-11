import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { DiagnosticoUnidadMuestraModel } from './diagnostico.unidadMuestreo.model';
import { Tipofalla } from 'src/app/administracion/tipofalla/models/tipofalla.model';
import { Tipointervencion } from 'src/app/administracion/tipointervencion/models/tipointervencion.model';

export class DiagnosticoFallaModel {

    public id: number;
    public activo = true;
    public unidadMuestreo: DiagnosticoUnidadMuestraModel;
    public tipoFalla: Tipofalla;
    public tipoSuperficie: ListaItem;
    public severidad: ListaItem;
    public longitud: number;
    public ancho: number;
    public longitudLosa: number;
    public anchoLosa: number;
    public area: number;
    public numeroLosas: number;
    public tipoIntervencion: Tipointervencion;

}
