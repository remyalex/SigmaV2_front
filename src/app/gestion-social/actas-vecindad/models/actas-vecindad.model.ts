import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ArchivoModel } from 'src/app/administracion/formato/models/formato.model';

export class Acta {
    public id: number;
    public numeralAscendente: number;
    public mantenimiento: WorkflowMantenimientoModel;
    public noActaVecindad: string;
    public volanteEntregado: ListaItem;
    public tipoIntervencion: ListaItem;
    public otroTipoIntervencion: string;
    public fecha: string;
    public propietario: string;
    public telefono: string;
    public movil: string;
    public direccion: string;
    public noPisosPredio: number;
    public estratoPredio: ListaItem;
    public usos: ListaItem[] = [];
    public servicios: ListaItem[] = [];
    public serviciosPublicos: Uso_Servicio[] = [];
    public usoActual: Uso_Servicio[] = [];
    public personasConDiscapacidad: ListaItem;
    public tieneGaraje: ListaItem;
    public fachadaEstructurada: ListaItem;
    public fachadaParedes: ListaItem;
    public fachadaVentanaPuertas: ListaItem;
    public fachadaCerramiento: ListaItem;
    public publicoConfinamiento: ListaItem;
    public publicoRecubrimiento: ListaItem;
    public publicoRampaAcceso: ListaItem;

    public descripcionAfectacionfachadaEstructurada: string = null;
    public descripcionAfectacionfachadaParedes: string = null;
    public descripcionAfectacionfachadaVentanaPuertas: string = null;
    public descripcionAfectacionfachadaCerramiento: string = null;
    public descripcionAfectacionpublicoConfinamiento: string = null;
    public descripcionAfectacionpublicoRecubrimiento: string = null;
    public descripcionAfectacionpublicoRampaAcceso: string = null;

    public socialNombre: string;
    public socialIdentificacion: string;
    public socialFirma: ArchivoModel;
    public habitanteNombre: string;
    public habitantelIdentificacion: string;
    public habitantelFirma: ArchivoModel;
    public tecnicoNombre: string;
    public tecnicoIdentificacion: string;
    public tecnicoFirma: ArchivoModel;
    public interventoriaNombre: string;
    public interventoriaIdentificacion: string;
    public interventoriaFirma: ArchivoModel;
    public descripcionPredio: string;
    public registroNomenclatura: ActaArchivos[] = [];
    public registroFachada: ActaArchivos[] = [];
    public registroFotografico: ActaArchivos[] = [];
    public aprobado: boolean = false;
    public fechaAprobacion: string;
    public consecutivoAprobacion: string;
    public adjunto: ArchivoModel;
    public activo: boolean = true;
    constructor() {

    }
}

export class ActaArchivos {
    public id: number;
    public activo: boolean = true;
    public archivo: ArchivoModel = new ArchivoModel();
    public fechaRegistro: string;
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}

export class Uso_Servicio{
    public  id: number;
	public  activo: boolean = true;
	public  fechaRegistro: string;
	public  item: ListaItem = new ListaItem();
    constructor(){}
}