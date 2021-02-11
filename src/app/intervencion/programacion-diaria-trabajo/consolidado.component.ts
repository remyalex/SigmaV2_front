import { Zona } from 'src/app/administracion/ubicaciones/zona/models/zona.model';
import { PersonaService } from './../../administracion/persona/services/persona.service';
import { UtilitiesService } from './../../shared/services/utilities.service';
import { forEach } from '@angular/router/src/utils/collection';
import { PdfService } from './../../shared/services/pdf.service';
import { Router } from '@angular/router';
import { Intervencion } from './../models/intervencionModel.model';
import { SolicitudMezclaDetalle } from './../../produccion/produccion-mezcla/models/solicitud-mezcla-detalle.model';
import { Component, OnInit, ViewChild } from '@angular/core'
import { CONST_CONSOLIDADO_PROGRAMACION_DIARIA_TRABAJO } from './consolidado.constant';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { MapService } from 'src/app/shared/services/map.service';
// tslint:disable-next-line: max-line-length
import { ProgramacionDiariaTrabajoService } from 'src/app/workflow/forms/intervencion/registro-programacion-diaria-trabajo/programacion-diaria-trabajo.service';
import { FormDef, ObjectFormComponent } from 'src/app/shared/component/sg-object-form/sg-object-form.component';
import { Utils, Ref, Stream } from 'src/app/shared/utils/global-functions';
import { TableDef, TableColumnDef, ArrayTableComponent } from 'src/app/shared/component/sg-array-table/sg-array-table.component';
import { ListasService } from 'src/app/administracion/listas/services/listas.service';
import { Lista } from 'src/app/administracion/listas/models/lista.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
// tslint:disable-next-line: max-line-length
import { ProgramacionDiariaTrabajo } from 'src/app/workflow/forms/intervencion/registro-programacion-diaria-trabajo/programacion-diaria-trabajo.model';
// tslint:disable-next-line: max-line-length
import { ProgramacionDiariaTrabajoCriteria } from 'src/app/workflow/forms/intervencion/registro-programacion-diaria-trabajo/programacion-diaria-trabajo.criteria';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { SolicitudMezcla } from 'src/app/produccion/mezcla/solicitud-mezcla.model';
import { SolicitudMezclaMaterial } from 'src/app/produccion/mezcla/solicitud-mezcla-material.model';
import { ZonaService } from 'src/app/administracion/ubicaciones/zona/services/zona.service';
import { BarrioService } from 'src/app/administracion/ubicaciones/barrio/services/barrio.service';
import { LocalidadService } from 'src/app/administracion/ubicaciones/localidad/services/localidad.service';
// tslint:disable-next-line: max-line-length
import { ProgramacionDiariaTrabajoMaterial } from 'src/app/workflow/forms/intervencion/registro-programacion-diaria-trabajo/programacion-diaria-trabajo-material.model';
import { SolicitudMezclaService } from '../../produccion/mezcla/solicitud-mezcla.service';
import { WorkflowMantenimientoModel } from '../../workflow/models/workflow-mantenimiento.model';
import { GridMantenimientosComponent } from '../../shared/component/grid-mantenimientos/grid-mantenimientos.component';
import { WorkflowMantenimientoActividadModel } from '../../workflow/models/workflow-mantenimiento-actividad.model';
import { WorkflowService } from '../../workflow/services/workflow-service.service';
import { SolicitudMezclaVale } from 'src/app/produccion/mezcla/solicitud-mezcla-vale.model';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { SolicitudMezclaCriteria } from 'src/app/produccion/mezcla/solicitud-mezcla-criteria.model';
import { from } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';

/**
 * Componente mediante el cual se selecciona un mantenimiento y captura la información
 * correspondiente al consolidado de programación diaria de trabajo. 
 * 
 * @author acpreda
 */
@Component({
    selector: 'sigma-con-prog-diaria-trabajo-list',
    templateUrl: './consolidado.component.html'
})
export class ConProgDiariaTrabajoListComponent implements OnInit {

    /**
     * Constantes del componente
     */
    public constants = CONST_CONSOLIDADO_PROGRAMACION_DIARIA_TRABAJO;

    /**
     * Resultados de la consulta
     */
    resultados: ProgramacionDiariaTrabajo[];

     /**
     * Resultados de la consulta para exportacion
     */
    resultadosExport: ProgramacionDiariaTrabajo[];

    /**
     * Totales por tipo de material
     */
    totalesMaterial: any[];
    loader: Boolean = false;
    data: any;
    transicionesMasivas = [];
    transicionesIndividuales = [];
    readyMantenimientos = false;
    mantenimientos: WorkflowMantenimientoModel[] = [];
    mantenimientosExport: WorkflowMantenimientoModel[] = [];
    transicionesIndividualAuto = [];
    tipoMaterialIgual = true;
    fechaIgual = true;
    JornadaIgual = true;
    algunoPasoConsolidado = false;
    siguienteTransicion = false;
    showResultados = false;
    showResultadosExport = false;
    criterio: ListaItem;
    jornadaComparar: ListaItem = null;
    fechaComparar = null;
    tipoMaterialComparar: ListaItem = null;
    utilitiesServices: UtilitiesService = null;
    anteriorZona: Zona = null;

    /**
     * Constructor del componente en el que se reciben todos los servicios y componentes
     * de los cuales se requiere para su funcionamiento.
     * @param formBuilder Constructor de formularios de Angular
     * @param mapService El servicio de mapas que se usa para hacer la presentación
     */
    constructor(
        formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private mapService: MapService,
        private service: ProgramacionDiariaTrabajoService,
        private listaService: ListasService,
        private localidadService: LocalidadService,
        private personasService: PersonaService,
        private barrioService: BarrioService,
        private excelService: ExcelService,
        private pdfService: PdfService,
        private solicitudMezclaService: SolicitudMezclaService,
        private dialog: MatDialog,
        private router: Router,
        private workflowService: WorkflowService) {
            this.utilitiesServices = new UtilitiesService();
    }


    /**
     * Se ejecuta cuando el componente se inicia
     */
    ngOnInit(): void {
        this.loadMantenimientoActividad();
        const comp = this;
        comp.buildColumns();

        this.personasService.getPersonasByRol('DIRECTOR DE OBRA').subscribe(
            data => { comp.criteriosFormDef.fields
                .filter(x => x.name == 'directorObra')
                .forEach(x => {
                    if (!x.options) {
                        x.options = {};
                    }
                    x.options.options = data;
                    x.options.currentOptions = data;
                });
            }
        );

        this.localidadService.list().subscribe(
            data => { comp.criteriosFormDef.fields
                .filter(x => x.name == 'localidad')
                .forEach(x => {
                    if (!x.options) {
                        x.options = {};
                    }
                    x.options.options = data;
                    x.options.currentOptions = data;
                });
            }
        );
        this.barrioService.list().subscribe(
            data => comp.criteriosFormDef.fields
                .filter(x => x.name == 'barrio')
                .forEach(x => {
                    if (!x.options) {
                        x.options = {};
                    }
                    x.options.options = data;
                    x.options.currentOptions = data;
                })
        );
    }

    ngAfterViewInit(): void {
        const comp = this;
        comp.buildColumns();
    }

    loadMantenimientoActividad() {
        const procesoUrl = 'intervencion';
        const actividadUrl = 'consolidado-trabajo-diario';

        // tslint:disable-next-line: max-line-length
        this.solicitudMezclaService._getMantenimientoActividad(procesoUrl, actividadUrl).subscribe(mantenimientoActividad => {
            this.data = mantenimientoActividad;
            this.transicionesIndividualAuto = this.data.actividad.transiciones;
        });
    }

    // --------------------- FORMULARIO DE CRITERIOS
    criteriosFormDef: FormDef = {
        title: "Criterios de búsqueda",
        fields: [
            {
                name: "criterio", label: "Criterio", type: "select",
                options: {
                    path: "/api/administracion/lista/CRITERIOS_CONS_PROG_DIARIA_TRABAJO/items",
                    listBy: "descripcion",
                    required: true
                }
            },
            { name: "fechaProgramacion", label: "Fecha de programación diaria ", type: "calendar" },
            {
                name: "jornada", label: "Jornada", type: "select",
                options: { path: "/api/administracion/lista/ADMINISTRACION_DISPONIBILIDAD_TURNO/items", listBy: "descripcion" }
            },
            {
                name: "zona", label: "Zona", type: "select",
                options: { path: "/api/administracion/ubicaciones/zona", listBy: "nombre" }
            },
            {
                name: "localidad", label: "Localidad", type: "select",
                options: { listBy: "nombre" }
            },
            {
                name: "barrio", label: "Barrio", type: "select",
                options: { listBy: "nombre" }
            },
            { name: "pk", label: "PK" },
            { name: "civ", label: "CIV" },
            { 
                name: "directorObra", label: "Director obra", type: "select",
                options: {
                    // path: "/api/administracion/persona/personaByRol?rol=DIRECTOR DE OBRA",
                    multiple: "true",
                    opcionTodos: "true",
                    listBy: 'nombresYapellidos',
                    required: true
                }
            },
            { name: "ingenieroResidente", label: "Ingeniero residente" , type: "select",
                options: {
                    path: "/api/administracion/persona/personaByRol?rol=INGENIERO RESIDENTE",
                    multiple: "true",
                    opcionTodos: "true",
                    listBy: 'nombresYapellidos',
                    required: true
                }
            },
            { name: "ingenieroApoyo", label: "Ingeniero apoyo" , type: "select",
                options: {
                    path: "/api/administracion/persona/personaByRol?rol=INGENIERO APOYO",
                    multiple: "true",
                    opcionTodos: "true",
                    listBy: 'nombresYapellidos',
                    required: true
                }
            },
            {
                name: "estrategia", label: "Estrategia de intervención", type: "select",
                options: { 
                    path: "/api/administracion/lista/TAB_MANTENIMIENTO_VIAL_ID_TIPO_ESTRATEGIA/items",
                    multiple: "true",
                    opcionTodos: "true",
                    listBy: "descripcion",
                    required: true
                }
            },
            {
                name: "tipoIntervencion", label: "Tipo de intervención", type: "select",
                options: {
                    path: "/api/administracion/lista/getItemsFiltroActividadAgrupada",
                    multiple: "true",
                    opcionTodos: "true",
                    listBy: "valor",
                    required: true
                }
            },
            { name: "actividad", label: "Actividad" , type: "select",
                options: {
                    path: "/api/administracion/lista/getItemsFiltroActividadAgrupada", 
                    multiple: "true",
                    opcionTodos: "true",
                    listBy: "valor",
                    required: true
                }
            },
            {
                name: "tipoMaquinaria", label: "Tipo de maquinaria", type: "select",
                options: {
                    multiple: "true",
                    opcionTodos: "true",
                    path: "/api/administracion/lista/TIPO_MAQUINARIA/items",
                    listBy: "descripcion",
                    required: true
                }
            },
            {
                name: "origenMezcla", label: "Origen de la mezcla", type: "select",
                options: {
                    multiple: "true",
                    required: true,
                    opcionTodos: "true",
                    path: "/api/administracion/lista/PRODUCCION_ORIGEN_MEZCLA/items",
                    listBy: "descripcion" 
                }
            },
            {
                name: "tipoMaterial", label: "Tipo de material", type: "select",
                options: {
                    multiple: "true",
                    opcionTodos: "true",
                    path: "/api/administracion/lista/TIPO_MATERIAL/items",
                    listBy: "descripcion",
                    required: true
                }
            },
            {
                name: "claseMaterial", label: "Clase de material", type: "select",
                options: {
                    multiple: "true",
                    opcionTodos: "true",
                    path: "/api/administracion/lista/CLASE_MATERIAL/items",
                    listBy: "descripcion",
                    required: true
                }
            },
            {
                name: "inspector", label: "Inspector", type: "select",
                options: {
                    multiple: "true",
                    opcionTodos: "true",
                    path: "/api/administracion/lista/INSPECTOR/items",
                    listBy: "descripcion",
                    required: true
                }
            },
        ],
        onValueChanges: form => {
            const fg = form.formGroup;
            const zona = fg.get("zona");
            const localidad = fg.get("localidad");
            const barrio = fg.get("barrio");
            const directorObra = fg.get("directorObra");

            localidad.enable({ emitEvent: false });
            barrio.enable({ emitEvent: false });
            
            if (zona.value != null && zona.value != "") {
                if (this.anteriorZona === null || this.anteriorZona.id !== zona.value.id) {
                    form.def.fields
                    .filter(x => x.name == "directorObra")
                    .forEach(x => {
                        let org = x.options.options;
                        let filtered = org.filter(y => y.usuario != null && y.usuario.zona != null && y.usuario.zona.id == zona.value.id);
                        x.options.currentOptions = filtered;
                        directorObra.setValue(filtered, { emitEvent: false });
                    });

                    this.anteriorZona = zona.value;
                }

                form.def.fields
                    .filter(x => x.name == "localidad")
                    .forEach(x => {
                        let org = x.options.options;
                        let filtered = org.filter(y => y.zona != null && y.zona.id == zona.value.id);
                        x.options.currentOptions = filtered;
                        let notPresent = filtered
                            .filter(y => localidad.value != null && y.id == localidad.value.id)
                            .length == 0;
                        if (notPresent) {
                            localidad.setValue("", { emitEvent: false });
                        }
                    });

            } else {
                if (form.def.fields.filter(x => x.name == "localidad")
                .map( m => m.options.options)[0] != undefined) {
                        form.def.fields
                        .filter(x => x.name == "localidad")
                        .forEach(x => {
                            let org = x.options.options;
                            let filtered = org.filter(y => y.zona != null);
                            x.options.currentOptions = filtered;
                            let notPresent = filtered
                                .filter(y => localidad.value != null && y.id == localidad.value.id)
                                .length == 0;
                            if (notPresent) {
                                localidad.setValue("", { emitEvent: false });
                            }
                        });
                }

                if (this.anteriorZona !== null && zona.value === '') {
                    form.def.fields
                    .filter(x => x.name == "directorObra")
                    .forEach(x => {
                        let org = x.options.options;
                        x.options.currentOptions = org;
                        directorObra.setValue(org, { emitEvent: false });
                    });

                    this.anteriorZona = zona.value;
                }
            }

            if (localidad.value != null && localidad.value != "") {
                form.def.fields
                    .filter(x => x.name == "barrio")
                    .forEach(x => {
                        let org = x.options.options;
                        let filtered = org.filter(y => y.localidades != null && y.localidades.length != 0 && y.localidades[0].id == localidad.value.id);
                        x.options.currentOptions = filtered;
                        let notPresent = filtered
                            .filter(y => barrio.value != null && y.id == barrio.value.id)
                            .length == 0;
                        if (notPresent) {
                            barrio.setValue("", { emitEvent: false });
                        }
                    });
            } else {
                if (form.def.fields.filter(x => x.name == "barrio")
                .map( m => m.options.options)[0] != undefined) {
                    form.def.fields
                    .filter(x => x.name == "barrio")
                    .forEach(x => {
                        let org = x.options.options;
                        let filtered = org.filter(y => y.localidades != null && y.localidades.length != 0 );
                        x.options.currentOptions = filtered;
                        let notPresent = filtered
                            .filter(y => barrio.value != null && y.id == barrio.value.id)
                            .length == 0;
                        if (notPresent) {
                            barrio.setValue("", { emitEvent: false });
                        }
                    });
                }
            }
        }
    }

    resultadosTableDef: TableDef = {
        title: "Resultados de búsqueda",
        newElementFn: () => { },
        columns: [
            { name: "pk", label: "PK" , property: null },
            { name: "fechaProgramacion", label: "Fecha de programación" , property: null },
            { name: "jornada", label: "Jornada" , property: null },
            { name: "zona", label: "Zona" , property: null },
            { name: "localidad", label: "Localidad" , property: null },
            { name: "barrio", label: "Barrio" , property: null },
            { name: "civ", label: "CIV" , property: null },
            { name: "ejeVial", label: "Dirección (Vía)" , property: null },
            { name: "ejeVialDesde", label: "Dirección (Desde)" , property: null },
            { name: "ejeVialHasta", label: "Dirección (Hasta)" , property: null },
            { name: "directorObra", label: "Director obra" , property: null },
            { name: "directorObraTelefono", label: "Teléfono Director de obra" , property: null },
            { name: "residenteObra", label: "Ingeniero residente" , property: null },
            { name: "residenteObraTelefono", label: "Teléfono Ingeniero residente" , property: null },
            { name: "ingenieroApoyo", label: "Ingeniero de apoyo" , property: null },
            { name: "ingenieroApoyoTelefono", label: "Teléfono Ingeniero de apoyo" , property: null },
            { name: "inspector", label: "Inspector" , property: null },
            { name: "estrategia", label: "Estrategia de intervención" , property: null },
            { name: "tipoIntervencion", label: "Tipo de intervención" , property: null },
            { name: "actividad", label: "Actividad" , property: null },
        ],
    }

    resultadosExtTableDef: TableDef = {
        title: "Resultados de búsqueda",
        newElementFn: () => { },
        columns: [
            { name: "pk", label: "PK" , property: null },
            { name: "fechaProgramacion", label: "Fecha de programación" , property: null },
            { name: "jornada", label: "Jornada" , property: null },
            { name: "zona", label: "Zona" , property: null },
            { name: "localidad", label: "Localidad" , property: null },
            { name: "barrio", label: "Barrio" , property: null },
            { name: "civ", label: "CIV" , property: null },
            { name: "ejeVial", label: "Dirección (Vía)" , property: null },
            { name: "ejeVialDesde", label: "Dirección (Desde)" , property: null },
            { name: "ejeVialHasta", label: "Dirección (Hasta)" , property: null },
            { name: "directorObra", label: "Director obra" , property: null },
            { name: "directorObraTelefono", label: "Teléfono Director de obra" , property: null },
            { name: "residenteObra", label: "Ingeniero residente" , property: null },
            { name: "residenteObraTelefono", label: "Teléfono Ingeniero residente" , property: null },
            { name: "ingenieroApoyo", label: "Ingeniero de apoyo" , property: null },
            { name: "ingenieroApoyoTelefono", label: "Teléfono Ingeniero de apoyo" , property: null },
            { name: "inspector", label: "Inspector" , property: null },
            { name: "estrategia", label: "Estrategia de intervención" , property: null },
            { name: "tipoIntervencion", label: "Tipo de intervención" , property: null },
            { name: "actividad", label: "Actividad" , property: null },
        ],
    }

    resultadosExExportacionTableDef: TableDef = {
        title: "Resultados de búsqueda",
        newElementFn: () => { },
        columns: [
            { name: "fechaProgramacion", label: "Fecha de programación", property: null },
            { name: "jornada", label: "Jornada", property: null },
            { name: "zona", label: "Zona" , property: null},
            { name: "localidad", label: "Localidad", property: null },
            { name: "barrio", label: "Barrio" , property: null},
            { name: "civ", label: "CIV", property: null },
            { name: "pk", label: "PK" , property: null},
            { name: "ejeVial", label: "Dirección (Vía)", property: null },
            { name: "ejeVialDesde", label: "Dirección (Desde)", property: null },
            { name: "ejeVialHasta", label: "Dirección (Hasta)", property: null },
            { name: "directorObra", label: "Director obra", property: null },
            { name: "directorObraTelefono", label: "Teléfono Director de obra", property: null },
            { name: "residenteObra", label: "Ingeniero residente", property: null },
            { name: "residenteObraTelefono", label: "Teléfono Ingeniero residente", property: null },
            { name: "ingenieroApoyo", label: "Ingeniero de apoyo", property: null },
            { name: "ingenieroApoyoTelefono", label: "Teléfono Ingeniero de apoyo", property: null },
            { name: "estrategia", label: "Estrategia de intervención", property: null },
            { name: "tipoIntervencion", label: "Tipo de intervención", property: null },
            { name: "actividad", label: "Actividad" , property: null},
            { name: 'personalContratoOficiales', label: 'PERSONAL DE CONTRATO (OFICIAL)', property: null },
            { name: 'personalContratoAuxiliares', label: 'PERSONAL DE CONTRATO (AUXILIARES TRÁFICO)' , property: null},
            { name: 'personalContratoTrabajadores', label: 'PERSONAL DE CONTRATO (TRABAJADORES)', property: null },
            { name: 'personalContratoConductores', label: 'PERSONAL DE CONTRATO (CONDUCTORES)', property: null },
            { name: 'personalEntidadOficiales', label: 'PERSONAL ENTIDAD (OFICIAL)', property: null },
            { name: 'personalEntidadConductores', label: 'PERSONAL ENTIDAD (CONDUCTORES)', property: null },
            { name: 'personalEntidadTrabajadores', label: 'PERSONAL ENTIDAD (TRABAJADORES)', property: null },
            { name: 'inspectorCuadrilla1', label: 'INSPECTOR DE CUADRILLA 1', property: null },
            { name: 'inspectorCuadrilla2', label: 'INSPECTOR DE CUADRILLA 2', property: null },
            { name: 'inspectorCuadrilla3', label: 'INSPECTOR DE CUADRILLA 3', property: null },
            { name: 'maquinariaSelladoraFisuras', label: 'MAQUINARIA -SELLADORA DE FISURAS', property: null },
            { name: 'horaMaquinariaSelladoraFisuras', label: 'HORA MAQUINARIA -SELLADORA DE FISURAS', property: null },
            { name: 'maquinariaMezcadora', label: 'MAQUINARIA -MEZCLADORA', property: null },
            { name: 'horaMaquinariaMezcadora', label: 'HORA MAQUINARIA -MEZCLADORA', property: null },
            { name: 'maquinariaCanguro', label: 'MAQUINARIA -CANGURO', property: null },
            { name: 'horaMaquinariaCanguro', label: 'HORA MAQUINARIA -CANGURO', property: null },
            { name: 'maquinariaCortadoraPAV', label: 'MAQUINARIA -CORTADORA PAV', property: null },
            { name: 'horaMaquinariaCortadoraPAV', label: 'HORA MAQUINARIA -CORTADORA PAV', property: null },
            { name: 'maquinariaVolquetas', label: 'MAQUINARIA -VOLQUETAS', property: null },
            { name: 'horaMaquinariaVolquetas', label: 'HORA MAQUINARIA -VOLQUETAS', property: null },
            { name: 'maquinariaCarroTanque', label: 'MAQUINARIA -CARROTANQUE', property: null },
            { name: 'horaMaquinariaCarroTanque', label: 'HORA MAQUINARIA -CARROTANQUE', property: null },
            { name: 'maquinariaIrrigador', label: 'MAQUINARIA -IRRIGADOR', property: null },
            { name: 'horaMaquinariaIrrigador', label: 'HORA MAQUINARIA -IRRIGADOR', property: null },
            { name: 'maquinariaPavimentadora', label: 'MAQUINARIA -PAVIMENTADORAS', property: null },
            { name: 'horaMaquinariaPavimentadora', label: 'HORA MAQUINARIA -PAVIMENTADORAS', property: null },
            { name: 'maquinariaRetroExcavadora', label: 'MAQUINARIA - RETRO EXCAVADORAS', property: null },
            { name: 'horaMaquinariaRetroExcavadora', label: 'HORA MAQUINARIA -RETRO EXCAVADORAS', property: null },
            { name: 'maquinariaCompactadorNeumatico', label: 'MAQUINARIA -COMPACTADOR NEUMÁTICO', property: null },
            { name: 'horaMaquinariaCompactadorNeumatico', label: 'HORA MAQUINARIA -COMPACTADOR NEUMÁTICO', property: null },
            { name: 'maquinariaCilindro', label: 'MAQUINARIA -CILINDRO', property: null },
            { name: 'horaMaquinariaCilindro', label: 'HORA MAQUINARIA -CILINDRO', property: null },
            { name: 'maquinariaCompresor', label: 'MAQUINARIA -COMPRESOR', property: null },
            { name: 'horaMaquinariaCompresor', label: 'HORA MAQUINARIA -COMPRESOR', property: null },
            { name: 'maquinariaMiniCargador', label: 'MAQUINARIA - MINI CARGADOR', property: null },
            { name: 'horaMaquinariaMiniCargador', label: 'HORA MAQUINARIA - MINI CARGADOR', property: null },
            { name: 'maquinariaMotoNiveladora', label: 'MAQUINARIA -MOTO NIVELADORA', property: null },
            { name: 'horaMaquinariaMotoNiveladora', label: 'HORA MAQUINARIA - MOTO NIVELADORA', property: null },
            { name: 'maquinariaMixer', label: 'MAQUINARIA -MIXER', property: null },
            { name: 'horaMaquinariaMixer', label: 'HORA MAQUINARIA -MIXER', property: null },
            { name: 'maquinariaCargadorFrontal', label: 'MAQUINARIA -CARGADOR FRONTAL', property: null },
            { name: 'horaMaquinariaCargadorFrontal', label: 'HORA MAQUINARIA -CARGADOR FRONTAL', property: null },
            { name: 'maquinariaRecicladora', label: 'MAQUINARIA -RECICLADORA', property: null },
            { name: 'horaMaquinariaRecicladora', label: 'HORA MAQUINARIA -RECICLADORA', property: null },
            { name: 'maquinariaCamiones', label: 'MAQUINARIA -CAMIONES', property: null },
            { name: 'horaMaquinariaCamiones', label: 'HORA MAQUINARIA -CAMIONES', property: null },
            { name: 'maquinariaFresadora', label: 'MAQUINARIA -FRESADORA', property: null },
            { name: 'horaMaquinariaFresadora', label: 'HORA MAQUINARIA -FRESADORA', property: null },
            { name: 'maquinariaCortadora', label: 'MAQUINARIA -CORTADORA', property: null },
            { name: 'horaMaquinariaCortadora', label: 'HORA MAQUINARIA -CORTADORA', property: null },
            { name: 'maquinariaPlanchaVibratoria', label: 'MAQUINARIA -PLANCHA VIBRATORIA', property: null },
            { name: 'horaMaquinariaPlanchaVibratoria', label: 'HORA MAQUINARIA -PLANCHA VIBRATORIA', property: null },
            { name: 'maquinariaGruaPlanchon', label: 'MAQUINARIA - GRUA PLANCHON', property: null },
            { name: 'horaMaquinariaGruaPlanchon', label: 'HORA MAQUINARIA -GRUA PLANCHON', property: null },
            { name: 'mezclaAsfalticaM10Contrato', label: 'MEZCLA - MEZCLA ASFÁLTICA MD-10 – ORIGEN POR CONTRATO', property: null },
            { name: 'horaMezclaAsfalticaM10Contrato', label: 'HORA MEZCLA - MEZCLA ASFÁLTICA MD-10 ORIGEN POR CONTRATO', property: null },
            { name: 'mezclaAsfalticaM12Contrato', label: 'MEZCLA - MEZCLA ASFÁLTICA MD-12 -ORIGEN POR CONTRATO', property: null },
            { name: 'horaMezclaAsfalticaM12Contrato', label: 'HORA MEZCLA - MEZCLA ASFÁLTICA MD-12 -ORIGEN POR CONTRATO', property: null },
            { name: 'mezclaAsfalticaM20Contrato', label: 'MEZCLA - MEZCLA ASFÁLTICA MD-20 -ORIGEN POR CONTRATO', property: null },
            { name: 'horaMezclaAsfalticaM20Contrato', label: 'HORA MEZCLA - MEZCLA ASFÁLTICA MD-20 -ORIGEN POR CONTRATO', property: null },
            { name: 'mezclaAsfalticaMGCRTipo1Contrato', label: 'MEZCLA - MEZCLA ASFÁLTICA MGCR TIPO I -ORIGEN POR CONTRATO', property: null },
            { name: 'horaMezclaAsfalticaMGCRTipo1Contrato', label: 'HORA MEZCLA - MEZCLA ASFÁLTICA MGCR TIPO I -ORIGEN POR CONTRATO', property: null },
            { name: 'mezclaAsfalticaM10Esmeralda', label: 'MEZCLA - MEZCLA ASFÁLTICA MD-10 ORIGEN LA ESMERALDA', property: null },
            { name: 'horaMezclaAsfalticaM10Esmeralda', label: 'HORA MEZCLA - MEZCLA ASFÁLTICA MD-10 ORIGEN LA ESMERALDA', property: null },
            { name: 'mezclaAsfalticaM12Esmeralda', label: 'MEZCLA - MEZCLA ASFÁLTICA MD-12 -ORIGEN LA ESMERALDA', property: null },
            { name: 'horaMezclaAsfalticaM12Esmeralda', label: 'HORA MEZCLA - MEZCLA ASFÁLTICA MD-12 -ORIGEN LA ESMERALDA', property: null },
            { name: 'mezclaAsfalticaM20Esmeralda', label: 'MEZCLA - MEZCLA ASFÁLTICA MD-20 -ORIGEN LA ESMERALDA', property: null },
            { name: 'horaMezclaAsfalticaM20Esmeralda', label: 'HORA MEZCLA - MEZCLA ASFÁLTICA MD-20 -ORIGEN LA ESMERALDA', property: null },
            { name: 'mezclaAsfalticaMGCRTipo1Esmeralda', label: 'MEZCLA - MEZCLA ASFÁLTICA MGCR TIPO I -ORIGEN LA ESMERALDA', property: null },
            { name: 'horaMezclaAsfalticaMGCRTipo1Esmeralda', label: 'HORA MEZCLA - MEZCLA ASFÁLTICA MGCR TIPO I -ORIGEN LA ESMERALDA', property: null },
            { name: 'concretoMR43Esmeralda', label: 'CONCRETO - CONCRETO MR-43 -ORIGEN LA ESMERALDA', property: null },
            { name: 'horaConcretoMR43Esmeralda', label: 'HORA CONCRETO - CONCRETO MR-43 -ORIGEN LA ESMERALDA', property: null },
            { name: 'concreto3000PSIEsmeralda', label: 'CONCRETO - CONCRETO 3000 PSI -ORIGEN LA ESMERALDA', property: null },
            { name: 'horaConcreto3000PSIEsmeralda', label: 'HORA CONCRETO - CONCRETO 3000 PSI -ORIGEN LA ESMERALDA', property: null },
            { name: 'concreto3500PSIEsmeralda', label: 'CONCRETO - CONCRETO 3500 PSI -ORIGEN LA ESMERALDA', property: null },
            { name: 'horaConcreto3500PSIEsmeralda', label: 'HORA CONCRETO - CONCRETO 3500 PSI -ORIGEN LA ESMERALDA', property: null },
            { name: 'fresadoEstabilizado', label: 'FRESADO - FRESADO ESTABILIZADO', property: null },
            { name: 'horaFresadoEstabilizado', label: 'HORA FRESADO - FRESADO ESTABILIZADO', property: null },
            { name: 'fresadoEstabilizadoMDF20', label: 'FRESADO - FRESADO ESTABILIZADO MDF20', property: null },
            { name: 'horaFresadoEstabilizadoMDF20', label: 'HORA FRESADO - FRESADO ESTABILIZADO MDF20', property: null },
            { name: 'fresadoEstabilizadoRAP', label: 'FRESADO - FRESADO ESTABILIZADO (RAP)', property: null },
            { name: 'horaFresadoEstabilizadoRAP', label: 'HORA FRESADO - FRESADO ESTABILIZADO (RAP)', property: null },
            { name: 'pavimentoAsalticoRecicladoRAP', label: 'PAVIMENTO ASFÁLTICO RECICLADO - RAP', property: null },
            { name: 'horaPavimentoAsalticoRecicladoRAP', label: 'HORA PAVIMENTO ASFÁLTICO RECICLADO - RAP', property: null },
            { name: 'pavimentoAsalticoRecicladoRAPEstabilizado', label: 'PAVIMENTO ASFÁLTICO RECICLADO – RAP ESTABILIZADO', property: null },
            { name: 'horaPavimentoAsalticoRecicladoRAPEstabilizado', label: 'HORA PAVIMENTO ASFÁLTICO RECICLADO – RAP ESTABILIZADO', property: null },
            { name: 'emulsionCRR', label: 'EMULSIÓN - EMULSION CRR (CATIÓNICA ROMPIMIENTO RÁPIDO)', property: null },
            { name: 'horaEmulsionCRR', label: 'HORA EMULSIÓN -EMULSION CRR (CATIÓNICA ROMPIMIENTO RÁPIDO)', property: null },
            { name: 'emulsionCRL', label: 'EMULSIÓN - EMULSION CRL (CATIÓNICA ROMPIMIENTO LENTO)', property: null },
            { name: 'horaEmulsionCRL', label: 'HORA EMULSIÓN -EMULSION CRL (CATIÓNICA ROMPIMIENTO LENTO)', property: null },
            { name: 'subrazanteRetalConcreto', label: 'SUBRASANTE -RETAL CONCRETO', property: null },
            { name: 'horaSubrazanteRetalConcreto', label: 'HORA SUBRASANTE -RETAL CONCRETO', property: null },
            { name: 'subrazantePiedraRajon', label: 'SUBRASANTE -PIEDRA RAJÓN', property: null },
            { name: 'horaSubrazantePiedraRajon', label: 'HORA SUBRASANTE -PIEDRA RAJÓN', property: null },
            { name: 'subrazanteReceboComun', label: 'SUBRASANTE -RECEBO COMÚN', property: null },
            { name: 'horaSubrazanteReceboComun', label: 'HORA SUBRASANTE -RECEBO COMÚN', property: null },
            { name: 'subBaseGranularSBG_A', label: 'SUB-BASE GRANULAR -SBG A', property: null },
            { name: 'horaSubBaseGranularSBG_A', label: 'HORA SUB-BASE GRANULAR -SBG B', property: null },
            { name: 'subBaseGranularSBG_B', label: 'SUB-BASE GRANULAR - SBG B', property: null },
            { name: 'horaSubBaseGranularSBG_B', label: 'HORA SUB-BASE GRANULAR -SBG B', property: null },
            { name: 'subBaseGranularSBG_C', label: 'SUB-BASE GRANULAR -SBG C', property: null },
            { name: 'horaSubBaseGranularSBG_C', label: 'HORA SUB-BASE GRANULAR -SBG A', property: null },
            { name: 'baseGranularBGA', label: 'BASE GRANULAR -BG A', property: null },
            { name: 'horaBaseGranularBGA', label: 'HORA BASE GRANULAR -BG A', property: null },
            { name: 'baseGranularBGB', label: 'BASE GRANULAR -BG B', property: null },
            { name: 'horaBaseGranularBGB', label: 'HORA BASE GRANULAR -BG B', property: null },
            { name: 'baseGranularBGC', label: 'BASE GRANULAR -BG C', property: null },
            { name: 'horaBaseGranularBGC', label: 'HORA BASE GRANULAR - BG C', property: null },
            { name: 'petreosMixto', label: 'PETREOS -MIXTO', property: null },
            { name: 'horaPetreosMixto', label: 'HORA PETREOS - MIXTO', property: null },
            { name: 'petreosGrava', label: 'PETREOS -GRAVA', property: null },
            { name: 'horaPetreosGrava', label: 'HORA PETREOS - GRAVA', property: null },
            { name: 'petreosGrava34', label: 'PETREOS -GRAVA 3/4', property: null },
            { name: 'horaPetreosGrava34', label: 'HORA PETREOS – GRAVA 3/4', property: null },
            { name: 'petreosGravaMedia', label: 'PETREOS -GRAVA MEDIA', property: null },
            { name: 'horaPetreosGravaMedia', label: 'HORA PETREOS – GRAVA MEDIA', property: null },
            { name: 'petreosArenaRio', label: 'PETREOS -ARENAS RIO', property: null },
            { name: 'horaPetreosArenaRio', label: 'PETREOS -ARENAS RIO', property: null },
            { name: 'petreosArenaPena', label: 'PETREOS -ARENA PEÑA', property: null },
            { name: 'horaPetreosArenaPena', label: 'HORA PETREOS -ARENA PEÑA', property: null },
            { name: 'petreosRetalConcreto', label: 'PETREOS – RETAL CONCRETO', property: null },
            { name: 'horaPetreosRetalConcreto', label: 'HORA PETREOS -RETAL CONCRETO', property: null },
            { name: 'cemento', label: 'CEMENTO – CEMENTO', property: null },
            { name: 'horaCemento', label: 'HORA CEMENTO – CEMENTO', property: null },
            { name: 'equipoLuminaria1', label: 'EQUIPO LUMINARIA 1', property: null },
            { name: 'cantidadEquipoLuminaria1', label: 'CANTIDAD EQUIPO LUMINARIA 1', property: null },
            { name: 'equipoLuminaria2', label: 'EQUIPO LUMINARIA 2', property: null },
            { name: 'cantidadEquipoLuminaria2', label: 'CANTIDAD EQUIPO LUMINARIA 2', property: null },
            { name: 'equipoLuminaria3', label: 'EQUIPO LUMINARIA 3', property: null },
            { name: 'cantidadEquipoLuminaria3', label: 'CANTIDAD EQUIPO LUMINARIA 3', property: null },
        ],  
    }

    tipoMaterialTableDef: TableDef = {
        title: "Totales por tipo de material",
        newElementFn: () => { },
        columns: [
            { name: "tipoMaterial", label: "Tipo de material", property: null },
            { name: "claseMaterial", label: "Clase de material", property: null },
            { name: "cantidad", label: "Cantidad de material", property: null },
        ],
    }

    criteriosFormRef = new Ref<ObjectFormComponent>();
    @ViewChild("criteriosForm") set _criteriosForm(x: ObjectFormComponent) {
        this.criteriosFormRef.setReference(x);
    }

    resultadosTableRef = new Ref<ArrayTableComponent>();
    @ViewChild("resultadosTable") set _resultadosTable(x: ArrayTableComponent) {
        this.resultadosTableRef.setReference(x);
    }

    resultadosExtTableRef = new Ref<ArrayTableComponent>();
    @ViewChild("resultadosExtTable") set _resultadosExtTable(x: ArrayTableComponent) {
        this.resultadosExtTableRef.setReference(x);
    }

    tipoMaterialTableRef = new Ref<ArrayTableComponent>();
    @ViewChild("tipoMaterialTable") set _tipoMaterialTable(x: ArrayTableComponent) {
        this.tipoMaterialTableRef.setReference(x);
    }

    tipoPersonal: ListaItem[];
    tipoCuadrilla: ListaItem[];
    tipoMaquinaria: ListaItem[];
    tipoMaterial: ListaItem[];
    claseMaterial: ListaItem[];
    equipo: ListaItem[];

    buildColumns() {
        const comp = this;
        comp.listaService.listByNombre("TIPO_PERSONAL").subscribe(
            data => {
                comp.tipoPersonal = data;
                comp.buildColumnsIfComplete();
            }
        );

        comp.listaService.listByNombre("TIPO_CUADRILLA").subscribe(
            data => {
                comp.tipoCuadrilla = data;
                comp.buildColumnsIfComplete();
            }
        );

        comp.listaService.listByNombre("TIPO_MAQUINARIA").subscribe(
            data => {
                comp.tipoMaquinaria = data;
                comp.buildColumnsIfComplete();
            }
        );

        comp.listaService.listByNombre("TIPO_MATERIAL").subscribe(
            data => {
                comp.tipoMaterial = data;
                comp.buildColumnsIfComplete();
            }
        );

        comp.listaService.listByNombre("CLASE_MATERIAL").subscribe(
            data => {
                comp.claseMaterial = data;
                comp.buildColumnsIfComplete();
            }
        );

        comp.listaService.listByNombre("ADMINISTRACION_EQUIPO_TIPO_EQUIPO").subscribe(
            data => {
                comp.equipo = data;
                comp.buildColumnsIfComplete();
            }
        );
    }

    buildColumnsIfComplete(): void {

        const comp = this;

        if (!comp.tipoPersonal || !comp.tipoCuadrilla || !comp.tipoMaquinaria
            || !comp.tipoMaterial || !comp.claseMaterial || !comp.equipo) {
            return;
        }

        let columns = [];

        for (var i = 0; i < comp.tipoPersonal.length; i++) {
            for (var j = 0; j < comp.tipoCuadrilla.length; j++) {
                let label = comp.tipoPersonal[i].descripcion + " (" + comp.tipoCuadrilla[j].descripcion + ")";
                let name = "PE_" + comp.tipoPersonal[i].id + "_" + comp.tipoCuadrilla[j].id;
                let def = new TableColumnDef();
                def.label = label;
                def.name = name;
                columns.push(def);
            }
        }
        for (var i = 0; i < comp.tipoMaquinaria.length; i++) {
            let label = "MAQUINARIA - " + comp.tipoMaquinaria[i].descripcion;
            let name = "MA_" + comp.tipoMaquinaria[i].id;
            let def = new TableColumnDef();
            def.label = label;
            def.name = name;
            columns.push(def);
            def = new TableColumnDef();
            def.label = "HORA " + label;
            def.name = name + "_H";
            columns.push(def);
        }

        for (var i = 0; i < comp.tipoMaterial.length; i++) {
            for (var j = 0; j < comp.claseMaterial.length; j++) {
                let label = comp.tipoMaterial[i].descripcion + " - " + comp.claseMaterial[j].descripcion;
                let name = "MT_" + comp.tipoMaterial[i].id + "_" + comp.claseMaterial[j].id;
                let def = new TableColumnDef();
                def.label = label;
                def.name = name;
                columns.push(def);
            }
        }

        for (var i = 0; i < comp.equipo.length; i++) {
            let label = comp.equipo[i].descripcion;
            let name = "EQ_" + comp.equipo[i].id;
            let def = new TableColumnDef();
            def.label = label;
            def.name = name;
            columns.push(def);
            def = new TableColumnDef();
            def.label = "HORA " + label;
            def.name = name + "_H";
            columns.push(def);
        }

        comp.resultadosExtTableDef.columns = [...comp.resultadosExtTableDef.columns, ...columns];

    }

    totales(data: ProgramacionDiariaTrabajo[]): any[] {
        if (this.criterio.valor == "1") {
            return new Stream(data)
                .mapFlat(x => new Stream(x.material))
                .groupBy([x => x.tipoMaterial.id, x => x.claseMaterial.id])
                .map(x => new Stream(x).reduce(
                    () => {
                        const seed = new ProgramacionDiariaTrabajoMaterial();
                        seed.cantidad = 0
                        return seed;
                    },
                    (a, x) => {
                        a.cantidad += x.cantidad;
                        a.tipoMaterial = x.tipoMaterial;
                        a.claseMaterial = x.claseMaterial;
                    }))
                .toArray();
        } else {
            return new Stream(data)
                .mapFlat(x => new Stream(x.material))
                .groupBy([x => x.tipoMaterial.id, x => x.claseMaterial.id])
                .map(x => new Stream(x).reduce(
                    () => {
                        const seed = new ProgramacionDiariaTrabajoMaterial();
                        seed.cantidad = 0
                        return seed;
                    },
                    (a, x) => {
                        a.cantidad += x.cantidad;
                        a.tipoMaterial = x.tipoMaterial;
                        a.claseMaterial = x.claseMaterial;
                    }))
                .toArray();
        }
    }

    consolidar(data: ProgramacionDiariaTrabajo[]): any[] {
        let consolidado: any[] = [];
        for (var i = 0; i < data.length; i++) {
            var from = data[i];
            var to = {};
            to["pk"] = from.pk;
            to["fechaProgramacion"] = from.fechaProgramacion;
            to["jornada"] = from.jornada != null ? from.jornada.descripcion : '';
            to["estado"] =from.estado != null ? from.estado.descripcion : '';
            to["zona"] = from.zona;
            to["localidad"] = from.localidad;
            to["barrio"] = from.barrio;
            to["ejeVial"] = from.ejeVial;
            to["ejeVialDesde"] = from.ejeVialDesde;
            to["ejeVialHasta"] = from.ejeVialHasta;
            to["actividad"] = from.actividad;
            to["civ"] = from.civ;
            to["tipoIntervencion"] = from.tipoIntervencion;
            to["residenteObra"] = from.residenteObra;
            to["residenteObraTelefono"] = from.residenteObraTelefono;
            to["directorObra"] = from.directorObra;
            to["directorObraTelefono"] = from.directorObraTelefono;
            to["intervencionEncabezado"] = from.intervencionEncabezado;
            to["observaciones"] = from.observaciones;

            for (var j = 0; j < from.personal.length; j++) {
                let name = "PE_" + from.personal[j].personal.id + "_" + from.personal[j].tipoCuadrilla.id;
                let value = from.personal[j].cantidadPersonalInspector;
                to[name] = value;
            }

            for (var j = 0; j < from.maquinaria.length; j++) {
                let name = "MA_" + from.maquinaria[j].tipoMaquinaria.id;
                let value = "1";
                to[name] = value;
                to[name + "_H"] = from.maquinaria[j].hora;
            }

            for (var j = 0; j < from.material.length; j++) {
                let name = "MT_" + from.material[j].tipoMaterial.id + "_" + from.material[j].claseMaterial.id;
                let value = from.material[j].cantidad;
                to[name] = value;
            }

            for (var j = 0; j < from.equipo.length; j++) {
                let name = "EQ_" + from.equipo[j].equipo.id;
                let value = from.equipo[j].cantidad;
                to[name] = value;
                to[name + "_H"] = from.equipo[j].hora;
            }
            consolidado.push(to);
        }
        return consolidado;
    }

    consolidarDescarga(data: ProgramacionDiariaTrabajo[]): any[] {
        let consolidado: any[] = [];
        for (var i = 0; i < data.length; i++) {
            var from = data[i];
            var to = {};

            to["fechaProgramacion"] = from.fechaProgramacion;
            to["jornada"] = from.jornada != null ? from.jornada.descripcion : '';
            to["zona"] = from.zona;
            to["localidad"] = from.localidad;
            to["barrio"] = from.barrio;
            to["civ"] = from.civ;
            to["pk"] = from.pk;
            to["ejeVial"] = from.ejeVial;
            to["ejeVialDesde"] = from.ejeVialDesde;
            to["ejeVialHasta"] = from.ejeVialHasta;
            to["directorObra"] = from.directorObra;
            to["directorObraTelefono"] = from.directorObraTelefono;
            to["residenteObra"] = from.residenteObra;
            to["residenteObraTelefono"] = from.residenteObraTelefono;
            to["ingenieroApoyo"] = from.ingenieroApoyo;
            to["ingenieroApoyoTelefono"] = from.ingenieroApoyoTelefono;
            to["estrategiaIntervencion"] = from.estrategia;
            to["tipoIntervencion"] = from.tipoIntervencion;
            to["actividad"] = from.actividad;

            to["personalContratoOficiales"] = from.personal.filter(function (item) {
                return item.personal.descripcion === 'Personal de contrato' &&
                item.tipoCuadrilla.descripcion === 'Oficial';
                }).reduce((sum, current) => sum + current.cantidadPersonalInspector, 0);
            to["personalContratoAuxiliares"] = from.personal.filter(function (item) {
                return item.personal.descripcion === 'Personal de contrato' &&
                item.tipoCuadrilla.descripcion === 'Auxiliares tráfico';
                }).reduce((sum, current) => sum + current.cantidadPersonalInspector, 0);
            to["personalContratoTrabajadores"] = from.personal.filter(function (item) {
                return item.personal.descripcion === 'Personal de contrato' &&
                item.tipoCuadrilla.descripcion === 'Trabajadores';
                }).reduce((sum, current) => sum + current.cantidadPersonalInspector, 0);
            to["personalContratoConductores"] = from.personal.filter(function (item) {
                return item.personal.descripcion === 'Personal de contrato' &&
                item.tipoCuadrilla.descripcion === 'Conductores';
                }).reduce((sum, current) => sum + current.cantidadPersonalInspector, 0);

            to["personalEntidadOficiales"] = from.personal.filter(function (item) {
                return item.personal.descripcion === 'Personal de la entidad' &&
                item.tipoCuadrilla.descripcion === 'Oficial';
                }).reduce((sum, current) => sum + current.cantidadPersonalInspector, 0);
            to["personalEntidadConductores"] = from.personal.filter(function (item) {
                return item.personal.descripcion === 'Personal de la entidad' &&
                item.tipoCuadrilla.descripcion === 'Conductores';
                }).reduce((sum, current) => sum + current.cantidadPersonalInspector, 0);
            to["personalEntidadTrabajadores"] = from.personal.filter(function (item) {
                return item.personal.descripcion === 'Personal de la entidad' &&
                item.tipoCuadrilla.descripcion === 'Trabajadores';
            }).reduce((sum, current) => sum + current.cantidadPersonalInspector, 0);

            to["inspectorCuadrilla1"] = from.personal &&
                from.personal.length > 0 && from.personal[0].inspector1 &&
                from.personal[0].inspector1.descripcion ?
                from.personal[0].inspector1.descripcion : '';

            to["inspectorCuadrilla2"] = from.personal &&
                from.personal.length > 0 && from.personal[0].inspector2 &&
                from.personal[0].inspector2.descripcion ?
                from.personal[0].inspector2.descripcion : '';

            to["inspectorCuadrilla3"] = from.personal &&
                from.personal.length > 0 && from.personal[0].inspector3 &&
                from.personal[0].inspector3.descripcion ?
                from.personal[0].inspector3.descripcion : '';

            to["maquinariaSelladoraFisuras"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'SELLADORA DE FISURAS'; })
                .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaSelladoraFisuras"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'SELLADORA DE FISURAS'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["maquinariaMezcadora"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'MEZCLADORA'; })
               .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaMezcadora"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'MEZCLADORA'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["maquinariaCanguro"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'CANGURO'; })
               .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaCanguro"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'CANGURO'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["maquinariaCortadoraPAV"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'CORTADORA PAV'; })
               .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaCortadoraPAV"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'CORTADORA PAV'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["maquinariaVolquetas"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'VOLQUETAS'; })
               .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaVolquetas"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'VOLQUETAS'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["maquinariaCarroTanque"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'CARROTANQUE'; })
               .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaCarroTanque"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'CARROTANQUE'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["maquinariaIrrigador"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'IRRIGADOR'; })
               .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaIrrigador"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'IRRIGADOR'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["maquinariaPavimentadora"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'PAVIMENTADORAS'; })
               .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaPavimentadora"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'PAVIMENTADORAS'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["maquinariaRetroExcavadora"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'RETRO EXCAVADORAS'; })
               .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaRetroExcavadora"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'RETRO EXCAVADORAS'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["maquinariaCompactadorNeumatico"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'COMPACTADOR NEUMÁTICO'; })
               .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaCompactadorNeumatico"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'COMPACTADOR NEUMÁTICO'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["maquinariaCilindro"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'CILINDRO'; })
               .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaCilindro"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'CILINDRO'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["maquinariaCompresor"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'COMPRESOR'; })
               .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaCompresor"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'COMPRESOR'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["maquinariaMiniCargador"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'MINI CARGADOR'; })
               .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaMiniCargador"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'MINI CARGADOR'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["maquinariaMotoNiveladora"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'MOTO NIVELADORA'; })
               .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaMotoNiveladora"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'MOTO NIVELADORA'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["maquinariaMixer"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'MIXER'; })
               .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaMixer"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'MIXER'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["maquinariaCargadorFrontal"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'CARGADOR FRONTAL'; })
               .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaCargadorFrontal"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'CARGADOR FRONTAL'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["maquinariaRecicladora"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'RECICLADORA'; })
               .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaRecicladora"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'RECICLADORA'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["maquinariaCamiones"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'CAMIONES'; })
               .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaCamiones"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'CAMIONES'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["maquinariaFresadora"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'FRESADORA'; })
               .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaFresadora"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'FRESADORA'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["maquinariaCortadora"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'CORTADORA'; })
               .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaCortadora"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'CORTADORA'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["maquinariaPlanchaVibratoria"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'PLANCHA VIBRATORIA'; })
               .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaPlanchaVibratoria"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'PLANCHA VIBRATORIA'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["maquinariaGruaPlanchon"] =  from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'GRUA PLANCHON'; })
               .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaGruaPlanchon"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'GRUA PLANCHON'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["maquinariaCamion"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'CAMIONES'; })
                .reduce((sum, current) => ( current.maquinaria ? current.maquinaria.numeroInterno : '') + '', '');
            to["horaMaquinariaCamion"] = from.maquinaria.filter(function (item) {
                return item.tipoMaquinaria.descripcion === 'CAMIONES'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')
    
            to["mezclaAsfalticaM10Contrato"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'MEZCLA ASFÁLTICA MD-10' &&
                item.origenMezcla.descripcion === 'CONTRATO ICEIN' &&
                item.tipoMaterial.descripcion === 'MEZCLA'; })
                .reduce((sum, current) => sum + current.cantidad, 0);
            to["horaMezclaAsfalticaM10Contrato"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'MEZCLA ASFÁLTICA MD-10' &&
                item.origenMezcla.descripcion === 'CONTRATO ICEIN' &&
                item.tipoMaterial.descripcion === 'MEZCLA'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["mezclaAsfalticaM12Contrato"] =  from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'MEZCLA ASFÁLTICA MD-12' &&
                item.origenMezcla.descripcion === 'CONTRATO ICEIN' &&
                item.tipoMaterial.descripcion === 'MEZCLA'; })
                .reduce((sum, current) => sum + current.cantidad, 0);
            to["horaMezclaAsfalticaM12Contrato"] =  from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'MEZCLA ASFÁLTICA MD-12' &&
                item.origenMezcla.descripcion === 'CONTRATO ICEIN' &&
                item.tipoMaterial.descripcion === 'MEZCLA'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["mezclaAsfalticaM20Contrato"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'MEZCLA ASFÁLTICA MD-20' &&
                item.origenMezcla.descripcion === 'CONTRATO ICEIN' &&
                item.tipoMaterial.descripcion === 'MEZCLA'; })
                .reduce((sum, current) => sum + current.cantidad, 0);
            to["horaMezclaAsfalticaM20Contrato"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'MEZCLA ASFÁLTICA MD-20' &&
                item.origenMezcla.descripcion === 'CONTRATO ICEIN' &&
                item.tipoMaterial.descripcion === 'MEZCLA'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["mezclaAsfalticaMGCRTipo1Contrato"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'MEZCLA ASFÁLTICA MGCR TIPO I' &&
                item.origenMezcla.descripcion === 'CONTRATO ICEIN' &&
                item.tipoMaterial.descripcion === 'MEZCLA'; })
                .reduce((sum, current) => sum + current.cantidad, 0);
			to["horaMezclaAsfalticaMGCRTipo1Contrato"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'MEZCLA ASFÁLTICA MGCR TIPO I' &&
                item.origenMezcla.descripcion === 'CONTRATO ICEIN' &&
                item.tipoMaterial.descripcion === 'MEZCLA'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["mezclaAsfalticaM10Esmeralda"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'MEZCLA ASFÁLTICA MD-10' &&
                item.origenMezcla.descripcion === 'CONTRATO ICEIN' &&
                item.tipoMaterial.descripcion === 'LA ESMERALDA'; })
                .reduce((sum, current) => sum + current.cantidad, 0);
            to["horaMezclaAsfalticaM10Esmeralda"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'MEZCLA ASFÁLTICA MD-10' &&
                item.origenMezcla.descripcion === 'LA ESMERALDA' &&
                item.tipoMaterial.descripcion === 'MEZCLA'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["mezclaAsfalticaM12Esmeralda"] =  from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'MEZCLA ASFÁLTICA MD-12' &&
                item.origenMezcla.descripcion === 'CONTRATO ICEIN' &&
                item.tipoMaterial.descripcion === 'LA ESMERALDA'; })
                .reduce((sum, current) => sum + current.cantidad, 0);
            to["horaMezclaAsfalticaM12Esmeralda"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'MEZCLA ASFÁLTICA MD-12' &&
                item.origenMezcla.descripcion === 'LA ESMERALDA' &&
                item.tipoMaterial.descripcion === 'MEZCLA'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["mezclaAsfalticaM20Esmeralda"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'MEZCLA ASFÁLTICA MD-20' &&
                item.origenMezcla.descripcion === 'CONTRATO ICEIN' &&
                item.tipoMaterial.descripcion === 'LA ESMERALDA'; })
                .reduce((sum, current) => sum + current.cantidad, 0);
			to["horaMezclaAsfalticaM20Esmeralda"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'MEZCLA ASFÁLTICA MD-20' &&
                item.origenMezcla.descripcion === 'LA ESMERALDA' &&
                item.tipoMaterial.descripcion === 'MEZCLA'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["mezclaAsfalticaMGCRTipo1Esmeralda"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'MEZCLA ASFÁLTICA MGCR TIPO I' &&
                item.origenMezcla.descripcion === 'CONTRATO ICEIN' &&
                item.tipoMaterial.descripcion === 'LA ESMERALDA'; })
                .reduce((sum, current) => sum + current.cantidad, 0);
			to["horaMezclaAsfalticaMGCRTipo1Esmeralda"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'MEZCLA ASFÁLTICA MGCR TIPO I' &&
                item.origenMezcla.descripcion === 'LA ESMERALDA' &&
                item.tipoMaterial.descripcion === 'MEZCLA'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["concretoMR43Esmeralda"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'CONCRETO MR-43' &&
                item.origenMezcla.descripcion === 'LA ESMERALDA' &&
                item.tipoMaterial.descripcion === 'CONCRETO'; })
                .reduce((sum, current) => sum + current.cantidad, 0);
            to["horaConcretoMR43Esmeralda"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'CONCRETO MR-43' &&
                item.origenMezcla.descripcion === 'LA ESMERALDA' &&
                item.tipoMaterial.descripcion === 'CONCRETO'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["concreto3000PSIEsmeralda"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'CONCRETO 3000 PSI' &&
                item.origenMezcla.descripcion === 'LA ESMERALDA' &&
                item.tipoMaterial.descripcion === 'CONCRETO'; })
                .reduce((sum, current) => sum + current.cantidad, 0);
            to["horaConcreto3000PSIEsmeralda"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'CONCRETO 3000 PSI' &&
                item.origenMezcla.descripcion === 'LA ESMERALDA' &&
                item.tipoMaterial.descripcion === 'CONCRETO'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["concreto3500PSIEsmeralda"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'CONCRETO 3500 PSI' &&
                item.origenMezcla.descripcion === 'LA ESMERALDA' &&
                item.tipoMaterial.descripcion === 'CONCRETO'; })
                .reduce((sum, current) => sum + current.cantidad, 0);
            to["horaConcreto3500PSIEsmeralda"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'CONCRETO 3500 PSI' &&
                item.origenMezcla.descripcion === 'LA ESMERALDA' &&
                item.tipoMaterial.descripcion === 'CONCRETO'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["fresadoEstabilizado"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'FRESADO ESTABILIZADO' &&
                item.tipoMaterial.descripcion === 'FRESADO'; })
                .reduce((sum, current) => sum + current.cantidad, 0);
            to["horaFresadoEstabilizado"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'FRESADO ESTABILIZADO' &&
                item.tipoMaterial.descripcion === 'FRESADO'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["fresadoEstabilizadoMDF20"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'FRESADO ESTABILIZADO MDF20' &&
                item.tipoMaterial.descripcion === 'FRESADO'; })
                .reduce((sum, current) => sum + current.cantidad, 0);
            to["horaFresadoEstabilizadoMDF20"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'FRESADO ESTABILIZADO MDF20' &&
                item.tipoMaterial.descripcion === 'FRESADO'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["fresadoEstabilizadoRAP"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'FRESADO ESTABILIZADO (RAP)' &&
                item.tipoMaterial.descripcion === 'FRESADO'; })
                .reduce((sum, current) => sum + current.cantidad, 0);
            to["horaFresadoEstabilizadoRAP"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'FRESADO ESTABILIZADO (RAP)' &&
                item.tipoMaterial.descripcion === 'FRESADO'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["pavimentoAsalticoRecicladoRAP"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'RAP' &&
                item.tipoMaterial.descripcion === 'PAVIMENTO ASFÁLTICO RECICLADO'; })
                .reduce((sum, current) => sum + current.cantidad, 0);
            to["horaPavimentoAsalticoRecicladoRAP"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'RAP' &&
                item.tipoMaterial.descripcion === 'PAVIMENTO ASFÁLTICO RECICLADO'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["pavimentoAsalticoRecicladoRAPEstabilizado"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'RAP ESTABILIZADO' &&
                item.tipoMaterial.descripcion === 'PAVIMENTO ASFÁLTICO RECICLADO'; })
                .reduce((sum, current) => sum + current.cantidad, 0);
            to["horaPavimentoAsalticoRecicladoRAPEstabilizado"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'RAP ESTABILIZADO' &&
                item.tipoMaterial.descripcion === 'PAVIMENTO ASFÁLTICO RECICLADO'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["emulsionCRR"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'EMULSIÓN CRR (CATIÓNICA ROMPIMIENTO RÁPIDO)' &&
                item.tipoMaterial.descripcion === 'EMULSIÓN'; })
                .reduce((sum, current) => sum + current.cantidad, 0);
            to["horaEmulsionCRR"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'EMULSIÓN CRR (CATIÓNICA ROMPIMIENTO RÁPIDO)' &&
                item.tipoMaterial.descripcion === 'EMULSIÓN'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["emulsionCRL"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'EMULSION CRL (CATIÓNICA ROMPIMIENTO LENTO)' &&
                item.tipoMaterial.descripcion === 'EMULSIÓN'; })
                .reduce((sum, current) => sum + current.cantidad, 0);
            to["horaEmulsionCRL"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'EMULSION CRL (CATIÓNICA ROMPIMIENTO LENTO)' &&
                item.tipoMaterial.descripcion === 'EMULSIÓN'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["subrazanteRetalConcreto"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'RETAL CONCRETO' &&
                item.tipoMaterial.descripcion === 'SUBRASANTE'; })
                .reduce((sum, current) => sum + current.cantidad, 0);
            to["horaSubrazanteRetalConcreto"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'RETAL CONCRETO' &&
                item.tipoMaterial.descripcion === 'SUBRASANTE'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["subrazantePiedraRajon"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'PIEDRA RAJÓN' &&
                item.tipoMaterial.descripcion === 'SUBRASANTE'; })
                .reduce((sum, current) => sum + current.cantidad, 0);
            to["horaSubrazantePiedraRajon"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'PIEDRA RAJÓN' &&
                item.tipoMaterial.descripcion === 'SUBRASANTE'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["subrazanteReceboComun"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'RECEBO COMÚN' &&
                item.tipoMaterial.descripcion === 'SUBRASANTE'; })
                .reduce((sum, current) => sum + current.cantidad, 0);
            to["horaSubrazanteReceboComun"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'RECEBO COMÚN' &&
                item.tipoMaterial.descripcion === 'SUBRASANTE'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["subBaseGranularSBG_A"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'SBG A' &&
                item.tipoMaterial.descripcion === 'SUBRASANTE'; })
                .reduce((sum, current) => sum + current.cantidad, 0);
            to["horaSubBaseGranularSBG_A"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'SBG A' &&
                item.tipoMaterial.descripcion === 'SUBRASANTE'; })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["subBaseGranularSBG_B"] = from.material
                .filter(function (item) {
                    return item.claseMaterial.descripcion === 'SBG B' &&
                        item.tipoMaterial.descripcion === 'SUBRASANTE';
                })
                .reduce((sum, current) => sum + current.cantidad, 0);
            to["horaSubBaseGranularSBG_B"] = from.material
                .filter(function (item) {
                    return item.claseMaterial.descripcion === 'SBG B' &&
                        item.tipoMaterial.descripcion === 'SUBRASANTE';
                })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["subBaseGranularSBG_C"] = from.material
                .filter(function (item) {
                    return item.claseMaterial.descripcion === 'SBG C' &&
                        item.tipoMaterial.descripcion === 'SUBRASANTE';
                })
                .reduce((sum, current) => sum + current.cantidad, 0);

            to["horaSubBaseGranularSBG_C"] = from.material
                .filter(function (item) {
                    return item.claseMaterial.descripcion === 'SBG C' &&
                        item.tipoMaterial.descripcion === 'SUBRASANTE';
                })
                .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["baseGranularBGA"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'BG A' &&
                    item.tipoMaterial.descripcion.trim() === 'BASE GRANULAR';
            })
            .reduce((sum, current) => sum + current.cantidad, 0);

            to["horaBaseGranularBGA"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'BG A' &&
                    item.tipoMaterial.descripcion.trim() === 'BASE GRANULAR';
            })
            .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["baseGranularBGB"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'BG B' &&
                    item.tipoMaterial.descripcion.trim() === 'BASE GRANULAR';
            })
            .reduce((sum, current) => sum + current.cantidad, 0);

            to["horaBaseGranularBGB"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'BG B' &&
                    item.tipoMaterial.descripcion.trim() === 'BASE GRANULAR';
            })
            .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["baseGranularBGC"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'BG C' &&
                    item.tipoMaterial.descripcion.trim() === 'BASE GRANULAR';
            })
            .reduce((sum, current) => sum + current.cantidad, 0);

            to["horaBaseGranularBGC"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'BG C' &&
                    item.tipoMaterial.descripcion.trim() === 'BASE GRANULAR';
            })
            .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["petreosMixto"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'MIXTO' &&
                    item.tipoMaterial.descripcion === 'PETREOS';
            })
            .reduce((sum, current) => sum + current.cantidad, 0);
            to["horaPetreosMixto"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'MIXTO' &&
                    item.tipoMaterial.descripcion === 'PETREOS';
            })
            .reduce((sum, current) => current.hora != null ? current.hora : '' ,  '')

            to["petreosGrava"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'GRAVA' &&
                    item.tipoMaterial.descripcion === 'PETREOS';
            }).reduce((sum, current) => sum + current.cantidad, 0);

            to["horaPetreosGrava"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'GRAVA' &&
                    item.tipoMaterial.descripcion === 'PETREOS';
            }).reduce((sum, current) => current.hora != null ? current.hora : '' ,  '');

            to["petreosGrava34"] =  from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'GRAVA 3/4' &&
                    item.tipoMaterial.descripcion === 'PETREOS';
            }).reduce((sum, current) => sum + current.cantidad, 0);

            to["horaPetreosGrava34"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'GRAVA 3/4' &&
                    item.tipoMaterial.descripcion === 'PETREOS';
            }).reduce((sum, current) => current.hora != null ? current.hora : '' ,  '');

            to["petreosGravaMedia"] =  from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'GRAVA MEDIA' &&
                    item.tipoMaterial.descripcion === 'PETREOS';
            }).reduce((sum, current) => sum + current.cantidad, 0);

            to["horaPetreosGravaMedia"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'GRAVA MEDIA' &&
                    item.tipoMaterial.descripcion === 'PETREOS';
            }).reduce((sum, current) => current.hora != null ? current.hora : '' ,  '');

            to["petreosArenaRio"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'GRVA RIO' &&
                    item.tipoMaterial.descripcion === 'PETREOS';
            }).reduce((sum, current) => sum + current.cantidad, 0);

            to["horaPetreosArenaRio"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'GRVA RIO' &&
                    item.tipoMaterial.descripcion === 'PETREOS';
            }).reduce((sum, current) => current.hora != null ? current.hora : '' ,  '');

            to["petreosArenaPena"] =  from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'GRAVA PEÑA' &&
                    item.tipoMaterial.descripcion === 'PETREOS';
            }).reduce((sum, current) => sum + current.cantidad, 0);

            to["horaPetreosArenaPena"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'GRAVA PEÑA' &&
                    item.tipoMaterial.descripcion === 'PETREOS';
            }).reduce((sum, current) => current.hora != null ? current.hora : '' ,  '');

            to["petreosRetalConcreto"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'RETAL CONCRETO' &&
                    item.tipoMaterial.descripcion === 'PETREOS';
            }).reduce((sum, current) => sum + current.cantidad, 0);

            to["horaPetreosRetalConcreto"] = from.material
            .filter(function (item) {
                return item.claseMaterial.descripcion === 'RETAL CONCRETO' &&
                    item.tipoMaterial.descripcion === 'PETREOS';
            }).reduce((sum, current) => current.hora != null ? current.hora : '' ,  '');

            to["cemento"] =  from.material
            .filter(function (item) {
                return item.tipoMaterial.descripcion === 'CEMENTO';
            }).reduce((sum, current) => sum + current.cantidad, 0);

            to["horaCemento"] =  from.material
            .filter(function (item) {
                return item.tipoMaterial.descripcion === 'CEMENTO';
            }).reduce((sum, current) => current.hora != null ? current.hora : '' ,  '');

            to["equipoLuminaria1"] = from.equipo
            .filter(function (item) {
                return item.equipo.descripcion === 'EQUIPO LUMINARIA 1';
            }).reduce((sum, current) => (current.equipo != null ? current.equipo.descripcion : '') + '', '');

            to["cantidadEquipoLuminaria1"] = from.equipo
            .filter(function (item) {
                return item.equipo.descripcion === 'EQUIPO LUMINARIA 1';
            }).reduce((sum, current) => sum + current.cantidad, 0);


            to["equipoLuminaria2"] = from.equipo
            .filter(function (item) {
                return item.equipo.descripcion === 'EQUIPO LUMINARIA 2';
            }).reduce((sum, current) => (current.equipo != null ? current.equipo.descripcion : '')  + '', '');

            to["cantidadEquipoLuminaria2"] = from.equipo
            .filter(function (item) {
                return item.equipo.descripcion === 'EQUIPO LUMINARIA 2';
            }).reduce((sum, current) => sum + current.cantidad, 0);


            to["equipoLuminaria3"] = from.equipo
            .filter(function (item) {
                return item.equipo.descripcion === 'EQUIPO LUMINARIA 3';
            }).reduce((sum, current) => (current.equipo != null ? current.equipo.descripcion : '')  + '', '');

            to["cantidadEquipoLuminaria3"] = from.equipo
            .filter(function (item) {
                return item.equipo.descripcion === 'EQUIPO LUMINARIA 3';
            }).reduce((sum, current) => sum + current.cantidad, 0);

            consolidado.push(to);
        }
        return consolidado;
    }


    initConsulta() {
       // this.onConsultarExportacion();
        this.onConsultar();
    }

    /**
     * Carga los datos de la fuente de datos usando los criterios de búsqueda
     */
    onConsultar(paginacion: number[] = null): void {
        const comp = this;
        this.loader = true;
        const criteria = new ProgramacionDiariaTrabajoCriteria();
        if (paginacion !== null) {
            criteria.size = paginacion[0];
            criteria.page = paginacion[1];
        }
        this.siguienteTransicion = false;
        this.fechaComparar = null;
        this.jornadaComparar = null;
        this.tipoMaterialComparar = null;
        this.JornadaIgual = true;
        this.fechaIgual = true;
        this.tipoMaterialIgual = true;

        comp.criteriosFormRef.callLast(form => {
            let oldModel = form.model;
            form.model = criteria;
            form.transferToModel();
            form.model = oldModel;
            comp.criterio = criteria.criterio;
        });
        comp.service.search(criteria).subscribe(
            data => {
                comp.resultados = data.content;
                this.loader = false;
                comp.showResultados = true;
                this.loadMantenimiento();
                comp.resultadosTableRef.callLast(table => {
                    table.def = comp.resultadosTableDef;
                    table.def.length = data.totalElements;
                    table.def.pageSize = data.size;
                    table.visibleColumns = table.def.columns.map(x => x.name);
                    table.model = comp.consolidar(comp.resultados);
                    table.buildDisplayColumns();
                    table.refreshDataSource();
                });
                comp.tipoMaterialTableRef.callLast(table => {
                    comp.totalesMaterial = comp.totales(comp.resultados);
                    let totalesXMaterial = [];
                    let totalesXClaseMaterial = [];

                    if (typeof(criteria.tipoMaterial) !== 'undefined' &&
                        criteria.tipoMaterial.length > 0) {
                        criteria.tipoMaterial.forEach(tipo => {
                            const temTotales =  comp.totalesMaterial.filter( m => m.tipoMaterial.id == tipo.id );
                            temTotales.forEach(elem => {
                                if ( totalesXMaterial.filter( n => n.tipoMaterial.id == elem.tipoMaterial.id ).length === 0 ) {
                                    totalesXMaterial.push( elem );
                                }
                            });
                        });
                    }

                    if (typeof(criteria.claseMaterial) !== 'undefined' &&
                        criteria.claseMaterial.length > 0) {
                        criteria.claseMaterial.forEach(tipo => {
                            const temTotales =  totalesXMaterial.filter( m => m.claseMaterial.id == tipo.id );
                            temTotales.forEach(elem => {
                                if ( totalesXClaseMaterial.filter( n => n.claseMaterial.id == elem.claseMaterial.id ).length === 0 ) {
                                    totalesXClaseMaterial.push( elem );
                                }
                            });
                        });
                    }

                    comp.totalesMaterial = totalesXClaseMaterial;

                    from(comp.totalesMaterial).pipe(
                        groupBy(n => n.tipoMaterial),
                        // return each item in group as array
                        mergeMap(group => group.pipe(toArray()))
                    ).subscribe(val => {
                        if ( this.tipoMaterialComparar === null) {
                            this.tipoMaterialComparar = val[0].tipoMaterial;
                        }
                        if (this.tipoMaterialComparar.id !== val[0].tipoMaterial.id) {
                            this.tipoMaterialIgual = false;
                        }
                    });;

                    if (comp.criterio.valor == "1") {
                        table.visibleColumns = ["tipoMaterial", "claseMaterial", "cantidad"];
                    } else {
                        table.visibleColumns = ["tipoMaterial", "cantidad"];
                    }
                    table.model = comp.totalesMaterial;
                    table.def.length = comp.totalesMaterial.length;
                    table.buildDisplayColumns();
                    table.refreshDataSource();
                });
            },
            error => { comp.snackBar.open(Utils.friendlyHttpError(error), "Cerrar", { duration: 10000 }); }
        );

    }


    /**
     * Carga los datos de la fuente de datos usando los criterios de búsqueda
     */
    onConsultarExportacion(): void {
        const comp = this;
        this.loader = true;
        const criteria2 = new ProgramacionDiariaTrabajoCriteria();
        criteria2.size = 999999999;
        criteria2.page = 0;
        this.siguienteTransicion = false;
        this.fechaComparar = null;
        this.jornadaComparar = null;
        this.tipoMaterialComparar = null;
        this.JornadaIgual = true;
        this.fechaIgual = true;
        this.tipoMaterialIgual = true;

        comp.criteriosFormRef.callLast(form => {
            let oldModel = form.model;
            form.model = criteria2;
            form.transferToModel();
            form.model = oldModel;
            comp.criterio = criteria2.criterio;
        });
        comp.service.search(criteria2).subscribe(
            data => {
                comp.resultadosExport = data.content;
                this.loader = false;
                comp.showResultadosExport = true;
                this.loadMantenimientoExport();
            },
            error => { comp.snackBar.open(Utils.friendlyHttpError(error), "Cerrar", { duration: 10000 }); }
        );

    }

    onChangePage(paginacion: number[]) {
        this.onConsultar(paginacion);
    }


    loadMantenimiento() {
        let count = 0;
        this.readyMantenimientos = false;
        for (const item of this.resultados) {
            if (item.pk) {
                this.solicitudMezclaService.detailByPk(item.pk).subscribe(mantenimiento => {
                    this.mantenimientos.push(mantenimiento);
                }).add(() => {
                    count += 1;
                    if (this.resultados.length === count) {
                        this.solicitudMezclaService.listenerActionMantenimiento(1);
                    }
                });
            }
        }

        this.solicitudMezclaService.serviceMantenimiento$.subscribe(data => {
            this.readyMantenimientos = true;
            if ( this.resultados != null && this.resultados.length > 0 ) {
                this.resultados.forEach(element => {
                    if ( this.jornadaComparar === null ) {
                        this.jornadaComparar = element.jornada;
                    }
                    if (element.jornada.id != this.jornadaComparar.id ) {
                        this.JornadaIgual = false;
                    }
                    if ( this.fechaComparar === null ) {
                        this.fechaComparar = element.fechaProgramacion;
                    }
                    if (element.fechaProgramacion != this.fechaComparar ) {
                        this.fechaIgual = false;
                    }
                    if ((element && element.material.length === 0 ) ||
                        this.readyMantenimientos === false) {
                        this.readyMantenimientos = false;
                    } else {
                       this.readyMantenimientos = true;
                    }
                });
            }

        });

    }

    loadMantenimientoExport() {
        let count = 0;
        this.readyMantenimientos = false;
        for (const item of this.resultadosExport) {
            if (item.pk) {
                this.solicitudMezclaService.detailByPk(item.pk).subscribe(mantenimiento => {
                    this.mantenimientosExport.push(mantenimiento);
                }).add(() => {
                    count += 1;
                    if (this.resultadosExport.length === count) {
                        this.solicitudMezclaService.listenerActionMantenimiento(1);
                    }
                });
            }
        }

        this.solicitudMezclaService.serviceMantenimiento$.subscribe(data => {
            this.readyMantenimientos = true;
            if ( this.resultadosExport != null && this.resultadosExport.length > 0 ) {
                this.resultadosExport.forEach(element => {
                    if ( this.jornadaComparar === null ) {
                        this.jornadaComparar = element.jornada;
                    }
                    if (element.jornada.id != this.jornadaComparar.id ) {
                        this.JornadaIgual = false;
                    }
                    if ( this.fechaComparar === null ) {
                        this.fechaComparar = element.fechaProgramacion;
                    }
                    if (element.fechaProgramacion != this.fechaComparar ) {
                        this.fechaIgual = false;
                    }
                    if ((element && element.material.length === 0 ) ||
                        this.readyMantenimientos === false) {
                        this.readyMantenimientos = false;
                    } else {
                       this.readyMantenimientos = true;
                    }
                });
            }

        });

    }

    onCancelar(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'custom-modalbox';
        dialogConfig.width = '30%';
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

        dialogRef.beforeClosed().subscribe(
          val => {
            if (val == 1) {
                this.loader = true;
                this.reloadComponent();
            }
          }
        );
    }


    back(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'custom-modalbox';
        dialogConfig.width = '30%';
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

        dialogRef.beforeClosed().subscribe(
          val => {
            if (val == 1) {
                this.reloadComponent();
            }
          }
        );
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        const urlBack = location.pathname;
        this.loader = false;
        this.router.navigate([urlBack]);
    }

  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
   onDescargarExcel(): void {
       this.onConsultarExportacion();
        const columns = this.resultadosExExportacionTableDef.columns;
        const labels = {};
        this.loader = true;
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            labels[column.name] = column.label;
        }
        const content = this.consolidarDescarga(this.resultadosExport);
        const headers = [labels];
        const dataExport = [...headers, ...content];
        this.loader = false;
        this.excelService.exportAsExcelFileCustom(dataExport, 'consolidado', true, columns.map(x => x.name));
    }

    /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo pdf
   */
   onDescargarPDF(): void {
        this.onConsultarExportacion();
        const columns = this.resultadosExExportacionTableDef.columns;
        const labels = {};
        this.loader = true;
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            labels[column.name] = column.label;
        }
        const content = this.consolidarDescarga(this.resultados);
        const headers = [labels];

        this.loader = false;
        this.pdfService.exportPdf('consolidado', headers, content, true, 6);
    }

    enviarAProduccion(): void {

        const comp = this;
        this.loader = true;
        // Verifica que en los resultados sólamente haya un tipo de material
        // TODO: No se puede hacer

        let solicitudes = new Stream(this.resultados)

            // Para aquellas programaciones que tienen materiales...
            .filter(x => x.material != null && x.material.length > 0)

            // ... por cada uno de los materiales completa con información de la programación...
            .mapFlat(prog => new Stream(prog.material).map(mat => {
                let obj = {
                    fechaProgramacion: prog.fechaProgramacion,
                    jornada: prog.jornada,
                    pk: prog.pk,
                    tipoMaterial: mat.tipoMaterial,
                    cantidad: mat.cantidad,
                    estado: prog.estado,
                    intervencionId: prog.intervencionEncabezado.id,
                };
                return obj;
            }))

            // ... luego los materiales los agrupa...
            .groupBy([x => x.fechaProgramacion, x => x.jornada.id, x => x.tipoMaterial.id])

            // ... por cada agrupación crea una solicitud
            .map(x => {
                let solicitud = new SolicitudMezcla();
                solicitud.tipoMaterial = x[0].tipoMaterial;
                solicitud.jornada = x[0].jornada;
                solicitud.fechaProgramacion = x[0].fechaProgramacion;
                solicitud.vales = [];
                solicitud.estado = x[0].estado;
                solicitud.cantidad = x[0].cantidad;
                solicitud.turno = x[0].jornada;
                solicitud.materiales = new Stream(x).map(mat => {
                    let material = new SolicitudMezclaMaterial();
                    material.tipoMaterial = mat.tipoMaterial;
                    material.cantidad = mat.cantidad;
                    material.pk = mat.pk;
                    return material;
                }).toArray();
                solicitud.items = new Stream(x).map(mat => {
                    let detalle = new SolicitudMezclaDetalle();
                    detalle.cantidad = mat.cantidad;
                    detalle.unidad = new ListaItem();
                    detalle.unidad.id = 1;
                    detalle.intervencion = new Intervencion();
                    detalle.intervencion.id = mat.intervencionId;
                    return detalle;
                }).toArray();
                return solicitud;
            }).toArray();

        solicitudes = solicitudes

        // Para aquellos que corresponden a la fecha, jornada y tipo de material
        .filter(x => x.tipoMaterial.id === this.tipoMaterialComparar.id
            && x.jornada.id === this.jornadaComparar.id
            && x.fechaProgramacion == this.fechaComparar)


        if (this.mantenimientos) {
            this.loader = false;
            if (solicitudes) {
                comp.solicitudMezclaService.postAll(solicitudes).subscribe(
                    data => {
                        this.applyMasiveTransitionTo(this.mantenimientos, null);
                    }, error => {
                        this.snackBar.open(
                            this.constants.error500, 'X', {
                            duration: 6000,
                            panelClass: ['error-snackbar']
                          } );
                    }
                );
            }
        }

    }

    validarEnvioProduccion(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'custom-modalbox';
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '30%';
        dialogConfig.data = {
            mensaje: this.constants.deseaEnviarProduccion
        };
        const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);
                dialogRef.beforeClosed().subscribe(val => {
                    if (val === 1) {

                        if (this.tipoMaterialIgual === false) {
                            this.snackBar.open(
                                this.constants.msjTipoMaterialIgual, 'X', {
                                duration: 6000,
                                panelClass: ['error-snackbar']
                            });
                        } else {
                            if (this.JornadaIgual === false) {
                                this.snackBar.open(
                                    this.constants.msjJornadaIgual, 'X', {
                                    duration: 6000,
                                    panelClass: ['error-snackbar']
                                });
                            } else {
                                if (this.fechaIgual === false) {
                                    this.snackBar.open(
                                        this.constants.msjFechaIgual, 'X', {
                                        duration: 6000,
                                        panelClass: ['error-snackbar']
                                    });
                                } else {

                                    const criterioSolicitudMezcla: SolicitudMezclaCriteria = new SolicitudMezclaCriteria();
                                    criterioSolicitudMezcla.fechaSolicitudDesde =
                                        this.utilitiesServices.convertDateToString(new Date(), 'DD-MM-YYYY');
                                    criterioSolicitudMezcla.fechaSolicitudHasta =
                                        this.utilitiesServices.convertDateToString(new Date(), 'DD-MM-YYYY');
                                    criterioSolicitudMezcla.jornada = this.jornadaComparar;
                                    criterioSolicitudMezcla.tipoMaterial = this.tipoMaterialComparar;

                                    this.solicitudMezclaService.search(criterioSolicitudMezcla)
                                    .subscribe(solicitudes => {
                                        if ( solicitudes != null && solicitudes.content.length > 0 ) {
                                            this.siguienteTransicion = false;
                                            this.snackBar.open(
                                                this.constants.msjInfoYaEnviada, 'X', {
                                                duration: 6000,
                                                panelClass: ['error-snackbar']
                                            });
                                        } else {
                                            this.siguienteTransicion = true;
                                        }
                                    });
                                }
                            }
                        }
                    }
                });
    }

    public applyMasiveTransitionTo(mantenimientos: WorkflowMantenimientoModel[], grid: GridMantenimientosComponent) {

        const mantenimientosActividad: WorkflowMantenimientoActividadModel[] = [];
        for (const mantenimiento of mantenimientos) {
            const mantenimientoActividad = new WorkflowMantenimientoActividadModel();
            mantenimientoActividad.mantenimiento = mantenimiento;
            mantenimientoActividad.actividad = this.data.actividad;
            mantenimientoActividad.observaciones = this.data.observaciones;
            mantenimientoActividad.transicion = this.data.actividad.transiciones[0];
            mantenimientoActividad.usuarioAsignado = this.data.ejecutadoPor;
            mantenimientosActividad.push(mantenimientoActividad);
        }
        this.workflowService.createList(mantenimientosActividad).subscribe((data: any) => {
            this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
                duration: 5000,
                panelClass: ['success-snackbar']
            });
            this.reloadComponent();
        }, error => {
            this.snackBar.open(
                this.constants.error500, 'X', {
                duration: 6000,
                panelClass: ['error-snackbar']
              } );
        });
    }

}
