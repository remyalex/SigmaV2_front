import { RegistrarGestionSocialAdelantadaComponent } from './../forms/social/registrar-gestion-social-adelantada/registrar-gestion-social-adelantada.component';
import { GestionarRadicadosPqrsfdComponent } from './../../gestion-social/gestionar-radicados-pqrsfd/gestionar-radicados-pqrsfd/gestionar-radicados-pqrsfd.component';
// tslint:disable-next-line: max-line-length
import { GestionarSolicitudesSmvlActualizacionRemisionOtrasComponent } from './../forms/intervencion/gestionar-solicitudes-smvl-actualizacion-remision-otras/gestionar-solicitudes-smvl-actualizacion-remision-otras.component';
import { AsignarResidenteSocialComponent } from './../forms/social/asignar-residente-social/asignar-residente-social.component';
import { SolicitarApiqueAforoComponent } from './../forms/diagnostico/solicitar-apique-aforo/solicitar-apique-aforo.component';
import { RegistrarResultadoApiqueComponent } from './../forms/diagnostico/registrar-resultado-apique/registrar-resultado-apique.component';
// tslint:disable-next-line: max-line-length
import { ConsolidadoVisitaTecnicaComponent } from '../forms/diagnostico/consolidado-visita-tecnica/consolidado-visita-tecnica.component';
import { Injectable } from '@angular/core';
import { WorkflowFormulario } from '../models/workflow.formulario.model';

import { WorkflowMantenimientoActividadModel } from '../models/workflow-mantenimiento-actividad.model';
// tslint:disable-next-line: max-line-length
import { Observable, BehaviorSubject } from 'rxjs';
// tslint:disable-next-line: max-line-length
import { ProgramarVisitaDiagnosticoComponent } from '../forms/diagnostico/programar-visita-diagnostico/programar-visita-diagnostico.component';
import { PriorizarIntervencionComponent } from '../forms/diagnostico/priorizar-intervencion/priorizar-intervencion.component';
import { ValidarPriorizacionComponent } from '../forms/diagnostico/validar-priorizacion/validar-priorizacion.component';
// tslint:disable-next-line: max-line-length
import { CargarEstudioDisenioComponent } from '../forms/planificacion/cargar-estudio-disenio/cargar-estudio-disenio.component';
import { EditarDisenioComponent } from '../forms/planificacion/editar-disenio/editar-disenio.component';
import { VerDisenioComponent } from '../forms/planificacion/ver-disenio/ver-disenio.component';
import { VerFuentesInformacionComponent } from '../forms/intervencion/ver-fuentes-informacion/ver-fuentes-informacion.component';
// tslint:disable-next-line: max-line-length
import { ProgramarVisitaVerificacionComponent } from '../forms/intervencion/programar-visita-verificacion/programar-visita-verificacion.component';
import { EditarVerificacionComponent } from '../forms/intervencion/editar-verificacion/editar-verificacion.component';
import { GestionarVisitaDisenioComponent } from '../forms/planificacion/gestionar-visita-disenio/gestionar-visita-disenio.component';
import { GestionarReservaComponent } from '../forms/planificacion/gestionar-reserva/gestionar-reserva.component';
import { EditarVisitaPreDisenioComponent } from '../forms/planificacion/editar-visita-pre-disenio/editar-visita-pre-disenio.component';
import { VerVisitaPreDisenioComponent } from '../forms/planificacion/ver-visita-pre-disenio/ver-visita-pre-disenio.component';
// tslint:disable-next-line: max-line-length
import { EditarFichaCierreIntervencionComponent } from '../forms/intervencion/editar-ficha-cierre-intervencion/editar-ficha-cierre-intervencion.component';
import { EditarActasVecindadComponent } from '../forms/social/editar-actas-vecindad/editar-actas-vecindad.component';
import { VerActasVecindadComponent } from '../forms/social/ver-actas-vecindad/ver-actas-vecindad.component';
import { AsignarVisitaPredisenioComponent } from '../forms/planificacion/asignar-visita-predisenio/asignar-visita-predisenio.component';
// tslint:disable-next-line: max-line-length
import { ProgramarVisitaAsignarVehiculoComponent } from '../forms/planificacion/programar-visita-asignar-vehiculo/programar-visita-asignar-vehiculo.component';
// tslint:disable-next-line: max-line-length
import { EditarControlesCalidadRealizadosMezclaProducidaPlantaComponent } from '../forms/produccion/editar-controles-calidad-realizados-mezcla-producida-planta/editar-controles-calidad-realizados-mezcla-producida-planta.component';
// tslint:disable-next-line: max-line-length
import { EditarResultadosDensidadesCampoComponent } from '../forms/produccion/editar-resultados-densidades-campo/editar-resultados-densidades-campo.component';
// tslint:disable-next-line: max-line-length
import { EditarResultadosExtraccionNucleoComponent } from '../forms/produccion/editar-resultados-extraccion-nucleo/editar-resultados-extraccion-nucleo.component';
// tslint:disable-next-line: max-line-length
import { EditarResultadosMaterialesGranularesComponent } from '../forms/produccion/editar-resultados-materiales-granulares/editar-resultados-materiales-granulares.component';
import { EditarResultadosApiquesComponent } from '../forms/planificacion/editar-resultados-apiques/editar-resultados-apiques.component';
import { EditarResultadosAforosComponent } from '../forms/planificacion/editar-resultados-aforos/editar-resultados-aforos.component';
// tslint:disable-next-line: max-line-length
import { VincularRadicadoPeticionarioComponent } from '../forms/planificacion/vincular-radicado-peticionario/vincular-radicado-peticionario.component';
import { AsignarMisionalidadOtrosComponent } from '../forms/planificacion/asignar-misionalidad-otros/asignar-misionalidad-otros.component';
import { AsignarSeguimientoComponent } from '../forms/planificacion/asignar-seguimiento/asignar-seguimiento.component';
// tslint:disable-next-line: max-line-length
import { ApiquesAforosComponent } from '../forms/planificacion/apiques-aforos/apiques-aforos';
// tslint:disable-next-line: max-line-length
import { AutoprogramarVisitaDiagnosticoComponent } from '../forms/planificacion/autoprogramar-visita-diagnostico/autoprogramar-visita-diagnostico.component';
import { GestionarPkVinculadosComponent } from '../forms/planificacion/gestionar-pk-vinculados/gestionar-pk-vinculados.component';
// tslint:disable-next-line: max-line-length
import { RegistrarVisitaDiagnosticoComponent } from '../forms/planificacion/registrar-visita-diagnostico/registrar-visita-diagnostico.component';
import { RevisarVisitaDiagnosticoComponent } from '../forms/planificacion/revisar-visita-diagnostico/revisar-visita-diagnostico.component';
// tslint:disable-next-line: max-line-length
import { ActualizarVisitaDiagnosticoComponent } from '../forms/planificacion/actualizar-visita-diagnostico/actualizar-visita-diagnostico.component';
import { ValidarVisitaDiagnosticoComponent } from '../forms/planificacion/validar-visita-diagnostico/validar-visita-diagnostico.component';
// tslint:disable-next-line: max-line-length
import { CargueResultadosLaboratorioComponent } from '../forms/produccion/cargue-resultados-laboratorio/cargue-resultados-laboratorio.component';
import { GestionarSeguimientoComponent } from '../forms/planificacion/gestionar-seguimiento/gestionar-seguimiento.component';
import { SolicitudPmtComponent } from '../forms/intervencion/solicitud-pmt/solicitud-pmt.component';
// tslint:disable-next-line: max-line-length
import { ConsultarTableroControlInformacionSIG } from '../forms/intervencion/tablero-control-informacion-sig/tablero-control-informacion-sig.component';
// tslint:disable-next-line: max-line-length
import { GestionarAsignacionResidentesAmbientalesComponent } from '../forms/ambiental/gestionar-asignacion-residentes-ambientales/gestionar-asignacion-residentes-ambientales.component';
import { GestionarMisionalidadComponent } from '../forms/planificacion/gestionar-misionalidad/gestionar-misionalidad.component';
import { RegistrarResultadoAforoComponent } from '../forms/diagnostico/registrar-resultado-aforo/registrar-resultado-aforo.component';
// tslint:disable-next-line: max-line-length
import { RegistrarProgramacionPeriodicaComponent } from '../forms/intervencion/registrar-programacion-periodica/registrar-programacion-periodica.component';
import { GenerarFichaCierreComponent } from '../forms/intervencion/generar-ficha-cierre/generar-ficha-cierre.component';
import { ConsultarInformacionSIGComponent } from '../forms/planificacion/consultar-informacion-sig/consultar-informacion-sig.component';
// tslint:disable-next-line: max-line-length
import { EditarVisitaTecnicaVerificacionComponent } from '../forms/intervencion/editar-visita-tecnica-verificacion/editar-visita-tecnica-verificacion.component';
import { CreateVisitaPreDisenioComponent } from '../forms/planificacion/create-visita-pre-disenio/create-visita-pre-disenio.component';
import { ValidarVisitaPreDisenioComponent } from '../forms/planificacion/validar-visita-pre-disenio/validar-visita-pre-disenio.component';
import { CreateDisenioComponent } from '../forms/planificacion/create-disenio/create-disenio.component';
import { ValidarDisenioComponent } from '../forms/planificacion/validar-disenio/validar-disenio.component';
import { RegistrarDisenioComponent } from '../forms/planificacion/registrar-disenio/registrar-disenio.component';
import { RevisarDisenioComponent } from '../forms/planificacion/revisar-disenio/revisar-disenio.component';
import { ActualizarDisenioComponent } from '../forms/planificacion/actualizar-disenio/actualizar-disenio.component';
import { RegistrarPreDisenioComponent } from '../forms/planificacion/registrar-pre-disenio/registrar-pre-disenio.component';
import { RevisarPreDisenioComponent } from '../forms/planificacion/revisar-pre-disenio/revisar-pre-disenio.component';
import { ActualizarPreDisenioComponent } from '../forms/planificacion/actualizar-pre-disenio/actualizar-pre-disenio.component';
import { ValidarPreDisenioComponent } from '../forms/planificacion/validar-pre-disenio/validar-pre-disenio.component';
import { GestionarResidentesSSTComponent } from '../forms/ambiental/gestionar-residentes-sst/gestionar-residentes-sst.component';
import { RegistrarChequeoSSTComponent } from '../forms/ambiental/registrar-chequeo-sst/registrar-chequeo-sst.component';
// tslint:disable-next-line: max-line-length
import { RegistrarEncuestasSatisfaccionComponent } from '../forms/social/registrar-encuestas-satisfaccion/registrar-encuestas-satisfaccion.component';
import { RegistrarChequeoAmbientalComponent } from '../forms/ambiental/registrar-chequeo-ambiental/registrar-chequeo-ambiental.component';
import { RegistrarBaniosPortatilesComponent } from '../forms/ambiental/registrar-banios-portatiles/registrar-banios-portatiles.component';
// tslint:disable-next-line: max-line-length
import { RealizarInventarioElementosAmbientalesComponent } from '../forms/ambiental/realizar-inventario-elementos-ambientales/realizar-inventario-elementos-ambientales.component';
// tslint:disable-next-line: max-line-length
import { RegistrarInspeccionAmbientalComponent } from '../forms/ambiental/registrar-inspeccion-ambiental/registrar-inspeccion-ambiental.component';
import { ConsolidadoDiarioTrabajoComponent } from '../forms/produccion/consolidado-diario-trabajo/consolidado-diario-trabajo.component';
import { ProgramarPersonalPlantaComponent } from '../forms/produccion/programar-personal-planta/programar-personal-planta.component';
import { RegistrarMezclaInsumosComponent } from '../forms/produccion/registrar-mezcla-insumos/registrar-mezcla-insumos.component';

import { RegistrarCierreAmbientalComponent } from '../forms/ambiental/registrar-cierre-ambiental/registrar-cierre-ambiental.component';
import { RegistroProgramacionDiariaTrabajoComponent } from '../forms/intervencion/registro-programacion-diaria-trabajo/registro-programacion-diaria-trabajo.component';
import { AsignarMaquinariaDisponibleComponent } from '../forms/produccion/asignar-maquinaria-disponible/asignar-maquinaria-disponible/asignar-maquinaria-disponible.component';
import { RegistrarActaVecindadVolanteAdminComponent } from 'src/app/gestion-social/registrar-acta-vecindad-volante/registrar-acta-vecindad-volante-admin/registrar-acta-vecindad-volante-admin.component';
import { RegistrarActaVecindadVolanteComponent } from '../forms/social/registrar-acta-vecindad-volante/registrar-acta-vecindad-volante.component';
import { ConsultarConsolidadoAmbientalComponent } from '../forms/ambiental/consultar-consolidado-ambiental/consultar-consolidado-ambiental.component';
import { AprobarActasVecindadComponent } from '../forms/social/aprobar-actas-vecindad/aprobar-actas-vecindad.component';
import { RegistroDiarioTrabajoCuadrillaComponent } from '../forms/intervencion/registro-diario-trabajo-cuadrilla/registro-diario-trabajo-cuadrilla.component';
import { SolicitudesProgramacionMezclaListComponent } from '../forms/produccion/programar-produccion-mezcla/solicitudes-programacion-mezcla-list/solicitudes-programacion-mezcla-list.component';
import { RegistrarActasVecindadComponent } from '../forms/social/registrar-actas-vecindad/registrar-actas-vecindad.component';


/**
 * Componente de servicio usado para gestionar las actividades
 * de asignación del mantenimiento actividad al formulario.
 */
@Injectable({
  providedIn: 'root'
})
export class FormularioServiceService {

  /** Variable usada para notificación a otros componentes de cambios en el formulario*/
  private formularioSubject = new BehaviorSubject<WorkflowFormulario>(null);
  /** Variable usada para notificación a otros componentes que el formulario esta cargando*/
  private loadingFormulario = new BehaviorSubject<Boolean>(false);
  /** Variable usada para notificación a otros componentes que el formulario esta cargando*/
  public loadingForm$ = this.loadingFormulario.asObservable();

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /**
   * Método encargado de notificar el observador al formulario actual, según la
   * actividad actual del mantenimiento
   *
   * @param mantenimientoActividad Actividad del mantenimiento que define la actividad
   * a la que se dirigirá el usuario retornando dicho componente
   */
  getForm(
    mantenimientoActividad: WorkflowMantenimientoActividadModel
  ): Observable<WorkflowFormulario> {
    this.loadingFormulario.next(true);
    const componente = mantenimientoActividad.actividad.componenteUI
      ? mantenimientoActividad.actividad.componenteUI.nombre : '';
    switch (componente) {
      case 'GestionarMisionalidad':
        this.formularioSubject.next(
          new WorkflowFormulario(
            GestionarMisionalidadComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'GestionarSeguimiento':
        this.formularioSubject.next(
          new WorkflowFormulario(
            GestionarSeguimientoComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'ActualizarVisitaDiagnostico':
        this.formularioSubject.next(
          new WorkflowFormulario(
            ActualizarVisitaDiagnosticoComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'ValidarVisitaDiagnostico':
        this.formularioSubject.next(
          new WorkflowFormulario(
            ValidarVisitaDiagnosticoComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'RevisarVisitaDiagnostico':
        this.formularioSubject.next(
          new WorkflowFormulario(
            RevisarVisitaDiagnosticoComponent,
            mantenimientoActividad
          )
        );
        break;

      case 'RegistrarVisitaDiagnostico':
        this.formularioSubject.next(
          new WorkflowFormulario(
            RegistrarVisitaDiagnosticoComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'VincularPeticionario':
        this.formularioSubject.next(
          new WorkflowFormulario(
            VincularRadicadoPeticionarioComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'GestionarPkVinculado':
        this.formularioSubject.next(
          new WorkflowFormulario(
            GestionarPkVinculadosComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'AsignarSeguimiento':
        this.formularioSubject.next(
          new WorkflowFormulario(
            AsignarSeguimientoComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'AsignarMisionalidadOtros':
        this.formularioSubject.next(
          new WorkflowFormulario(
            AsignarMisionalidadOtrosComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'AutoprogramarVisitaDiagnostico':
        this.formularioSubject.next(
          new WorkflowFormulario(
            AutoprogramarVisitaDiagnosticoComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'ProgramarVisitaDiagnostico':
        this.formularioSubject.next(
          new WorkflowFormulario(
            ProgramarVisitaDiagnosticoComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'RegistrarResultadoApique':
        this.formularioSubject.next(
          new WorkflowFormulario(
            RegistrarResultadoApiqueComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'RegistrarResultadoAforo':
        this.formularioSubject.next(
          new WorkflowFormulario(
            RegistrarResultadoAforoComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'EditarPriorizacion':
        this.formularioSubject.next(
          new WorkflowFormulario(
            PriorizarIntervencionComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'VerPriorizacion':
        this.formularioSubject.next(
          new WorkflowFormulario(
            ValidarPriorizacionComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'CargarEstudioDisenio':
        this.formularioSubject.next(
          new WorkflowFormulario(
            CargarEstudioDisenioComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'EditarDisenio':
        this.formularioSubject.next(
          new WorkflowFormulario(EditarDisenioComponent, mantenimientoActividad)
        );
        break;
      case 'VerDisenio':
        this.formularioSubject.next(
          new WorkflowFormulario(VerDisenioComponent, mantenimientoActividad)
        );
        break;
      case 'CreateDisenio':
        this.formularioSubject.next(
          new WorkflowFormulario(CreateDisenioComponent, mantenimientoActividad)
        );
        break;
      case 'ValidarDisenio':
        this.formularioSubject.next(
          new WorkflowFormulario(ValidarDisenioComponent, mantenimientoActividad)
        );
        break;
      case 'VerFuentesInformacion':
        this.formularioSubject.next(
          new WorkflowFormulario(
            VerFuentesInformacionComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'ProgramarVisitaVerificacion':
        this.formularioSubject.next(
          new WorkflowFormulario(
            ProgramarVisitaVerificacionComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'EditarVerificacion':
        this.formularioSubject.next(
          new WorkflowFormulario(
            EditarVerificacionComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'GestionarVisitaDisenio':
        this.formularioSubject.next(
          new WorkflowFormulario(
            GestionarVisitaDisenioComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'GestionarReserva':
        this.formularioSubject.next(
          new WorkflowFormulario(
            GestionarReservaComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'EditarVisitaPreDisenio':
        this.formularioSubject.next(
          new WorkflowFormulario(
            EditarVisitaPreDisenioComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'CrearVisitaPreDisenio':
        this.formularioSubject.next(
          new WorkflowFormulario(
            CreateVisitaPreDisenioComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'VerVisitaPreDisenio':
        this.formularioSubject.next(
          new WorkflowFormulario(
            VerVisitaPreDisenioComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'ValidarVisitaPreDisenio':
        this.formularioSubject.next(
          new WorkflowFormulario(
            ValidarVisitaPreDisenioComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'EditarFichaCierreIntervencion':
        this.formularioSubject.next(
          new WorkflowFormulario(
            EditarFichaCierreIntervencionComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'EditarActasVecindad':
        this.formularioSubject.next(
          new WorkflowFormulario(
            RegistrarActasVecindadComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'VerActasVecindad':
        this.formularioSubject.next(
          new WorkflowFormulario(
            VerActasVecindadComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'AsignarVisitaPredisenio':
        this.formularioSubject.next(
          new WorkflowFormulario(
            AsignarVisitaPredisenioComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'ProgramarVisitaAsignarVehiculo':
        this.formularioSubject.next(
          new WorkflowFormulario(
            ProgramarVisitaAsignarVehiculoComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'EditarResultadosDensidadesCampo':
        this.formularioSubject.next(
          new WorkflowFormulario(
            EditarResultadosDensidadesCampoComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'EditarResultadosExtraccionNucleo':
        this.formularioSubject.next(
          new WorkflowFormulario(
            EditarResultadosExtraccionNucleoComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'EditarResultadosMaterialesGranulares':
        this.formularioSubject.next(
          new WorkflowFormulario(
            EditarResultadosMaterialesGranularesComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'EditarControlesCalidadRealizadosMezclaProducidaPlanta':
        this.formularioSubject.next(
          new WorkflowFormulario(
            EditarControlesCalidadRealizadosMezclaProducidaPlantaComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'EditarResultadosApiques':
        this.formularioSubject.next(
          new WorkflowFormulario(
            EditarResultadosApiquesComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'EditarResultadosAforos':
        this.formularioSubject.next(
          new WorkflowFormulario(
            EditarResultadosAforosComponent,
            mantenimientoActividad
          )
        );
        break;

      case 'ConsolidadoVisitaTecnica':
        this.formularioSubject.next(
          new WorkflowFormulario(
            ConsolidadoVisitaTecnicaComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'RegistroVisitasTecnicaVerificacion':
        this.formularioSubject.next(
          new WorkflowFormulario(
            EditarVisitaTecnicaVerificacionComponent,
            mantenimientoActividad)
        );
        break;
      case 'CargueResultadosLaboratorio':
        this.formularioSubject.next(
          new WorkflowFormulario(
            CargueResultadosLaboratorioComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'SolicitarApiqueAforo':
        this.formularioSubject.next(
          new WorkflowFormulario(
            SolicitarApiqueAforoComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'GestionarSolicitudesSmvlActualizacionRemisionOtras':
        this.formularioSubject.next(
          new WorkflowFormulario(
            GestionarSolicitudesSmvlActualizacionRemisionOtrasComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'SolicitudPmtComponent':
        this.formularioSubject.next(
          new WorkflowFormulario(SolicitudPmtComponent, mantenimientoActividad)
        );
        break;
      case 'ConsultarTableroControlInformacionSIG':
        this.formularioSubject.next(
          new WorkflowFormulario(ConsultarTableroControlInformacionSIG, mantenimientoActividad)
        );
        break;
      case 'GestionarAsignacionResidentesAmbientales':
        this.formularioSubject.next(
          new WorkflowFormulario(
            GestionarAsignacionResidentesAmbientalesComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'registrarProgramacionPeriodicaIntervencion':
        this.formularioSubject.next(
          new WorkflowFormulario(
            RegistrarProgramacionPeriodicaComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'AsignarResidenteSocial':
        this.formularioSubject.next(
          new WorkflowFormulario(
            AsignarResidenteSocialComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'AsignarResidenteSocial':
        this.formularioSubject.next(
          new WorkflowFormulario(
            AsignarResidenteSocialComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'ConsultarInformacionSIG':
        this.formularioSubject.next(
          new WorkflowFormulario(
            ConsultarInformacionSIGComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'GenerarFichaCierre':
        this.formularioSubject.next(
          new WorkflowFormulario(
            GenerarFichaCierreComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'AsignarResidenteSocial':
        this.formularioSubject.next(
          new WorkflowFormulario(
            AsignarResidenteSocialComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'ApiquesAforos':
        this.formularioSubject.next(
          new WorkflowFormulario(
            ApiquesAforosComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'GestionarResidentesSST':
        this.formularioSubject.next(
          new WorkflowFormulario(
            GestionarResidentesSSTComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'RegistrarChequeoSST':
        this.formularioSubject.next(
          new WorkflowFormulario(
            RegistrarChequeoSSTComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'RegistrarEncuestasSatisfaccion':
        this.formularioSubject.next(
          new WorkflowFormulario(
            RegistrarEncuestasSatisfaccionComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'RegistrarChequeoAmbiental':
        this.formularioSubject.next(
          new WorkflowFormulario(
            RegistrarChequeoAmbientalComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'RegistrarBaniosPortatiles':
        this.formularioSubject.next(
          new WorkflowFormulario(
            RegistrarBaniosPortatilesComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'RealizarInventarioElementosAmbientales':
        this.formularioSubject.next(
          new WorkflowFormulario(
            RealizarInventarioElementosAmbientalesComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'RegistrarInspeccionAmbiental':
        this.formularioSubject.next(
          new WorkflowFormulario(
            RegistrarInspeccionAmbientalComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'ConsolidadoDiarioTrabajo':
        this.formularioSubject.next(
          new WorkflowFormulario(
            ConsolidadoDiarioTrabajoComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'ProgramarPersonalPlanta':
        this.formularioSubject.next(
          new WorkflowFormulario(
            ProgramarPersonalPlantaComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'RegistrarMezclaInsumos':
        this.formularioSubject.next(
          new WorkflowFormulario(
            RegistrarMezclaInsumosComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'RegistrarCierreAmbiental':
        this.formularioSubject.next(
          new WorkflowFormulario(
            RegistrarCierreAmbientalComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'RegistroProgramacionDiariaTrabajo':
        this.formularioSubject.next(
          new WorkflowFormulario(
            RegistroProgramacionDiariaTrabajoComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'AsignarMaquinariaDisponible':
        this.formularioSubject.next(
          new WorkflowFormulario(
            AsignarMaquinariaDisponibleComponent,
            mantenimientoActividad
          )
        );
        break;


      case 'RegistrarActaVecindadVolanteAdmin':
        this.formularioSubject.next(
          new WorkflowFormulario(
            RegistrarActaVecindadVolanteAdminComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'RegistrarActaVecindadVolante':
        this.formularioSubject.next(
          new WorkflowFormulario(
            RegistrarActaVecindadVolanteComponent,
            mantenimientoActividad
          )
        );
        break;
      case 'AprobarActasVecindad':
        this.formularioSubject.next(
          new WorkflowFormulario(
            AprobarActasVecindadComponent,
            mantenimientoActividad
            )
        );
        break;
      case 'ConsultarConsolidadoAmbiental':
        this.formularioSubject.next(
          new WorkflowFormulario(
            ConsultarConsolidadoAmbientalComponent,
            mantenimientoActividad
          )
      );
      break;
      case 'GestionarRadicadosPqrsfd':
       this.formularioSubject.next(
        new WorkflowFormulario(
          GestionarRadicadosPqrsfdComponent,
          mantenimientoActividad
          )
      );
      break;
      case 'RegistroDiarioTrabajoCuadrilla':
        this.formularioSubject.next(
          new WorkflowFormulario(
            RegistroDiarioTrabajoCuadrillaComponent,
            mantenimientoActividad
          )
        );
        break;
        case 'RegistrarGestionSocialAdelantada':
          this.formularioSubject.next(
            new WorkflowFormulario(
              RegistrarGestionSocialAdelantadaComponent,
              mantenimientoActividad
            )
          );
          break;
        case 'ProgramarProduccionMezcla':
        this.formularioSubject.next(
          new WorkflowFormulario(
            SolicitudesProgramacionMezclaListComponent,
            mantenimientoActividad
          )
        );
        break;
      default:
        this.formularioSubject.next(null);
    }

    this.loadingFormulario.next(false);
    return this.formularioSubject.asObservable();
  }
}
