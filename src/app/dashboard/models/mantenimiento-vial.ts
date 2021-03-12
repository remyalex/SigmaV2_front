import { OtroFactor } from "./otro-factor";
import { UnidadMuestreo } from "./unidad-muestreo";

export class MantenimientoVial {
  idMantenimientoVial: number;

  // Se deberia tener el nombre del origen
  idTipoOrigen: number;
  fecha: string;
  solicitudNombre: string;
  solicitudFecha: string;
  solicitudVencimiento: string;
  solicitudRadicadoEntrada: string;
  solicitudDireccion: string;
  solicitudRadicadoSalida: String;
  solicitudFechaSalida: number;

  pkIdCalzada: number;

  // SE DEBERIA TRAER NOMBRE CORRESPONDIENTE A CADA ID
  idLocalidad: number;
  idZona: number;
  idUpla: number;
  idBarrio: number;
  idCuadrante: number;
  idUpz: number;
  anchoPk: number;
  areaPk: number;
  longitudHorizontalPk: number;

  idTipoEstadoPk: number;
  idTipoUsoVia: number;
  idTipoMalla: number;

  civ: string;
  ejeVial: string;
  desde: string;
  hasta: string;
  numeroRadicadoEntrada: string;

  idTipoEstadoProgVisita: number;
  fechaVisitaTecnica: number;
  rutasTransporte: string;

  idTipoTransitabilidad: number;
  idTipoImpactoSocial: number;
  idTipoDeterminacionInterv: number;

  idTipoCoordinacionInterinst: number;
  idTipoAporteMetas: number;
  observacionesDiagnostico: string;
  pci: number;
  idTipoCalificacionPci: number;

  numeroRadicadoSalida: string;
  numeroRadicadoIntervencion: string;

  idZonaEabEsp: number;
  idTipoSeccionVial: number;
  kmCarrilImpacto: number;

  idTipoPrograma: number;
  idTipoEstrategia: number;
  idTipoActividad: number;
  indicePriorizacion: number;
  fechaRadicadoIntervencion: number;
  intervencionLongitud: number;
  intervencionAncho: number;
  intervencionArea: number;
  intervencionKmCarril: number;
  intervencionTipo: string;
  intervencionRespuestaIdu: number;
  intervencionPlacaReferencia: string;
  intervencionFechaEjecucion: number;
  idTipoRutasTransporte: number;
  idTipoSuperficie: number;

  posibleDanioRedes: string;
  idTipoEjecucion: number;
  idTipoClase: number;
  fechaTerminacion: number;
  fechaSeguimiento: number;
  fechaVisitaVerificacion: number;
  observacionesIntervencion: string;
  requiereActualizacionDiag: string;
  idTipoPmt: number;
  coi: number;
  idTipoEstadoPmt: number;
  numeroRadicadoPmt: string;
  fechaRadicadoPmt: number;
  idProgramacionPeriodica: number;
  numeroRadicadoSolReserva: string;
  numeroRadicadoResReserva: string;
  enSeguimiento: string;
  auditoriaUsuario: string;
  auditoriaFecha: number;
  tabOtroFactors: OtroFactor[];
  tabUnidadMuestreos: UnidadMuestreo[];
  idTipoIntervencionTotal: number;
  idTipoRequerimiento: number;
  idTipoAdministracion: number;
  idTipoGrupo: number;
  priorizacionTrimestre: string;
  observacionesPriorizacion: string;
  tabPersonaByIdPersonaResponsableVerif: any;


/*

	private TabPersona tabPersonaByIdPersonaResidenteObra;
	private TabPersona tabPersonaByIdPersonaResidenteSst;
	private TabPersona tabPersonaByIdPersonaResidenteAmbiental;
	private TabPersona tabPersonaByIdPersonaResidenteSocial;
	private TabPersona tabPersonaByIdPersonaDirectorObra;
	private TabPersona tabPersonaByIdPersonaResponsableVerif;
	private TabPersona tabPersonaByIdPersonaResponsableVisita;

	private Set tabProgramacions = new HashSet(0);
	private Set tabOtroFactors = new HashSet(0);
	private Set tabRadicadoVinculados = new HashSet(0);
	private Set tabUnidadMuestreos = new HashSet(0);
	private Set tabMantenimientoVialDocus = new HashSet(0);
	private Set tabMantenimientoVialGestions = new HashSet(0);




  constructor() {
    this.tabOtroFactors = new Array<OtroFactor>();
    this.tabUnidadMuestreos = new Array<UnidadMuestreo> ();
  }
*/
  constructor(pkId?: number,
      ancho?: number,
      areaPk?: number,
      longPk?: number,
      civ?: string,
      idLocalidad?: number,
      idZona?: number,
      idUpla?: number,
      idBarrio?: number,
      idCuadrante?: number,
      idTipoMalla?: number,
      idTipoSeccionVial?: number,
      idZonaEabEsp?: number,
      kmCarrilImpacto?: number,
      ejeVial?: string,
      desde?: string,
      hasta?: string,
      tipoSuperficie?: number) {
        if (pkId) {
          this.pkIdCalzada = pkId;
          this.anchoPk = ancho;
          this.areaPk = areaPk;
          this.longitudHorizontalPk = longPk;
          this.civ = civ;
          this.idLocalidad = idLocalidad;
          this.idZona = idZona;
          this.idUpla = idUpla;
          this.idBarrio = idBarrio;
          this.idCuadrante = idCuadrante;
          this.idUpz = idUpla;
          this.idTipoMalla = idTipoMalla;
          this.idTipoSeccionVial = idTipoSeccionVial;
          this.idZonaEabEsp = idZonaEabEsp;
          this.kmCarrilImpacto = kmCarrilImpacto;
          this.ejeVial = ejeVial;
          this.desde = desde;
          this.hasta = hasta;
          this.idTipoSuperficie = tipoSuperficie;
        }
        //this.tabOtroFactors = new Array<OtroFactor>();
        //this.tabUnidadMuestreos = new Array<UnidadMuestreo> ();
  }
}
