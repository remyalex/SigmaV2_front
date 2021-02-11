import { ListCheqAmbiArchivo } from './ListCheqAmbiArchivo.model';
import { Intervencion } from 'src/app/intervencion/models/intervencionModel.model';
import { Archivo } from './archivo';

export class ListaChequeoAmbiental {
	public id: number = 0;

	public tieneBanos: boolean = false;
	public cantidadBanos: number;
	public tieneBanosSelect: any = {};

	public tieneProteccionSumideros: boolean = false;
	public cantidadProteccionSumideros: number;
	public tieneProteccionSumiderosSelect: any = {};

	public tieneProteccionArboles: boolean = false;
	public cantidadProteccionArboles: number;
	public tieneProteccionArbolesSelect: any = {};

	public tieneCerramiento: boolean = false;
	public cantidadCerramiento: number;
	public tieneCerramientoSelect: any = {};

	public tieneSenderos: boolean = false;
	public cantidadSenderos: number;
	public tieneSenderosSelect: any = {};

	public tieneEspacioPublico: boolean = false;
	public cantidadEspacioPublico: number;
	public tieneEspacioPublicoSelect: any = {};

	public activo: boolean = true;
	public intervencionEncabezado: Intervencion;
	public listaCheqAmbiArchivo: ListCheqAmbiArchivo[] = [];

	public archivo: Archivo;

}
