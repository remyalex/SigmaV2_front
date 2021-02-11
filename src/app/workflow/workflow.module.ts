import { GestionSocialAdelantadaModule } from './../gestion-social/gestion-social-adelantada/gestion-social-adelantada.module';
import { GestionSocialAdelantadaListComponent } from './../gestion-social/gestion-social-adelantada/gestion-social-adelantada-list/gestion-social-adelantada-list.component';
import { GestionSocialAdelantadaComponent } from './../gestion-social/gestion-social-adelantada/gestion-social-adelantada/gestion-social-adelantada.component';
import { RegistrarGestionSocialAdelantadaComponent } from './forms/social/registrar-gestion-social-adelantada/registrar-gestion-social-adelantada.component';
import { MantenimientoDocumentoComponent } from './forms/diagnostico/shared/mantenimiento-documento/mantenimiento-documento.component';
// tslint:disable-next-line: max-line-length
import { GestionarSolicitudesSmvlActualizacionRemisionOtrasComponent } from './forms/intervencion/gestionar-solicitudes-smvl-actualizacion-remision-otras/gestionar-solicitudes-smvl-actualizacion-remision-otras.component';
import { RegistrarResultadoApiqueComponent } from './forms/diagnostico/registrar-resultado-apique/registrar-resultado-apique.component';
import { ConsolidadoVisitaTecnicaComponent } from './forms/diagnostico/consolidado-visita-tecnica/consolidado-visita-tecnica.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';

import { WorkflowRoutingModule } from './workflow-routing.module';
import { ActividadViewerComponent } from './viewers/actividad-viewer/actividad-viewer.component';
import { FormularioViewerComponent } from './viewers/formulario-viewer/formulario-viewer.component';
import { FormularioDirective } from './directives/fomulario.directive';
import { MantenimientoViewComponent } from './templates/solicitud/mantenimiento-view/mantenimiento-view.component';
import { FactoresComponent } from './forms/diagnostico/shared/factores/factores.component';
import { RadicadoSalidaComponent } from './forms/solicitud/shared/radicado-salida/radicado-salida.component';
import { MuestreosComponent } from './forms/diagnostico/shared/muestreos/muestreos.component';
import { FallasComponent } from './forms/diagnostico/shared/fallas/fallas.component';
import { FallasEditComponent } from './forms/diagnostico/shared/fallasEdit/fallasEdit.component';
import { MuestreosEditComponent } from './forms/diagnostico/shared/muestreosEdit/muestreosEdit.component';
import { FactoresEditComponent } from './forms/diagnostico/shared/factoresEdit/factoresEdit.component';
import { FotosComponent } from './forms/diagnostico/shared/fotos/fotos.component';
import { EditarDisenioComponent } from './forms/planificacion/editar-disenio/editar-disenio.component';
import { VerDisenioComponent } from './forms/planificacion/ver-disenio/ver-disenio.component';
import { VerFuentesInformacionComponent } from './forms/intervencion/ver-fuentes-informacion/ver-fuentes-informacion.component';
import { PriorizarIntervencionComponent } from './forms/diagnostico/priorizar-intervencion/priorizar-intervencion.component';
import { ValidarPriorizacionComponent } from './forms/diagnostico/validar-priorizacion/validar-priorizacion.component';
import { EditarVerificacionComponent } from './forms/intervencion/editar-verificacion/editar-verificacion.component';
import { GestionarVisitaDisenioComponent } from './forms/planificacion/gestionar-visita-disenio/gestionar-visita-disenio.component';
import { RadicadoEntradaComponent } from './forms/solicitud/shared/radicado-entrada/radicado-entrada.component';
import { GestionarReservaComponent } from './forms/planificacion/gestionar-reserva/gestionar-reserva.component';
import { EditarVisitaPreDisenioComponent } from './forms/planificacion/editar-visita-pre-disenio/editar-visita-pre-disenio.component';
import { DetailEquipoComponent } from './forms/diagnostico/shared/detail-equipo/detail-equipo.component';
import { EditarActasVecindadComponent } from './forms/social/editar-actas-vecindad/editar-actas-vecindad.component';
import { VerActasVecindadComponent } from './forms/social/ver-actas-vecindad/ver-actas-vecindad.component';
import { AsignarVisitaPredisenioComponent } from './forms/planificacion/asignar-visita-predisenio/asignar-visita-predisenio.component';
import { EditarResultadosAforosComponent } from './forms/planificacion/editar-resultados-aforos/editar-resultados-aforos.component';
import { AsignarSeguimientoComponent } from './forms/planificacion/asignar-seguimiento/asignar-seguimiento.component';
import { GestionarPkVinculadosComponent } from './forms/planificacion/gestionar-pk-vinculados/gestionar-pk-vinculados.component';
// tslint:disable-next-line: max-line-length
import { RevisarVisitaDiagnosticoComponent } from './forms/planificacion/revisar-visita-diagnostico/revisar-visita-diagnostico.component';
import { ValidarVisitaDiagnosticoComponent } from './forms/planificacion/validar-visita-diagnostico/validar-visita-diagnostico.component';
import { DisenioModule } from '../mejoramiento/disenio/disenio.module';
import { PredisenioModule } from '../mejoramiento/predisenio/predisenio.module';
import { RadicadoSalidaReservaComponent } from './forms/solicitud/shared/radicado-salida-reserva/radicado-salida-reserva.component';
import { UbicarApiqueComponent } from '../mejoramiento/predisenio/ubicar-apique/ubicar-apique.component';
import { DiagnosticoModule } from '../mejoramiento/diagnostico/diagnostico.module';
// tslint:disable-next-line: max-line-length
import { GestionarSeguimientoComponent } from './forms/planificacion/gestionar-seguimiento/gestionar-seguimiento.component';
import { GestionarMisionalidadComponent } from './forms/planificacion/gestionar-misionalidad/gestionar-misionalidad.component';
import { SeguridadModule } from '../seguridad/seguridad.module';
// tslint:disable-next-line: max-line-length
import { EditarVisitaTecnicaVerificacionComponent } from './forms/intervencion/editar-visita-tecnica-verificacion/editar-visita-tecnica-verificacion.component';
import { VisitatecnicaverificacionModule } from '../intervencion/visitatecnicaverificacion/visitatecnicaverificacion.module';
import { CargueResultadosLaboratorioModule } from '../produccion/cargue-resultados-laboratorio/cargue-resultados-laboratorio.module';
import { SolicitarApiqueAforoComponent } from './forms/diagnostico/solicitar-apique-aforo/solicitar-apique-aforo.component';
import { SolicitudPmtComponent } from './forms/intervencion/solicitud-pmt/solicitud-pmt.component';
// tslint:disable-next-line: max-line-length
import { ConsultarTableroControlInformacionSIG } from './forms/intervencion/tablero-control-informacion-sig/tablero-control-informacion-sig.component';
import { IntervencionModule } from '../intervencion/intervencion.module';
import { DisenioInformacion } from '../mejoramiento/disenio-informacion/models/disenio-informacion.model';
import { DisenioInformacionModule } from '../mejoramiento/disenio-informacion/disenio-informacion.module';
// tslint:disable-next-line: max-line-length
import { ProgramarVisitaVerificacionComponent } from './forms/intervencion/programar-visita-verificacion/programar-visita-verificacion.component';
// tslint:disable-next-line: max-line-length
import { PriorizarSolicitudesApiquesComponent } from './forms/diagnostico/shared/priorizar-solicitudes-apiques/priorizar-solicitudes-apiques.component';
// tslint:disable-next-line: max-line-length
import {  RegistrarVisitaDiagnosticoComponent } from './forms/planificacion/registrar-visita-diagnostico/registrar-visita-diagnostico.component';
// tslint:disable-next-line: max-line-length
import {  ActualizarVisitaDiagnosticoComponent } from './forms/planificacion/actualizar-visita-diagnostico/actualizar-visita-diagnostico.component';

// tslint:disable-next-line: max-line-length
import { ResultadosSolicitudesApiquesComponent } from './forms/diagnostico/shared/resultadosSolicitudesApiques/resultados-solicitudes-apiques.component';

// tslint:disable-next-line: max-line-length
import { RegistrarProgramacionPeriodicaComponent } from './forms/intervencion/registrar-programacion-periodica/registrar-programacion-periodica.component';
// tslint:disable-next-line: max-line-length
import { CargueResultadosLaboratorioComponent } from './forms/produccion/cargue-resultados-laboratorio/cargue-resultados-laboratorio.component';
// tslint:disable-next-line: max-line-length
import { VincularRadicadoPeticionarioComponent } from './forms/planificacion/vincular-radicado-peticionario/vincular-radicado-peticionario.component';
// tslint:disable-next-line: max-line-length
import { AutoprogramarVisitaDiagnosticoComponent } from './forms/planificacion/autoprogramar-visita-diagnostico/autoprogramar-visita-diagnostico.component';
// tslint:disable-next-line:max-line-length
import { AsignarMisionalidadOtrosComponent } from './forms/planificacion/asignar-misionalidad-otros/asignar-misionalidad-otros.component';
// tslint:disable-next-line:max-line-length
import { ProgramarVisitaAsignarVehiculoComponent } from './forms/planificacion/programar-visita-asignar-vehiculo/programar-visita-asignar-vehiculo.component';
// tslint:disable-next-line:max-line-length
import { EditarResultadosDensidadesCampoComponent } from './forms/produccion/editar-resultados-densidades-campo/editar-resultados-densidades-campo.component';
// tslint:disable-next-line:max-line-length
import { EditarResultadosExtraccionNucleoComponent } from './forms/produccion/editar-resultados-extraccion-nucleo/editar-resultados-extraccion-nucleo.component';
// tslint:disable-next-line:max-line-length
import { EditarResultadosMaterialesGranularesComponent } from './forms/produccion/editar-resultados-materiales-granulares/editar-resultados-materiales-granulares.component';
// tslint:disable-next-line:max-line-length
import { EditarControlesCalidadRealizadosMezclaProducidaPlantaComponent } from './forms/produccion/editar-controles-calidad-realizados-mezcla-producida-planta/editar-controles-calidad-realizados-mezcla-producida-planta.component';
// tslint:disable-next-line:max-line-length
import { EditarResultadosApiquesComponent } from './forms/planificacion/editar-resultados-apiques/editar-resultados-apiques.component';
// tslint:disable-next-line: max-line-length
import { ImportarSeleccionPksComponent } from './forms/solicitud/shared/importar-seleccion-pks/importar-seleccion-pks.component';
// tslint:disable-next-line: max-line-length
import { ProgramarVisitaDiagnosticoComponent } from './forms/diagnostico/programar-visita-diagnostico/programar-visita-diagnostico.component';
// tslint:disable-next-line: max-line-length
import { ResultadosSolicitudesAforosComponent } from './forms/diagnostico/shared/resultadosSolicitudesAforos/resultados-solicitudes-aforos.component';
// tslint:disable-next-line:max-line-length
import { ImportarDisponibilidadPersonaComponent } from './forms/solicitud/shared/importar-disponibilidad-persona/importar-disponibilidad-persona.component';
// tslint:disable-next-line:max-line-length
import { CargarEstudioDisenioComponent } from './forms/planificacion/cargar-estudio-disenio/cargar-estudio-disenio.component';
// tslint:disable-next-line:max-line-length
import { ImportarDisponibilidadEquipoComponent } from './forms/solicitud/shared/importar-disponibilidad-equipo/importar-disponibilidad-equipo.component';
// tslint:disable-next-line:max-line-length
import { ImportarDisponibilidadLugarComponent } from './forms/solicitud/shared/importar-disponibilidad-lugar/importar-disponibilidad-lugar.component';
// tslint:disable-next-line:max-line-length
import { VerVisitaPreDisenioComponent } from './forms/planificacion/ver-visita-pre-disenio/ver-visita-pre-disenio.component';
// tslint:disable-next-line:max-line-length
import { EditarFichaCierreIntervencionComponent } from './forms/intervencion/editar-ficha-cierre-intervencion/editar-ficha-cierre-intervencion.component';
import { RegistrarResultadoAforoComponent } from './forms/diagnostico/registrar-resultado-aforo/registrar-resultado-aforo.component';
// tslint:disable-next-line:max-line-length
import { GestionarAsignacionResidentesAmbientalesComponent } from './forms/ambiental/gestionar-asignacion-residentes-ambientales/gestionar-asignacion-residentes-ambientales.component';
import { FotoDiagnosticoPkComponent } from 'src/app/shared/component/foto-diagnostico-pk/foto-diagnostico-pk.component';
// tslint:disable-next-line: max-line-length
import { ApiquesAforosComponent } from './forms/planificacion/apiques-aforos/apiques-aforos';
// tslint:disable-next-line: max-line-length
import { GenerarFichaCierreComponent } from './forms/intervencion/generar-ficha-cierre/generar-ficha-cierre.component';
import { ConsultarInformacionSIGComponent } from './forms/planificacion/consultar-informacion-sig/consultar-informacion-sig.component';
import { CreateVisitaPreDisenioComponent } from './forms/planificacion/create-visita-pre-disenio/create-visita-pre-disenio.component';
import { ValidarVisitaPreDisenioComponent } from './forms/planificacion/validar-visita-pre-disenio/validar-visita-pre-disenio.component';
import { CreateDisenioComponent } from './forms/planificacion/create-disenio/create-disenio.component';
import { ValidarDisenioComponent } from './forms/planificacion/validar-disenio/validar-disenio.component';
import { RegistrarDisenioComponent } from './forms/planificacion/registrar-disenio/registrar-disenio.component';
import { RevisarDisenioComponent } from './forms/planificacion/revisar-disenio/revisar-disenio.component';
import { ActualizarDisenioComponent } from './forms/planificacion/actualizar-disenio/actualizar-disenio.component';
import { RegistrarPreDisenioComponent } from './forms/planificacion/registrar-pre-disenio/registrar-pre-disenio.component';
import { RevisarPreDisenioComponent } from './forms/planificacion/revisar-pre-disenio/revisar-pre-disenio.component';
import { ActualizarPreDisenioComponent } from './forms/planificacion/actualizar-pre-disenio/actualizar-pre-disenio.component';
import { ValidarPreDisenioComponent } from './forms/planificacion/validar-pre-disenio/validar-pre-disenio.component';
import { AsignarResidenteSocialComponent } from './forms/social/asignar-residente-social/asignar-residente-social.component';
import { GestionarResidentesSSTComponent } from './forms/ambiental/gestionar-residentes-sst/gestionar-residentes-sst.component';
import { RegistrarChequeoSSTComponent } from './forms/ambiental/registrar-chequeo-sst/registrar-chequeo-sst.component';
// tslint:disable-next-line: max-line-length
import { RegistrarEncuestasSatisfaccionComponent } from './forms/social/registrar-encuestas-satisfaccion/registrar-encuestas-satisfaccion.component';
import { RegistrarBaniosPortatilesComponent } from './forms/ambiental/registrar-banios-portatiles/registrar-banios-portatiles.component';
// tslint:disable-next-line: max-line-length
import { RealizarInventarioElementosAmbientalesComponent } from './forms/ambiental/realizar-inventario-elementos-ambientales/realizar-inventario-elementos-ambientales.component';
// tslint:disable-next-line: max-line-length
import { RegistrarInspeccionAmbientalComponent } from './forms/ambiental/registrar-inspeccion-ambiental/registrar-inspeccion-ambiental.component';
import { ConsolidadoDiarioTrabajoComponent } from './forms/produccion/consolidado-diario-trabajo/consolidado-diario-trabajo.component';
import { ProgramarPersonalPlantaComponent } from './forms/produccion/programar-personal-planta/programar-personal-planta.component';
import { RegistrarMezclaInsumosComponent } from './forms/produccion/registrar-mezcla-insumos/registrar-mezcla-insumos.component';

import { RegistrarCierreAmbientalComponent } from './forms/ambiental/registrar-cierre-ambiental/registrar-cierre-ambiental.component';
import { RegistrarChequeoAmbientalComponent } from './forms/ambiental/registrar-chequeo-ambiental/registrar-chequeo-ambiental.component';
import { ViewFormPmtComponent } from './forms/intervencion/solicitud-pmt/view-form-pmt/view-form-pmt.component';
import { RegistroProgramacionDiariaTrabajoComponent } from './forms/intervencion/registro-programacion-diaria-trabajo/registro-programacion-diaria-trabajo.component';
import { GestionAmbientalModule } from '../gestion-ambiental/gestion-ambiental.module';
import { GestionSocialModule } from '../gestion-social/gestion-social.module';
import { RegistrarActaVecindadVolanteComponent } from './forms/social/registrar-acta-vecindad-volante/registrar-acta-vecindad-volante.component';
import { RegistrarActaVecindadVolanteModule } from '../gestion-social/registrar-acta-vecindad-volante/registrar-acta-vecindad-volante.module';
// tslint:disable-next-line: max-line-length
import { MantenimientosSeleccionadosComponent } from '../gestion-social/asignar-residente-social/mantenimientos-seleccionados/mantenimientos-seleccionados.component';
// tslint:disable-next-line: max-line-length
import { MantenimientosSeleccionadosAmbientalComponent } from '../gestion-ambiental/gestionar-asignacion-residentes-ambientales/mantenimientos-seleccionados-ambiental/mantenimientos-seleccionados-ambiental.component';
// tslint:disable-next-line: max-line-length
import { MantenimientosSeleccionadosSstComponent } from '../gestion-ambiental/gestionar-asignacion-residentes-sst/mantenimientos-seleccionados-sst/mantenimientos-seleccionados-sst.component';
// tslint:disable-next-line: max-line-length
import { AsignarMaquinariaDisponibleComponent } from './forms/produccion/asignar-maquinaria-disponible/asignar-maquinaria-disponible/asignar-maquinaria-disponible.component';
import { AsignarMaquinariaAdminComponent } from '../produccion/asignar-maquinaria-disponible-a-solicitudes/asignar-maquinaria-admin/asignar-maquinaria-admin.component';
import { AsignarMaquinariaDisponibleASolicitudesModule } from '../produccion/asignar-maquinaria-disponible-a-solicitudes/asignar-maquinaria-disponible-a-solicitudes.module';
import { ImportarGrupoComponent } from '../administracion/grupo/grupo-importar/importar-grupo/importar-grupo.component';
import { CargaDeArchivoComponent } from '../produccion/registro-control-calidad-a-mezcla-producida-en-planta/carga-de-archivo/carga-de-archivo.component';
import { DetalleFichaCierreIntervencionComponent } from './forms/intervencion/detalle-ficha-cierre-intervencion/detalle-ficha-cierre-intervencion.component';
import { MatSidenavModule, MatTreeModule } from '@angular/material';
import { CdkTreeModule } from '@angular/cdk/tree';
import { SigmaChartTableroControlSigComponent } from '../shared/component/sigma-chart-tablero-control-sig/sigma-chart-tablero-control-sig.component';
import { ConsultarConsolidadoAmbientalComponent } from './forms/ambiental/consultar-consolidado-ambiental/consultar-consolidado-ambiental.component';
import { AprobarActasVecindadComponent } from './forms/social/aprobar-actas-vecindad/aprobar-actas-vecindad.component';
import { FiltrosComponent } from '../intervencion/tablero-control-infomacion-sig/filtros/filtros.component';
import { ArchivosMantenimientoComponent } from './forms/diagnostico/shared/archivos-mantenimiento/archivos-mantenimiento.component';
// tslint:disable-next-line: max-line-length
import { RegistroDiarioTrabajoCuadrillaComponent } from './forms/intervencion/registro-diario-trabajo-cuadrilla/registro-diario-trabajo-cuadrilla.component';
// tslint:disable-next-line: max-line-length
import { RegistroDiarioTrabajoCuadrillaModule } from '../intervencion/registro-diario-trabajo-cuadrilla/registro-diario-trabajo-cuadrilla.module';
import { SolicitudesProgramacionMezclaListComponent } from './forms/produccion/programar-produccion-mezcla/solicitudes-programacion-mezcla-list/solicitudes-programacion-mezcla-list.component';
import { ProgramarListComponent } from '../produccion/produccion-mezcla/programar-list/programar-list.component';
import { ProduccionMezclaModule } from '../produccion/produccion-mezcla/produccion-mezcla.module';
import { ProgramarDetalleListComponent } from '../produccion/produccion-mezcla/programar-detalle-list/programar-detalle-list.component';
import { ConfirmCapacidadComponent } from '../produccion/produccion-mezcla/confirm-capacidad/confirm-capacidad.component';
import { EncuestaSatisfaccionModule } from '../gestion-social/encuesta-satisfaccion/encuesta-satisfaccion.module';
import { EncuestaSatisfaccionCreateComponent } from '../gestion-social/encuesta-satisfaccion/encuesta-satisfaccion-create/encuesta-satisfaccion-create.component';
import { EncuestaSatisfaccionListComponent } from '../gestion-social/encuesta-satisfaccion/encuesta-satisfaccion-list/encuesta-satisfaccion-list.component';
import { EncuestaSatisfaccionEditComponent } from '../gestion-social/encuesta-satisfaccion/encuesta-satisfaccion-edit/encuesta-satisfaccion-edit.component';
import { EncuestaSatisfaccionAttachComponent } from '../gestion-social/encuesta-satisfaccion/encuesta-satisfaccion-attach/encuesta-satisfaccion-attach.component';
import { ConfirmacionComponent } from '../produccion/asignar-maquinaria-disponible-a-solicitudes/confirmacion/confirmacion.component';
import { ImportarPksGrupoComponent } from '../administracion/grupo/grupo-importar/importar-pks-grupo/importar-pks-grupo.component';
import { AprobarActasListComponent } from '../gestion-social/aprobar-actas-vecindad/aprobar-actas-list/aprobar-actas-list.component';
import { AprobarActasAproveComponent } from '../gestion-social/aprobar-actas-vecindad/aprobar-actas-aprove/aprobar-actas-aprove.component';
import { RegistrarActasVecindadComponent } from './forms/social/registrar-actas-vecindad/registrar-actas-vecindad.component';
import { ActasVecindadModule } from '../gestion-social/actas-vecindad/actas-vecindad.module';



@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    ActividadViewerComponent,
    FormularioViewerComponent,
    FormularioDirective,
    AsignarSeguimientoComponent,
    AsignarMisionalidadOtrosComponent,
    ProgramarVisitaDiagnosticoComponent,
    MantenimientoViewComponent,
    FactoresComponent,
    FotosComponent,
    FactoresEditComponent,
    MuestreosComponent,
    MuestreosEditComponent,
    FallasComponent,
    FallasEditComponent,
    RadicadoSalidaComponent,
    ImportarSeleccionPksComponent,
    ImportarDisponibilidadPersonaComponent,
    ImportarDisponibilidadEquipoComponent,
    ImportarDisponibilidadLugarComponent,
    AutoprogramarVisitaDiagnosticoComponent,
    PriorizarIntervencionComponent,
    ValidarPriorizacionComponent,
    CargarEstudioDisenioComponent,
    EditarDisenioComponent,
    VerDisenioComponent,
    CreateDisenioComponent,
    ValidarDisenioComponent,
    VerFuentesInformacionComponent,
    ProgramarVisitaVerificacionComponent,
    ConsolidadoVisitaTecnicaComponent,
    EditarVerificacionComponent,
    GestionarVisitaDisenioComponent,
    GestionarReservaComponent,
    RadicadoEntradaComponent,
    EditarVisitaPreDisenioComponent,
    VerVisitaPreDisenioComponent,
    CreateVisitaPreDisenioComponent,
    ValidarVisitaPreDisenioComponent,
    EditarFichaCierreIntervencionComponent,
    DetailEquipoComponent,
    EditarActasVecindadComponent,
    VerActasVecindadComponent,
    AsignarVisitaPredisenioComponent,
    ProgramarVisitaAsignarVehiculoComponent,
    EditarResultadosDensidadesCampoComponent,
    EditarResultadosExtraccionNucleoComponent,
    EditarResultadosMaterialesGranularesComponent,
    EditarControlesCalidadRealizadosMezclaProducidaPlantaComponent,
    EditarResultadosApiquesComponent,
    EditarResultadosAforosComponent,
    ResultadosSolicitudesApiquesComponent,
    ResultadosSolicitudesAforosComponent,
    RadicadoSalidaReservaComponent,
    AsignarMisionalidadOtrosComponent,
    AutoprogramarVisitaDiagnosticoComponent,
    GestionarPkVinculadosComponent,
    VincularRadicadoPeticionarioComponent,
    ApiquesAforosComponent,
    RegistrarResultadoApiqueComponent,
    VincularRadicadoPeticionarioComponent,
    RegistrarVisitaDiagnosticoComponent,
    ActualizarVisitaDiagnosticoComponent,
    RevisarVisitaDiagnosticoComponent,
    ValidarVisitaDiagnosticoComponent,
    MantenimientoDocumentoComponent,
    VincularRadicadoPeticionarioComponent,
    GestionarSeguimientoComponent,
    GestionarMisionalidadComponent,
    EditarVisitaTecnicaVerificacionComponent,
    CargueResultadosLaboratorioComponent,
    SolicitarApiqueAforoComponent,
    PriorizarSolicitudesApiquesComponent,
    GestionarSolicitudesSmvlActualizacionRemisionOtrasComponent,
    RegistrarProgramacionPeriodicaComponent,
    RegistrarResultadoAforoComponent,
    SolicitudPmtComponent,
    ConsultarTableroControlInformacionSIG,
    GestionarAsignacionResidentesAmbientalesComponent,
    ConsultarInformacionSIGComponent,
    AsignarResidenteSocialComponent,
    GenerarFichaCierreComponent,
    RegistrarDisenioComponent,
    RevisarDisenioComponent,
    ActualizarDisenioComponent,
    RegistrarPreDisenioComponent,
    RevisarPreDisenioComponent,
    ActualizarPreDisenioComponent,
    ValidarPreDisenioComponent,
    GestionarResidentesSSTComponent,
    RegistrarChequeoSSTComponent,
    RegistrarEncuestasSatisfaccionComponent,
    RegistrarBaniosPortatilesComponent,
    RealizarInventarioElementosAmbientalesComponent,
    RegistrarInspeccionAmbientalComponent,
    ConsolidadoDiarioTrabajoComponent,
    ProgramarPersonalPlantaComponent,
    RegistrarMezclaInsumosComponent,
    RegistrarCierreAmbientalComponent,
    RegistrarChequeoAmbientalComponent,
    ViewFormPmtComponent,
    RegistroProgramacionDiariaTrabajoComponent,
    AsignarMaquinariaDisponibleComponent,
    RegistrarActaVecindadVolanteComponent,
    DetalleFichaCierreIntervencionComponent,
    ConsultarConsolidadoAmbientalComponent,
    AprobarActasVecindadComponent,
    ArchivosMantenimientoComponent,
    RegistroDiarioTrabajoCuadrillaComponent,
    RegistrarGestionSocialAdelantadaComponent,
    SolicitudesProgramacionMezclaListComponent,
    RegistrarActasVecindadComponent
  ],
  entryComponents: [
    GestionarMisionalidadComponent,
    GestionarSeguimientoComponent,
    VincularRadicadoPeticionarioComponent,
    GestionarPkVinculadosComponent,
    AsignarSeguimientoComponent,
    AsignarMisionalidadOtrosComponent,
    MantenimientoViewComponent,
    FactoresComponent,
    FotosComponent,
    FactoresEditComponent,
    MuestreosComponent,
    MuestreosEditComponent,
    FallasComponent,
    FallasEditComponent,
    RadicadoSalidaComponent,
    ImportarSeleccionPksComponent,
    ImportarDisponibilidadPersonaComponent,
    ImportarDisponibilidadEquipoComponent,
    ImportarDisponibilidadLugarComponent,
    AutoprogramarVisitaDiagnosticoComponent,
    ProgramarVisitaDiagnosticoComponent,
    PriorizarIntervencionComponent,
    ValidarPriorizacionComponent,
    CargarEstudioDisenioComponent,
    GestionarReservaComponent,
    EditarDisenioComponent,
    VerDisenioComponent,
    CreateDisenioComponent,
    ValidarDisenioComponent,
    VerFuentesInformacionComponent,
    ProgramarVisitaVerificacionComponent,
    ConsolidadoVisitaTecnicaComponent,
    EditarVerificacionComponent,
    GestionarVisitaDisenioComponent,
    RadicadoEntradaComponent,
    EditarVisitaPreDisenioComponent,
    VerVisitaPreDisenioComponent,
    CreateVisitaPreDisenioComponent,
    ValidarVisitaPreDisenioComponent,
    EditarFichaCierreIntervencionComponent,
    DetailEquipoComponent,
    EditarActasVecindadComponent,
    VerActasVecindadComponent,
    AprobarActasVecindadComponent,
    AsignarVisitaPredisenioComponent,
    ProgramarVisitaAsignarVehiculoComponent,
    EditarResultadosDensidadesCampoComponent,
    EditarResultadosExtraccionNucleoComponent,
    EditarResultadosMaterialesGranularesComponent,
    EditarControlesCalidadRealizadosMezclaProducidaPlantaComponent,
    EditarResultadosApiquesComponent,
    EditarResultadosAforosComponent,
    RadicadoSalidaReservaComponent,
    ApiquesAforosComponent,
    RegistrarResultadoApiqueComponent,
    UbicarApiqueComponent,
    RegistrarVisitaDiagnosticoComponent,
    ActualizarVisitaDiagnosticoComponent,
    RevisarVisitaDiagnosticoComponent,
    ValidarVisitaDiagnosticoComponent,
    CargueResultadosLaboratorioComponent,
    MantenimientoDocumentoComponent,
    ResultadosSolicitudesApiquesComponent,
    ArchivosMantenimientoComponent,
    EditarVisitaTecnicaVerificacionComponent,
    ResultadosSolicitudesAforosComponent,
    SolicitarApiqueAforoComponent,
    PriorizarSolicitudesApiquesComponent,
    GestionarSolicitudesSmvlActualizacionRemisionOtrasComponent,
    RegistrarProgramacionPeriodicaComponent,
    SolicitudPmtComponent,
    RegistrarResultadoAforoComponent,
    ConsultarTableroControlInformacionSIG,
    GestionarAsignacionResidentesAmbientalesComponent,
    FotoDiagnosticoPkComponent,
    ConsultarInformacionSIGComponent,
    AsignarResidenteSocialComponent,
    GenerarFichaCierreComponent,
    RegistrarDisenioComponent,
    RevisarDisenioComponent,
    ActualizarDisenioComponent,
    RegistrarPreDisenioComponent,
    RevisarPreDisenioComponent,
    ActualizarPreDisenioComponent,
    ValidarPreDisenioComponent,
    GestionarResidentesSSTComponent,
    RegistrarChequeoSSTComponent,
    RegistrarChequeoAmbientalComponent,
    RegistrarBaniosPortatilesComponent,
    RealizarInventarioElementosAmbientalesComponent,
    RegistrarInspeccionAmbientalComponent,
    ConsolidadoDiarioTrabajoComponent,
    ProgramarPersonalPlantaComponent,
    RegistrarMezclaInsumosComponent,
    RegistrarCierreAmbientalComponent,
    RegistrarEncuestasSatisfaccionComponent,
    ViewFormPmtComponent,
    RegistroProgramacionDiariaTrabajoComponent,
    RegistrarActaVecindadVolanteComponent,
    MantenimientosSeleccionadosComponent,
    MantenimientosSeleccionadosAmbientalComponent,
    MantenimientosSeleccionadosSstComponent,
    AsignarMaquinariaDisponibleComponent,
    AsignarMaquinariaAdminComponent,
    ImportarGrupoComponent,
    CargaDeArchivoComponent,
    SigmaChartTableroControlSigComponent,
    ConsultarConsolidadoAmbientalComponent,
    FiltrosComponent,
    RegistroDiarioTrabajoCuadrillaComponent,
    RegistrarGestionSocialAdelantadaComponent,
    SolicitudesProgramacionMezclaListComponent,
    ProgramarListComponent,
    ProgramarDetalleListComponent,
    ConfirmCapacidadComponent,
    EncuestaSatisfaccionCreateComponent,
    EncuestaSatisfaccionListComponent,
    EncuestaSatisfaccionEditComponent,
    EncuestaSatisfaccionAttachComponent,
    ConfirmacionComponent,
    ImportarPksGrupoComponent,
    AprobarActasListComponent,
    AprobarActasAproveComponent,
    RegistrarActasVecindadComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    PipesModule,
    SharedModule,
    DiagnosticoModule,
    WorkflowRoutingModule,
    DisenioModule,
    PredisenioModule,
    SeguridadModule,
    VisitatecnicaverificacionModule,
    CargueResultadosLaboratorioModule,
    SeguridadModule,
    IntervencionModule,
    DisenioInformacionModule,
    GestionAmbientalModule,
    GestionSocialModule,
    AsignarMaquinariaDisponibleASolicitudesModule,
    RegistrarActaVecindadVolanteModule,
    MatSidenavModule,
    MatTreeModule,
    CdkTreeModule,
    RegistroDiarioTrabajoCuadrillaModule,
    GestionSocialAdelantadaModule,
    ProduccionMezclaModule,
    EncuestaSatisfaccionModule,
    ActasVecindadModule
  ],
  exports: [
    ActividadViewerComponent,
    FormularioViewerComponent,
    FactoresComponent,
    FotosComponent,
    FactoresEditComponent,
    MuestreosComponent,
    MuestreosEditComponent,
    FallasComponent,
    FallasEditComponent,
    RadicadoSalidaComponent,
    RadicadoEntradaComponent,
    RadicadoSalidaReservaComponent,
    RegistrarProgramacionPeriodicaComponent,
    AsignarResidenteSocialComponent,
    RegistrarActaVecindadVolanteComponent
  ]
})
export class WorkflowModule { }
