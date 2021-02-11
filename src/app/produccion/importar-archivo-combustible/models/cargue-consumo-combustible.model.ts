import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { ArchivoCombustible } from './archivo-combustible.model';
import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';

export class CargueConsumoCombustible {
    public id: number;

	public numTiquete: string;
	public numeroChip: string;
	public numeroPlaca: string;
	public numeroInterno: string;
	public fechaSuministro: string;
	public lisTipoCombustible: ListaItem;
	public tipoCombustible: string;
	public cantidad: number;
	public horasTanqueo: number;
	public kmsTanqueo: number;
	public valorCombustible: number;
	public tipoInconsistencia: string;
	public procesado: boolean = true;
	public archivoCombustible: ArchivoCombustible;
	public equipoId: number;
	public equipo: Equipo;
	public camposInconsistencia: string;
    
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}