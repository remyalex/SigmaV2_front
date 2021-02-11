import { RadicadoVinculadoModel } from './../../gestion-social/gestionar-radicados-pqrsfd/models/radicado-vinculado.model';
import { ListaChequeoAmbiental } from './listaChequeoAmbiental.model';
import { SolicitudSmvlGasa } from './solicitud-smvl-gasa';
import { ArchivoModel } from 'src/app/administracion/formato/models/formato.model';
import { VisitaPredisenoModel } from 'src/app/workflow/models/visita.prediseno.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { UsuarioInfo } from './usuario-info.model';
import { DiagnosticoModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.model';
import { WorkflowActividadModel } from './workflow-actividad.model';
import { Disenio } from 'src/app/mejoramiento/disenio/models/disenio.model';
import { Predisenio } from 'src/app/mejoramiento/predisenio/models/predisenio.model';
import { Persona } from 'src/app/administracion/persona/models/persona.model';
import { VisitaModel } from './visita.model';
import { SolicitudPMT } from '../forms/intervencion/solicitud-pmt/models/solicitud-pmt.model';
import {formatDate} from '@angular/common';
import { Intervencion } from 'src/app/intervencion/models/intervencionModel.model';
import { SocialCalendarioPersona} from './SocialCalendarioPersona.model';
import { PeriodicidadModel } from 'src/app/intervencion/models/periodicidad.model';
import { Acta } from 'src/app/gestion-social/actas-vecindad/models/actas-vecindad.model';
import { BanosPortatilesModel } from 'src/app/gestion-ambiental/models/banos.portatiles.model';
import { ElementoInspeccionModel } from '../../gestion-ambiental/registrar-inspeccion-ambiental/models/elemento-inspeccion.model';
import { EncuestaSatisfaccion } from 'src/app/gestion-social/encuesta-satisfaccion/models/encuesta-satisfaccion.model';
import { CierreAmbientalModel } from 'src/app/gestion-ambiental/models/cierre.ambiental.model';
import { ElementoAmbientalModel } from '../forms/ambiental/realizar-inventario-elementos-ambientales/models/elemento-ambiental.model';
import { MantenimientoDocumentoModel } from './mantenimientoDocumento.model';
import { Barrio } from 'src/app/administracion/ubicaciones/barrio/models/barrio.model';
import { Localidad } from 'src/app/administracion/ubicaciones/localidad/models/localidad.model';
import { Zona } from 'src/app/administracion/ubicaciones/zona/models/zona.model';
import { Upla } from 'src/app/administracion/ubicaciones/upla/models/upla.model';
import { Upz } from 'src/app/administracion/ubicaciones/upz/models/upz.model';
import { Cuadrante } from 'src/app/administracion/ubicaciones/cuadrante/models/cuadrante.model';
import { SolicitudLaboratorio } from './solicitud-laboratorio.model';
import { Archivo } from './archivo.model';
import { ArchivoMantenimientoModel } from './archivoMantenimiento';
import { VisitaVerificacionMantenimientoModel } from './visita.verificacionMantenimiento';

export class WorkflowMantenimientoModel {
    posicion: number;
    id: number;
    activo: Boolean = true;
    barrio: Barrio;
    cuadrante: Cuadrante;
    localidad: Localidad;
    directorObra: UsuarioInfo;
    residenteAmbiental: UsuarioInfo;
    residenteObra: UsuarioInfo;
    residenteSocial: UsuarioInfo;
    residenteSst: UsuarioInfo;
    responsable: UsuarioInfo;
    programacionPeriodica: ListaItem;
    tipoActividad: ListaItem;
    tipoAdministracion: ListaItem;
    tipoCalificacionPci: ListaItem;
    aporteMetas: ListaItem;
    clase: ListaItem;
    coordinacionInstitucional: ListaItem;
    tipoDeterminacionIntervencion: ListaItem;
    tipoEjecucion: ListaItem;
    estadoPk: ListaItem;
    estadoObra: ListaItem;
    estadoProgramacionPk: ListaItem;
    estadoPmt: ListaItem;
    estrategia: ListaItem;
    grupo: ListaItem;
    impactoSocial: ListaItem;
    tipoMalla: ListaItem;
    origen: ListaItem;
    tipoPmt: ListaItem;
    tipoRequerimiento: ListaItem;
    tipoRutasTransporte: ListaItem;
    tipoSeccionVial: ListaItem;
    tipoSuperficie: ListaItem;
    transitabilidad: ListaItem;
    tipoUsoVia: ListaItem;
    tipoVia: ListaItem;
    upz: Upz;
    upla: Upla;
    zona: Zona;
    programa: ListaItem;
    tipoElemento: ListaItem;
    sector: ListaItem;
    estadoMantenimiento: ListaItem;
    tipoMantenimiento: ListaItem;
    objectid: number;
    pk: number;
    ancho: number;
    area: number;
    longitud: number;
    ejeVial: string;
    desde: string;
    hasta: string;
    coi: number;
    enSeguimiento: Boolean;
    fechaCreacion: string;
    fechaVencimiento: string;
    fechaAsignacion: string;
    fechaSolicitudProgramacion: string;
    fechaRadicadoIntervencion: string;
    fechaRadicadoPmt: string;
    fechaSeguimiento: string;
    fechaTerminacion: string;
    fechaVisitaTecnica = formatDate(new Date(), 'dd-MM-yyyy', 'en');
    fechaVisitaVerificacion: string;
    fechaUltimaVisitaTecnica: string;
    fechaInicioVisita: string;
    fechaInicioIntervencion: string;
    fechaFinVisita: string;
    indicePriorizacion: number;
    kmCarrilImpacto: number;
    kmCarrilLineal: number;
    kmCarrilObra: number;
    radicadoIntervencion: string;
    radicadoPmt: string;
    radicadoRespuestaReserva: string;
    radicadoSolicitudReserva: string;
    fechaRegistroIdu: string;
    rutasTransporte: Boolean;
    pci: number;
    posibleDanioRedes: Boolean;
    baniosPortatiles: Boolean;
    chequeoAmbiental: Boolean;
    inventarioAmbiental: Boolean;
    priorizacionTrimeste: string;
    solicitudDireccion: string;
    solicitudFecha: string;
    solicitudFechaVinculacion: string;
    solicitudFechaSalida: string;
    solicitudRemitente: string;
    solicitudAsunto: string;
    solicitudDependenciaAsignada: string;
    solicitudRadicadoEntrada: string;
    solicitudRadicadoSalida: string;
    solicitudVencimiento: string;
    actividad: string;
    actividadAgrupada: string;
    descripcionActividadAgrupada: string;
    intervencionUmv: number;
    diagnostico: DiagnosticoModel;
    actividadActual: WorkflowActividadModel;
    observaciones: string;
    civ: number;
    civw: number;
    posicionesBox: string;
    documentos: Array<MantenimientoDocumentoModel>;
    disenio: Disenio;
    tipoRadicadoRespuestaReserva: ListaItem;
    predisenio: Predisenio;
    resultadosSolicitudesApiques: Array<ArchivoMantenimientoModel> = new Array<ArchivoMantenimientoModel> ();
    resultadosSolicitudesAforos: Array<ArchivoMantenimientoModel> = new Array<ArchivoMantenimientoModel> ();
    visitasPrediseno: Array<VisitaPredisenoModel> = new Array<VisitaPredisenoModel>();
    visitaVerificacionMantenimientos: Array<VisitaVerificacionMantenimientoModel> = new Array<VisitaVerificacionMantenimientoModel>();
    ingenieroDisenio: Persona;
    fechaAsignacionIngenieroDisenio: string;
    visitas: Array<VisitaModel> = new Array<VisitaModel>();
    ultimaObservacionMantenimientoActividad: string;
    solicitudesSmvlGasa: SolicitudSmvlGasa[];
    solicitudesPmt: Array<SolicitudPMT> = new Array<SolicitudPMT>();
    inspeccionesAmbiental: Array<ElementoInspeccionModel> = new Array<ElementoInspeccionModel>();
    elementoAmbiental: Array<ElementoAmbientalModel> = new Array<ElementoAmbientalModel>();
    radicadoVinculado: Array<RadicadoVinculadoModel> = new Array<RadicadoVinculadoModel>();
    intervenciones: Intervencion[];
    asignacionSocial: SocialCalendarioPersona[];
    vigencia: ListaItem = new ListaItem();
    periodicidad: PeriodicidadModel = new PeriodicidadModel();
    periodo: PeriodicidadModel = new PeriodicidadModel();
    duracionPlaneada: number;
    numeroDiasLaborales: number;
    tieneSolicitudEnsayo: Boolean;
    actasVecindad: Array<Acta> = new Array<Acta>();
    encuestaSatisfaccion: Array<EncuestaSatisfaccion> = new Array<EncuestaSatisfaccion>();
    archivo: ArchivoModel;
    actividadMantenimientos: any = [];
    banioPortatiles: BanosPortatilesModel[] = [];
    cierresAmbientales: Array<CierreAmbientalModel> = new Array<CierreAmbientalModel>();
    tieneSolicitudLaboratorio: Boolean;
    solicitudesLaboratorio: SolicitudLaboratorio[];
    controlesCalidadAMezclaProducidaEnPlanta: Archivo[];
    estadoRadicado: string;
    intervencionId: number;
    grupoObservaciones: string;
    grupoEstadoRegistro: ListaItem;
    grupoActivo: Boolean;
    nombreZona: string;
    nombreLocalidad: string;
    nombreUpla: string;
    nombreCuadrante: string;
    nombreBarrio: string;
    nombreResidenteAmbiental: string;
    esParaSeguimiento: Boolean;
}
