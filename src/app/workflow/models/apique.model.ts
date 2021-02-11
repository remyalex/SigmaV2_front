import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { VisitaPredisenoModel } from './visita.prediseno.model';

export class Archivo {
    public id: number;
	public nomenclatura: string;
	public observacion: string;
	public fecha: string;
	public cantidadApiques: number;
	public aforos: boolean;
	public prioritarios: number;
	public solicitudId: ListaItem;
	public actividadId: ListaItem;
	public activo: boolean = true;
    public visitaPrediseno: VisitaPredisenoModel;	
}