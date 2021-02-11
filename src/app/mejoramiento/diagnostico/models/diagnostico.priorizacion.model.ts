import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class DiagnosticoPriorizacionModel {

    public activo = true;
    public id: number;
    public observaciones: string;
    public aporteCumplimiento: ListaItem;
    public coordinacionInterinstitucional: ListaItem;
    public tipoIntervencion: ListaItem;
    public impactoSocial: ListaItem;
}
