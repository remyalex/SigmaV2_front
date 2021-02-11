import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ArchivoModel } from 'src/app/administracion/formato/models/formato.model';
import { Persona } from 'src/app/administracion/persona/models/persona.model';

export class EncuestaSatisfaccion {
    public id: number;
    public mantenimiento: WorkflowMantenimientoModel;
    public fecha: string;
    public lugar: string;
    public frenteTrabajo: string;
    public entidadEjecucionPregunta: ListaItem;
    public entidadEjecucionRespuesta: string;
    public beneficioPregunta: ListaItem;
    public beneficios: ListaItem[] = [];
    public beneficioRespuesta: Beneficios[] = [];
    public calificacionIntervencion: ListaItem;
    public umvInforma: ListaItem;
    public umvAcompanamiento: ListaItem;
    public inconvenientePregunta: ListaItem;
    public inconvenienteRespuesta: string;
    public mejoraPregunta: ListaItem;
    public mejoraRespuesta: string;
    public satisfaccion: string;
    public mejoraNocturna: string;
    public ventajasNocturna: string;
    public satisfechoIntervencion: ListaItem;
    public felicitaciones: ListaItem;
    public pqrs: ListaItem;
    public encuestadoNombre: string;
    public encuestadoTipoId: ListaItem;
    public encuestadoId: string;
    public encuestadoDireccion: string;
    public encuestadoTelefono: string;
    public encuestadoFirma: ArchivoModel;
    public servidorFirma: ArchivoModel;
    public servidor: Persona;
    public adjunto: ArchivoModel;
    public activo: boolean = true;
    public check: boolean = false;
    constructor() {
    }
}

export class Beneficios {
    public id: number;
    public activo: boolean = true;
    public fechaRegistro: string;
    public item: ListaItem = new ListaItem();
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}