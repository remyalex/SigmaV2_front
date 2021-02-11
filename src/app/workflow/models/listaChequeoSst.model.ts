import { ListaChequeoSstArchivo } from './ListaChequeoSstArchivo.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { Intervencion } from 'src/app/intervencion/models/intervencionModel.model';
import { Archivo } from './archivo.model';

export class ListaChequeoSst {

	public  id: number = 0;
	public  tieneCarpa: boolean = false;
	public  tieneCarpaSelect: any = {};

	public  cantidadCarpa: number;
	public  tieneBotiquin: boolean = false;
	public  tieneBotiquinSelect: any = {};

	public  cantidadBotiquin: number;
	public  tieneCamilla: boolean = false;
	public  tieneCamillaSelect: any = {};

	public  cantidadCamilla: number;
	public  tieneInmovilizadores: boolean = false;
	public  tieneInmovilizadoresSelect: any = {};

	public  cantidadInmovilizadores: number;
	public  tieneExtintor: boolean = false;
	public  tieneExtintorSelect: any = {};

	public  cantidadExtintor: number;
	public  tieneSenalizacionSst: boolean = false;
	public  tieneSenalizacionSstSelect: any = {};

	public  cantidadSenalizacionSst: number;
	public  tieneMaquinaria: boolean = false;
	public  tieneMaquinariaSelect: any = {};

	public  cantidadMaquinaria: number;
	public  cantidadUsoEpp: number;
	public  cantidadSenalizacionPmt: number;

	public  tieneAuxiliaresTrafico: boolean = false;
	public  tieneAuxiliaresTraficoSelect: any = {};

	public  cantidadAuxiliaresTrafico: number;
	public  coi: ListaItem;
	public  fechaCoi: string;
	public  usoEpp: ListaItem;
	public  senalizacionPmt: ListaItem;
    public  activo: boolean = true;
	public  intervencionEncabezado: Intervencion;
	public  listaChequeoSstArchivo: ListaChequeoSstArchivo[] = [];

	public archivo: Archivo;
}
