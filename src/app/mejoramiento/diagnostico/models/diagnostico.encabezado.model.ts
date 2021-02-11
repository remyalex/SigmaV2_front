import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { Tipointervencion } from 'src/app/administracion/tipointervencion/models/tipointervencion.model';

export class DiagnosticoEncabezadoModel {

    public id: number;
    public activo: boolean = true;
    public calificacionPci: number;
    public solicitante: ListaItem;
    public tipoIntervencionTotal: Tipointervencion;
}
