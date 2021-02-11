import { forEach } from '@angular/router/src/utils/collection';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, AfterViewChecked } from '@angular/core';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialogConfig, MatDialog, MatTableDataSource, MatExpansionPanel } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { CONST_REGISTRO_PROGRAMACION_DIARIA_TRABAJO } from './registro-programacion-diaria-trabajo.constant';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { ProgramacionDiariaTrabajo } from './programacion-diaria-trabajo.model';
import { TableDef, ArrayTableComponent } from 'src/app/shared/component/sg-array-table/sg-array-table.component';
import { ProgramacionDiariaTrabajoService } from './programacion-diaria-trabajo.service';
import { Utils, Ref, Stream } from 'src/app/shared/utils/global-functions';
import { ObjectFormComponent, FormDef } from 'src/app/shared/component/sg-object-form/sg-object-form.component';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { IntervencionEncabezado } from 'src/app/intervencion/visitatecnicaverificacion/visita-verificacion-admin/models/intervencionEncabezado.model';
import { ProgramacionDiariaTrabajoPersonal } from './programacion-diaria-trabajo-personal.model';
import { ProgramacionDiariaTrabajoMaquinaria } from './programacion-diaria-trabajo-maquinaria.model';
import { ProgramacionDiariaTrabajoMaterial } from './programacion-diaria-trabajo-material.model';
import { ProgramacionDiariaTrabajoEquipo } from './programacion-diaria-trabajo-equipo.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import moment from 'moment';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { Profile } from 'src/app/seguridad/models/profile';
import { ProfileService } from 'src/app/seguridad/services/profile.service';

@Component({
    selector: 'app-registro-programacion-diaria-trabajo',
    templateUrl: './registro-programacion-diaria-trabajo.component.html'
})
export class RegistroProgramacionDiariaTrabajoComponent extends BaseComponent implements OnInit, OnDestroy, FormComponent {

    controller = this;
    showTransicion: boolean = false;

    /** Constantes a usar en el componente */
    public constants = CONST_REGISTRO_PROGRAMACION_DIARIA_TRABAJO;
    public condicion: WorkflowCondicionModel;
    fechaRegistroProgramacion: string;
    nextTransition = false;
    transicionesIndividualAuto = [];
    loader = false;

    columns = [
        'zona', 'localidad', 'barrio', 'actividad', 'tipoIntervencion', 'pk', 'civ', 'estrategiaIntervencion',
        'estadoProgramacionDiaria', 'responsable'
    ];

    filters = [
        'zona', 'localidad', 'upla', 'barrio', 'pk', 'civ', 'estrategia', 'jornadaProgDiaria',
        'fechaProgramacionDiaria', 'estadoProgramacionDiaria',
    ];

    singleActions = [
        {
            nombre: this.constants.currentAction.listarProgramacionDiaria, icono: "note_add",
            label: this.constants.listarProgramacionDiaria, color: "primary"
        }
    ];

    columnsProgramacion = [
        'pk', 'fechaCreacion', 'fechaProgramacion', 'estadoProgramacion', 'nombreJornada', 'acciones'
    ];

    wasDefinedSection = false;

    @ViewChild('sectionPersonal') sectionPersonal: MatExpansionPanel;
    @ViewChild('sectionMaquinaria') sectionMaquinaria: MatExpansionPanel;
    @ViewChild('sectionMaterial') sectionMaterial: MatExpansionPanel;
    @ViewChild('sectionEquipo') sectionEquipo: MatExpansionPanel;
    statusFormProgramacionDiaria: Boolean;

    defaulFilters: KeyValuePair[] = [];
    reponsableForViewGrid: Profile;


    constructor(
        servicio: MantenimientoService,
        commonService: CommonService,
        formBuilder: FormBuilder,
        workflowService: WorkflowService,
        excelService: ExcelService,
        utilitiesServices: UtilitiesService,
        snackBar: MatSnackBar,
        tokenStorageService: TokenStorageService,
        mapService: MapService,
        private dialog: MatDialog,
        private programacionDiariaTrabajoService: ProgramacionDiariaTrabajoService,
        private dataGenericService: DataGenericService,
    ) {
        // Invocación del constructor padre
        super(servicio, commonService, formBuilder, workflowService, excelService,
            utilitiesServices, snackBar, tokenStorageService, mapService);
    }


    /** Método encargado de inicializar el componente */
    ngOnInit() {
        this.reponsableForViewGrid = this.tokenStorageService.getStorage(this.tokenStorageService.PERFIL);
        this.defaulFilters.push({key: 'permisoId', value: '1'});
        if (typeof this.data.actividad !== 'undefined' &&
            typeof this.data.actividad.transiciones !== 'undefined') {
            this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
            this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
            this.columns = this.columns.filter(item => item !== 'select');
            if (this.transicionesMasivas.length > 0) {
                this.columns.unshift('select');
            }
        }

        this.commonService.getCondicionByNombre('PK_REGISTRO_PROGRAMACION_DIARIA_TRABAJO').subscribe(_condicion => {
            this.condicion = _condicion;
        });

        this.programacionFormDef.fields
            .filter(field => field.name == "fechaProgramacion")
            .forEach(field => {
                if (!field.options) {
                    field.options = {};
                }
                //field.options.minDate = this.utilitiesServices.convertDateToString(Date(), 'DD-MM-YYYY');
                field.options.minDate = moment().format('DD-MM-YYYY') + "00:00:00";
            });

        const comp = this;
        this.dataGenericService.list("/api/administracion/lista/CLASE_MATERIAL/items").subscribe(
            data => comp.materialFormDef.fields
                .filter(x => x.name == "claseMaterial")
                .forEach(x => {
                    if (!x.options) {
                        x.options = {};
                    }
                    x.options.options = data;
                    x.options.currentOptions = data;
                })
        );

    }

    singleAccion(event) {
        this.mantenimiento = event.mantenimiento;
        switch (event.accion) {
            case this.constants.currentAction.listarProgramacionDiaria:
                this.listarProgramaciones(event);
                break;
        }
    }

    listarProgramaciones(event: any) {
        this.mapService.disconectGrid();
        this.data.mantenimiento = this.mantenimiento;
        this.currentAction = event.accion;
        this.showTransicion = false;

        // Carga las programaciones asociadas a la intervención
        const comp = this;
        this.programacionDiariaTrabajoService.findByIntervencionEncabezadoId(this.mantenimiento.intervenciones[0].id)
            .subscribe(
                data => {
                    comp.programaciones = data;
                    for (const key in comp.programaciones) {
                        comp.programaciones[key].nombreJornada = comp.programaciones[key].jornada ? comp.programaciones[key].jornada.valor : '';
                        comp.programaciones[key].nombreEstado = comp.programaciones[key].estado ? comp.programaciones[key].estado.valor : '';
                    }
                    comp.programacionesTableRef.callLast(table => {
                        table.model = comp.programaciones;
                        table.refreshDataSource();
                    });
                },
                error => {
                    this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
                }
            );
    }

    closeRegistrarProgramacionDiaria() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'custom-modalbox';
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '30%';
        dialogConfig.data = {
            mensaje: this.constants.deseaSalir
        };
        const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

        dialogRef.beforeClosed().subscribe(val => {
            if (val == 1) {
                this.utilitiesServices.scrollToTop();
                this.currentAction = this.constants.currentAction.list;
                this.loadData();
            }
        });

    }

    /** Método encargado de devolver a la página principal el componente */
    onBack(): void {
        super.cancel();
    }

    onBackRegistro(): void {
        this.cancelIfIsEditing();
        this.listarProgramaciones({ accion: this.constants.currentAction.listarProgramacionDiaria });
    }

    back(event) {
        this.ngOnInit();
        this.mapService.getVisor().visible = true;
        this.currentAction = event.currentAction;
    }

    saveAllForm(event) {
        this.nextTransition = event.nextTransition;
    }

    executeTransition(): void {
        this.data.mantenimiento.intervenciones[0].programacionesDiarias = [];
        this.applySingleTransitionTo();
    }

    // ---------------------- PROGRAMACIONES

    /**
     * Modelo de todos los formularios y tablas
     */
    programaciones: ProgramacionDiariaTrabajo[] = [];

    /**
     * Referencia a la tabla de programaciones
     */
    programacionesTableRef = new Ref<ArrayTableComponent>();
    @ViewChild("programacionesTable") set _programacionesTableRef(x: ArrayTableComponent) {
        this.programacionesTableRef.setReference(x);
    }

    /**
     * Definición de la tabla de programaciones
     */
    programacionTableDef: TableDef = {
        title: "Programación diaria de trabajo",
        newElementFn: () => new ProgramacionDiariaTrabajo(),
        columns: [
            { name: "id", label: "#", property: null },
            { name: "fechaCreacion", label: "Fecha creación programación diaria", property: null },
            { name: "jornada", label: "Jornada", property: null },
            { name: "nombreJornada", label: "Jornada", property: null },
            { name: "fechaProgramacion", label: "Fecha programación diaria", property: null },
            { name: "estrategia", label: "Estrategia de intervención", property: null },
            { name: "estado", label: "Estado de la programación diaria", property: null },
            { name: "nombreEstado", label: "Estado de la programación diaria", property: null },
            { name: "localidad", label: "Localidad", property: null },
            { name: "barrio", label: "Barrio", property: null },
            { name: "ejeVial", label: "Eje vial", property: null },
            { name: "ejeVialDesde", label: "Eje vial (desde)" , property: null},
            { name: "ejeVialHasta", label: "Eje vial (hasta)", property: null },
            { name: "actividad", label: "Actividad", property: null },
            { name: "civ", label: "CIV", property: null },
            { name: "pk", label: "PK", property: null },
            { name: "tipoIntervencion", label: "Tipo de intervención", property: null },
            { name: "residenteObra", label: "Residente de obra", property: null },
            { name: "residenteObraTelefono", label: "Teléfono móvil" , property: null},
            { name: "directorObra", label: "Director de obra", property: null },
            { name: "directorObraTelefono", label: "Teléfono móvil", property: null },
            { name: "intervencionEncabezado", label: "Intervención para la que se hace la solicitud", property: null },
            { name: "observaciones", label: "Observaciones" , property: null},
        ],
    };

    programacion: ProgramacionDiariaTrabajo;

    onEditProgramacion(index: number) {
        this.currentAction = this.constants.currentAction.registrarProgramacionDiaria;
        const comp = this;
        let programacion = comp.programaciones[index];
        comp.programacion = programacion;
        comp.completarConMantenimiento(programacion, comp.mantenimiento);
        comp.programacionFormRef.callLast(form => {
            form.model = programacion;
            form.transferFromModel();
        });
        comp.personalTableRef.callLast(table => {
            table.model = comp.programacion.personal;
            this.refreshData();
        table.refreshDataSource();
        });
    }

    onNewProgramacion() {
        this.currentAction = this.constants.currentAction.registrarProgramacionDiaria;
        const comp = this;
        this.loader = true;
        comp.programacion = new ProgramacionDiariaTrabajo();
        comp.programacion.personal = [];
        comp.programacion.maquinaria = [];
        comp.programacion.material = [];
        comp.programacion.equipo = [];
        comp.programacionDiariaTrabajoService.newByIntervencionEncabezadoId(comp.mantenimiento.intervenciones[0].id)
            .subscribe(
                data => {
                    let programacion = data;
                    comp.programacion = programacion;
                    this.loader = false;
                    comp.completarConMantenimiento(programacion, comp.mantenimiento);
                    comp.programacionFormRef.callLast(form => {
                        form.model = programacion;
                        form.model.jornada = null;
                        form.transferFromModel();
                    });
                },
                error => {
                    this.loader = false;
                    this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
                });

    }

    onSaveProgramacion() {
        this.loader = true;
        const comp = this;
        comp.programacionFormRef.callLast(form => {
            form.model = comp.programacion;
            form.transferToModel();
            comp.programacionDiariaTrabajoService.post(comp.programacion).subscribe(
                data => {
                    comp.programacionDiariaTrabajoService.getById(data.id).subscribe(
                        d => {
                            comp.programacion = d;
                            comp.refreshData();
                            this.loader = false;
                            this.snackBar.open(this.constants.successEdit, 'X', {
                                duration: 10000,
                                panelClass: ['success-snackbar']
                            });
                        },
                        error => {
                            this.loader = false;
                            this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
                        },
                    );
                },
                error => {
                    this.loader = false;
                    this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
                },
            );
        });
    }

    onSaveProgramacionAll() {
        const comp = this;
        this.loader = true;
        this.changeTransitionCase();
        comp.programacionFormRef.callLast(form => {
            form.model = comp.programacion;
            if (this.isExistPersonal()) {
                form.transferToModel();
                comp.programacion.estado.valor = "PROGRAMADO";
                comp.programacionDiariaTrabajoService.post(comp.programacion).subscribe(
                    data => {
                        this.loader = false;
                        this.snackBar.open(this.constants.successEdit, 'X', {
                            duration: 10000,
                            panelClass: ['success-snackbar']
                        });
                        this.showTransicion = true;
                    },
                    error => {
                        this.loader = false;
                        this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
                    },
                );
            } else {
                this.loader = false;
                this.snackBar.open(this.constants.warningPersonalRequerido, 'X', {
                    duration: 5000,
                    panelClass: ['warning-snackbar']
                });
            }

        });
    }

    isExistPersonal(): Boolean {
        const comp = this;
        if (comp.programacion === undefined || comp.programacion.personal === undefined) {
            return false;
        }
        if (comp.programacion.personal !== undefined && comp.programacion.personal.length > 0) {
            return true;
        }
        return false;
    }

    changeTransitionCase() {
        this.transicionesIndividualAuto = [];
        if (this.programacion.maquinaria.length > 0 && this.programacion.material.length > 0) {
            this.transicionesIndividualAuto.push(this.data.actividad.transiciones[1]); // produccion 6
        }

        if (this.programacion.maquinaria.length <= 0 && this.programacion.material.length > 0) {
            this.transicionesIndividualAuto.push(this.data.actividad.transiciones[3]); // intervencion 14
        }

        if (this.programacion.maquinaria.length > 0 && this.programacion.material.length <= 0) {
            this.transicionesIndividualAuto.push(this.data.actividad.transiciones[1]); // produccion 6
        }

        if (this.programacion.maquinaria.length <= 0 && this.programacion.material.length <= 0) {
            this.transicionesIndividualAuto.push(this.data.actividad.transiciones[2]); // intervencion 8
        }

    }

    onStatusValidProgramacionDiaria(status: boolean) {
        this.statusFormProgramacionDiaria = status;
    }

    isDisabledSaveAll(): Boolean {
        if (this.personalIsEditing === false && this.equipoIsEditing === false &&
            this.maquinariaIsEditing === false && this.materialIsEditing === false && this.personalIsEditing === false) {
            return this.statusFormProgramacionDiaria ? false : true;
        } else {
            return true;
        }
    }

    refreshData(): void {
        const comp = this;
        comp.programacionFormRef.callLast(form => {
            form.model = this.programacion;
            form.transferFromModel;
        });
        comp.personalTableRef.callLast(table => {
            table.model = comp.programacion.personal || [];
            table.refreshDataSource();
        });
        comp.maquinariaTableRef.callLast(table => {
            table.model = comp.programacion.maquinaria || [];
            table.refreshDataSource();
        });
        comp.materialTableRef.callLast(table => {
            table.model = comp.programacion.material || [];
            table.refreshDataSource();
        });
        comp.equipoTableRef.callLast(table => {
            table.model = comp.programacion.equipo || [];
            table.refreshDataSource();
        });

        for (const key in comp.programacion.personal) {
            comp.programacion.personal[key].nombrePersonal = comp.programacion.personal[key].personal ? comp.programacion.personal[key].personal.descripcion : '';
            comp.programacion.personal[key].nombreTipoCuadrilla = comp.programacion.personal[key].tipoCuadrilla ? comp.programacion.personal[key].tipoCuadrilla.descripcion : '';
            comp.programacion.personal[key].nombreInspector1 = comp.programacion.personal[key].inspector1 ? comp.programacion.personal[key].inspector1.descripcion : '';
            comp.programacion.personal[key].nombreInspector2 = comp.programacion.personal[key].inspector2 ? comp.programacion.personal[key].inspector2.descripcion : '';
            comp.programacion.personal[key].nombreInspector3 = comp.programacion.personal[key].inspector3 ? comp.programacion.personal[key].inspector3.descripcion : '';
        }

        for (const key in comp.programacion.maquinaria) {
            comp.programacion.maquinaria[key].numeroInterno = comp.programacion.maquinaria[key].maquinaria ? comp.programacion.maquinaria[key].maquinaria.numeroInterno : '';
            comp.programacion.maquinaria[key].nombreTipoMaquinaria = comp.programacion.maquinaria[key].tipoMaquinaria ? comp.programacion.maquinaria[key].tipoMaquinaria.descripcion : '';
        }

        for (const key in comp.programacion.material) {
            comp.programacion.material[key].nombreOrigenMezcla = comp.programacion.material[key].origenMezcla ? comp.programacion.material[key].origenMezcla.descripcion : '';
            comp.programacion.material[key].nombreTipoMaterial = comp.programacion.material[key].tipoMaterial ? comp.programacion.material[key].tipoMaterial.descripcion : '';
            comp.programacion.material[key].nombreClaseMaterial = comp.programacion.material[key].claseMaterial ? comp.programacion.material[key].claseMaterial.descripcion : '';
        }

        for (const key in comp.programacion.equipo) {
            comp.programacion.equipo[key].nombreEquipo = comp.programacion.equipo[key].equipo ? comp.programacion.equipo[key].equipo.descripcion : '';
        }

    }

    onProgramar() {
        const comp = this;
        comp.programacion.estado.valor = "PROGRAMADO";
        comp.programacionDiariaTrabajoService.post(comp.programacion).subscribe(
            data => {
                this.snackBar.open("Programado", 'X', {
                    duration: 10000,
                    panelClass: ['success-snackbar']
                }); comp.currentAction = "list";
            },
            error => {
                this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
            },
        );
    }

    /**
     * Referencia al formulario de programación
     */
    programacionFormRef = new Ref<ObjectFormComponent>();
    @ViewChild("programacionForm") set _programacionForm(form: ObjectFormComponent) {
        this.programacionFormRef.setReference(form);
    }

    /**
     * Definición del formulario ProgramacionDiariaTrabajo
     */
    programacionFormDef: FormDef = {
        title: "Programación diaria de trabajo",
        fields: [
            { name: "fechaCreacion", label: "Fecha creación programación diaria", type: "calendar" },
            {
                name: "jornada", label: "Jornada", type: "select",
                options: { 
                    path: "/api/administracion/lista/ADMINISTRACION_DISPONIBILIDAD_TURNO/items",
                    listBy: "descripcion" 
                }
            },
            { name: "fechaProgramacion", label: "Fecha programación diaria", type: "calendar" },
            {
                name: "estrategia", label: "Estrategia de Intervención",
                options: { pattern: "^[a-zA-ZÀ-ȕ0-9(),-_.,_/ ]+$" }
            },
            {
                name: "estado", label: "Estado de la programación diaria", type: "select",
                options: { path: "/api/administracion/lista/PROG_DIARIA_TRABAJO_ESTADO/items",
                listBy: "descripcion" }
            },
            { name: "localidad", label: "Localidad" },
            { name: "barrio", label: "Barrio" ,
                options: { pattern: "^(?!\s*$).+" } },
            { name: "ejeVial", label: "Eje vial" },
            { name: "ejeVialDesde", label: "Eje vial (desde)" },
            { name: "ejeVialHasta", label: "Eje vial (hasta)" },
            {
                name: "actividad", label: "Actividad",
                options: { pattern: "^(?!\s*$).+" }
            },
            { name: "civ", label: "CIV" },
            { name: "pk", label: "PK" },
            {
                name: "tipoIntervencion", label: "Tipo de intervención",
                options: { pattern: "^[a-zA-ZÀ-ȕ0-9(),-_.,_/ ]+$" }
            },
            { name: "residenteObra", label: "Residente de obra" },
            { name: "residenteObraTelefono", label: "Teléfono móvil" },
            { name: "directorObra", label: "Director de obra",
                options: { pattern: "^(?!\s*$).+" } },
            { name: "directorObraTelefono", label: "Teléfono móvil" },
            {
                name: "intervencionEncabezado", label: "Intervención para la que se hace la solicitud", type: "select",
                options: { path: "", listBy: "descripcion" }
            },
            { name: "observaciones", label: "Observaciones" },
        ],
        validations: [
            bindings => {
                let fechaProgramacion = bindings["fechaProgramacion"];
                let jornada = bindings["jornada"];
                if (fechaProgramacion == null || jornada == null) {
                    return null;
                }

                let ahora = moment();
                let hoy = moment().hour(0).minute(0).second(0).millisecond(0);
                let hoy2pm = moment().hour(14).minute(0).second(0).millisecond(0);
                let hoy12m = moment().hour(12).minute(0).second(0).millisecond(0);
                let mañana = moment().hour(0).minute(0).second(0).millisecond(0).add(1, 'days');
                let prog = moment(fechaProgramacion, "DD-MM-YYYY");

                if (prog.isBefore(hoy)) {
                    return "Tiempo expirado para generar el reporte diario de programación";
                }
                if (prog.isAfter(mañana)){
                    return "Tiempo expirado para generar el reporte diario de programación";
                }

                if (jornada != null) {
                    
                    if (jornada.valor == "DIURNO") {
                        if (prog.isSame(hoy)) {
                            return "Tiempo expirado para generar el reporte diario de programación";
                        }

                        if (prog.isSame(mañana) && hoy2pm.isBefore(ahora)) {
                            return "Tiempo expirado para generar el reporte diario de programación";
                        }
                    } else if (jornada.valor == "NOCTURNO") {
                        if (prog.isSame(hoy) && hoy12m.isBefore(ahora)) {
                            return "Tiempo expirado para generar el reporte diario de programación";
                        }
                    }
                }
                return null;
            }
        ]
    };


    /**
     * Referencia a la tabla de personal
     */
    personalTableRef = new Ref<ArrayTableComponent>();
    @ViewChild("personalTable") set _personalTable(table: ArrayTableComponent) {
        this.personalTableRef.setReference(table);
    }

    /**
     * Definición de la tabla ProgramacionDiariaTrabajoPersonal
     */
    personalTableDef: TableDef = {
        title: "Personal asociado a la programación diaria de trabajo",
        newElementFn: () => new ProgramacionDiariaTrabajoPersonal(),
        columns: [
            { name: "programacionDiariaTrabajo", label: "Referencia a la programación diaria de trabajo a la que está asociado el registro", property: null },
            { name: "inspector1", label: "Inspector 1" , property: null },
            { name: "inspector2", label: "Inspector 2" , property: null },
            { name: "inspector3", label: "Inspector 3", property: null },
            { name: "personal", label: "Personal" , property: null },
            { name: "tipoCuadrilla", label: "Tipo de cuadrilla" , property: null },
            { name: "nombreInspector1", label: "Inspector 1" , property: null },
            { name: "nombreInspector2", label: "Inspector 2" , property: null },
            { name: "nombreInspector3", label: "Inspector 3", property: null },
            { name: "nombrePersonal", label: "Personal" , property: null },
            { name: "nombreTipoCuadrilla", label: "Tipo de cuadrilla" , property: null },
            { name: "cantidadPersonalInspector", label: "Cantidad de personal por cada inspector" , property: null },
        ],
    };


    clickSeccion(section: String) {
        if ((this.personalIsEditing || this.equipoIsEditing ||
            this.maquinariaIsEditing || this.materialIsEditing || this.personalIsEditing)) {

            // previene que se pregunte 'Abandonar Sección' cuando hago clic sobre la misma sección varias veces
            if ((section === 'personal' && this.personalIsEditing) ||
                (section === 'maquinaria' && this.maquinariaIsEditing) ||
                (section === 'material' && this.materialIsEditing) ||
                (section === 'equipo' && this.equipoIsEditing)) {
                this.wasDefinedSection = false;
                return;
            }

            if (this.wasDefinedSection === false) {
                const dialogConfig = new MatDialogConfig();
                dialogConfig.disableClose = true;
                dialogConfig.autoFocus = true;
                dialogConfig.width = '30%';
                dialogConfig.data = this.constants.confirmarSalidaSeccion;
                const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);
                dialogRef.beforeClosed().subscribe(val => {
                    if (val === 0) {
                        this.wasDefinedSection = true;
                        if (this.personalIsEditing) {
                            this.sectionPersonal.open();
                        }
                        if (this.maquinariaIsEditing) {
                            this.sectionMaquinaria.open();
                        }
                        if (this.materialIsEditing) {
                            this.sectionMaterial.open();
                        }
                        if (this.equipoIsEditing) {
                            this.sectionEquipo.open();
                        }
                    } else {
                        this.cancelIfIsEditing();
                    }
                });
            } else {
                this.wasDefinedSection = false;
            }
        }
    }

    cancelIfIsEditing() {
        if (this.personalIsEditing) {
            this.onCancelPersonal();
        }
        if (this.equipoIsEditing) {
            this.onCancelEquipo();
        }
        if (this.maquinariaIsEditing) {
            this.onCancelMaquinaria();
        }
        if (this.materialIsEditing) {
            this.onCancelMaterial();
        }
    }

    onEditPersonal(index: number) {
        const comp = this;
        comp.personalIndex = index;
        let personal = comp.programacion.personal[index];
        comp.personalIsEditing = true;
        comp.personalFormRef.callLast(form => {
            form.model = personal;
            form.transferFromModel();
        });
    }

    onDeletePersonal(index: number) {
        const comp = this;
        for (let i = index + 1; i < comp.programacion.personal.length; i++) {
            comp.programacion.personal[i - 1] = comp.programacion.personal[i];
        }
        comp.programacion.personal.pop();
        comp.personalTableRef.callLast(table => table.refreshDataSource());
    }

    onNewPersonal() {
        const comp = this;
        let personal = new ProgramacionDiariaTrabajoPersonal();
        comp.personalFormRef.callLast(form => {
            form.model = personal;
            form.transferFromModel();
        });
        comp.personalIsEditing = true;
    }

    onSavePersonal() {
        const comp = this;
        if (comp.personalIndex == -1) {
            let personal = new ProgramacionDiariaTrabajoPersonal();
            if (comp.programacion.personal == null) {
                comp.programacion.personal = [];
            }
            let clonePersonal = JSON.parse(JSON.stringify(comp.programacion.personal));
            comp.personalFormRef.callLast(form => {
                form.model = personal;
                form.transferToModel();
                comp.programacion.personal.push(personal);

                let indexNew = comp.programacion.personal.length -1;
                comp.programacion.personal[indexNew].nombrePersonal = comp.programacion.personal[indexNew].personal ? comp.programacion.personal[indexNew].personal.descripcion : '';
                comp.programacion.personal[indexNew].nombreTipoCuadrilla = comp.programacion.personal[indexNew].tipoCuadrilla ? comp.programacion.personal[indexNew].tipoCuadrilla.descripcion : '';
                comp.programacion.personal[indexNew].nombreInspector1 = comp.programacion.personal[indexNew].inspector1 ? comp.programacion.personal[indexNew].inspector1.descripcion : '';
                comp.programacion.personal[indexNew].nombreInspector2 = comp.programacion.personal[indexNew].inspector2 ? comp.programacion.personal[indexNew].inspector2.descripcion : '';
                comp.programacion.personal[indexNew].nombreInspector3 = comp.programacion.personal[indexNew].inspector3 ? comp.programacion.personal[indexNew].inspector3.descripcion : '';

                let inspector1: ListaItem = personal.inspector1;
                let inspector2: ListaItem = personal.inspector2;
                let inspector3: ListaItem = personal.inspector3;
                let isValid = new Stream([inspector1, inspector2, inspector3])
                    .filter(x => x != null)
                    .groupBy([x => x.id])
                    .filter(x => x.length > 1)
                    .toArray().length === 0;
                if (isValid === true) {
                    comp.personalIsEditing = false;
                } else {
                    comp.programacion.personal = clonePersonal;
                    this.snackBar.open('¡Inspector de cuadrilla ya registrado para el Pk!', 'X', {
                        duration: 5000,
                        panelClass: ['error-snackbar']
                    });
                }
            });
        } else {
            let personal = comp.programacion.personal[comp.personalIndex];
            let clonePersonal = JSON.parse(JSON.stringify(comp.programacion.personal));
            comp.personalFormRef.callLast(form => {
                form.model = personal;
                form.transferToModel();
                comp.programacion.personal[comp.personalIndex].nombrePersonal = comp.programacion.personal[comp.personalIndex].personal ? comp.programacion.personal[comp.personalIndex].personal.descripcion : '';
                comp.programacion.personal[comp.personalIndex].nombreTipoCuadrilla = comp.programacion.personal[comp.personalIndex].tipoCuadrilla ? comp.programacion.personal[comp.personalIndex].tipoCuadrilla.descripcion : '';
                comp.programacion.personal[comp.personalIndex].nombreInspector1 = comp.programacion.personal[comp.personalIndex].inspector1 ? comp.programacion.personal[comp.personalIndex].inspector1.descripcion : '';
                comp.programacion.personal[comp.personalIndex].nombreInspector2 = comp.programacion.personal[comp.personalIndex].inspector2 ? comp.programacion.personal[comp.personalIndex].inspector2.descripcion : '';
                comp.programacion.personal[comp.personalIndex].nombreInspector3 = comp.programacion.personal[comp.personalIndex].inspector3 ? comp.programacion.personal[comp.personalIndex].inspector3.descripcion : '';
                let inspector1: ListaItem = personal.inspector1;
                let inspector2: ListaItem = personal.inspector2;
                let inspector3: ListaItem = personal.inspector3;
                let isValid = new Stream([inspector1, inspector2, inspector3])
                    .filter(x => x != null)
                    .groupBy([x => x.id])
                    .filter(x => x.length > 1)
                    .toArray().length === 0;
                if (isValid === true) {
                    comp.personalIsEditing = false;
                } else {
                    comp.programacion.personal = clonePersonal;
                    this.snackBar.open('¡Inspector de cuadrilla ya registrado para el Pk!', 'X', {
                        duration: 5000,
                        panelClass: ['error-snackbar']
                    });
                }
            });
        }
        comp.personalIndex = -1;
    }

    onCancelPersonal() {
        const comp = this;
        comp.personalIsEditing = false;
        comp.personalIndex = -1;
    }

    personalIndex = -1;

    personalIsEditing = false;

    /**
     * Referencia al formulario de personal
     */
    personalFormRef = new Ref<ObjectFormComponent>();
    @ViewChild("personalForm") set _personalForm(form: ObjectFormComponent) {
        this.personalFormRef.setReference(form);
    }

    /**
     * Definición del formulario ProgramacionDiariaTrabajoPersonal
     */
    personalFormDef: FormDef = {
        title: "Personal asociado a la programación diaria de trabajo",
        fields: [
            {
                name: "programacionDiariaTrabajo", label: "Referencia a la programación diaria de trabajo a la que está asociado el registro", type: "select",
                options: { path: "", listBy: "descripcion" }
            },
            {
                name: "inspector1", label: "Inspector 1", type: "select",
                options: { path: "/api/administracion/lista/INSPECTOR/items", listBy: "descripcion" }
            },
            {
                name: "inspector2", label: "Inspector 2", type: "select",
                options: { path: "/api/administracion/lista/INSPECTOR/items", listBy: "descripcion" }
            },
            {
                name: "inspector3", label: "Inspector 3", type: "select",
                options: { path: "/api/administracion/lista/INSPECTOR/items", listBy: "descripcion" }
            },
            {
                name: "personal", label: "Personal", type: "select",
                options: { path: "/api/administracion/lista/TIPO_PERSONAL/items", listBy: "descripcion" }
            },
            {
                name: "tipoCuadrilla", label: "Tipo de cuadrilla", type: "select",
                options: { path: "/api/administracion/lista/TIPO_CUADRILLA/items", listBy: "descripcion" }
            },
            {
                name: "cantidadPersonalInspector", type: "number", label: "Cantidad de personal por cada inspector",
                options: { maxlength: "5"},
                validators: [Validators.min(1)]
            },
        ],
        onValueChanges: form => {
            const fg = form.formGroup;
            let cantidadControl = fg.get("cantidadPersonalInspector");
            let inspector1Control = fg.get("inspector1");
            let inspector2Control = fg.get("inspector2");
            let inspector3Control = fg.get("inspector3");
            let personalControl = fg.get("personal");
            let tipoCuadrillaControl = fg.get("tipoCuadrilla");

            let habilitarInspector2 = inspector1Control.value != null;
            if (habilitarInspector2) {
                inspector2Control.enable({ onlySelf: true });
            } else {
                inspector2Control.disable({ onlySelf: true });
                inspector2Control.setValue(null, { emitEvent: false });
            }

            let habilitarInspector3 = inspector2Control.value != null;
            if (habilitarInspector3) {
                inspector3Control.enable({ onlySelf: true });
            } else {
                inspector3Control.disable({ onlySelf: true });
                inspector3Control.setValue(null, { emitEvent: false });
            }

            let habilitarCantidad =
                personalControl.value != null
                && tipoCuadrillaControl.value
                && inspector1Control.value != null;
            if (habilitarCantidad) {
                cantidadControl.enable({ onlySelf: true });
            } else {
                cantidadControl.disable({ onlySelf: true });
                cantidadControl.setValue(null, { emitEvent: false });
            }
        }
    };

    /**
     * Referencia a la tabla de maquinaria
     */
    maquinariaTableRef = new Ref<ArrayTableComponent>();
    @ViewChild("maquinariaTable") set _maquinariaTable(table: ArrayTableComponent) {
        this.maquinariaTableRef.setReference(table);
    }

    /**
     * Definición de la tabla ProgramacionDiariaTrabajoMaquinaria
     */
    maquinariaTableDef: TableDef = {
        title: "Maquinaria asociado a la programación diaria de trabajo",
        newElementFn: () => new ProgramacionDiariaTrabajoMaquinaria(),
        columns: [
            { name: "programacionDiariaTrabajo", label: "Referencia a la programación diaria de trabajo a la que está asociado el registro" , property: null },
            { name: "maquinaria", label: "Maquinaria", property: "numeroInterno" },
            { name: "numeroInterno", label: "Maquinaria", property: null },
            { name: "tipoMaquinaria", label: "Tipo de maquinaria" , property: null },
            { name: "nombreTipoMaquinaria", label: "Tipo de maquinaria" , property: null },
            { name: "hora", label: "Hora" , property: null },
        ],
    };

    onEditMaquinaria(index: number) {
        const comp = this;
        comp.maquinariaIndex = index;
        let maquinaria = comp.programacion.maquinaria[index];
        comp.maquinariaFormRef.callLast(form => {
            form.model = maquinaria;
            form.transferFromModel();
        });
        comp.maquinariaIsEditing = true;
    }

    onDeleteMaquinaria(index: number) {
        const comp = this;
        for (let i = index + 1; i < comp.programacion.maquinaria.length; i++) {
            comp.programacion.maquinaria[i - 1] = comp.programacion.maquinaria[i];
        }
        comp.programacion.maquinaria.pop();
        comp.maquinariaTableRef.callLast(table => table.refreshDataSource());
    }

    onNewMaquinaria() {
        const comp = this;
        let maquinaria = new ProgramacionDiariaTrabajoMaquinaria();
        comp.maquinariaFormRef.callLast(form => {
            form.model = maquinaria;
            form.transferFromModel();
        });
        comp.maquinariaIsEditing = true;
    }

    onNewMaquinariaLast() {
        const comp = this;
        let maquinaria = new ProgramacionDiariaTrabajoMaquinaria();
        comp.maquinariaFormRef.callLast(form => {
            form.model = maquinaria;
            form.transferFromModel();
        });
        comp.maquinariaIsEditing = true;
    }

    onSaveMaquinaria() {
        const comp = this;
        if (comp.maquinariaIndex == -1) {
            let maquinaria = new ProgramacionDiariaTrabajoMaquinaria();
            if (comp.programacion.maquinaria == null) {
                comp.programacion.maquinaria = [];
            }
            comp.programacion.maquinaria.push(maquinaria);
            comp.maquinariaFormRef.callLast(form => {
                form.model = maquinaria;
                form.transferToModel();
                comp.maquinariaIsEditing = false;

                let indexNew = comp.programacion.maquinaria.length -1;
                comp.programacion.maquinaria[indexNew].numeroInterno = comp.programacion.maquinaria[indexNew].maquinaria ? comp.programacion.maquinaria[indexNew].maquinaria.numeroInterno : '';
                comp.programacion.maquinaria[indexNew].nombreTipoMaquinaria = comp.programacion.maquinaria[indexNew].tipoMaquinaria ? comp.programacion.maquinaria[indexNew].tipoMaquinaria.descripcion : '';
            });
        } else {
            let maquinaria = comp.programacion.maquinaria[comp.maquinariaIndex];
            comp.maquinariaFormRef.callLast(form => {
                form.model = maquinaria;
                form.transferToModel();
                comp.maquinariaIsEditing = false;
            });
            comp.programacion.maquinaria[comp.maquinariaIndex].numeroInterno = comp.programacion.maquinaria[comp.maquinariaIndex].maquinaria ? comp.programacion.maquinaria[comp.maquinariaIndex].maquinaria.numeroInterno : '';
            comp.programacion.maquinaria[comp.maquinariaIndex].nombreTipoMaquinaria = comp.programacion.maquinaria[comp.maquinariaIndex].tipoMaquinaria ? comp.programacion.maquinaria[comp.maquinariaIndex].tipoMaquinaria.descripcion : '';
        }
        comp.maquinariaIndex = -1;
    }

    onCancelMaquinaria() {
        const comp = this;
        comp.maquinariaIsEditing = false;
        comp.maquinariaIndex = -1;
    }

    maquinariaIndex = -1;

    maquinariaIsEditing = false;

    /**
     * Referencia al formulario de maquinaria
     */
    maquinariaFormRef = new Ref<ObjectFormComponent>();
    @ViewChild("maquinariaForm") set _maquinariaForm(form: ObjectFormComponent) {
        this.maquinariaFormRef.setReference(form);
    }

    /**
     * Definición del formulario ProgramacionDiariaTrabajoMaquinaria
     */
    maquinariaFormDef: FormDef = {
        title: "Maquinaria asociado a la programación diaria de trabajo",
        fields: [
            {
                name: "programacionDiariaTrabajo", label: "Referencia a la programación diaria de trabajo a la que está asociado el registro", type: "select",
                options: { path: "", listBy: "descripcion" }
            },
            {
                name: "maquinaria", label: "Maquinaria", type: "autocomplete",
                options: {
                    path: "/api/administracion/equipo/searchAutocompletarMaquinariaDisponible",
                    searchBy: "query",
                    moreInfo: {numeroInterno: 'numeroInterno', placaInventario: 'placaInventario'},
                }
            },
            {
                name: "tipoMaquinaria", label: "Tipo de maquinaria", type: "select",
                options: { path: "/api/administracion/lista/TIPO_MAQUINARIA/items", listBy: "descripcion" }
            },
            { name: "hora", label: "Hora", type: "timer" },
        ],
    };

    /**
     * Referencia a la tabla de material
     */
    materialTableRef = new Ref<ArrayTableComponent>();
    @ViewChild("materialTable") set _materialTable(table: ArrayTableComponent) {
        this.materialTableRef.setReference(table);
    }

    /**
     * Definición de la tabla ProgramacionDiariaTrabajoMaterial
     */
    materialTableDef: TableDef = {
        title: "MAterial asociado a la programación diaria de trabajo",
        newElementFn: () => new ProgramacionDiariaTrabajoMaterial(),
        columns: [
            { name: "programacionDiariaTrabajo", label: "Referencia a la programación diaria de trabajo a la que está asociado el registro" , property: null },
            { name: "origenMezcla", label: "Origen mezcla" , property: null },
            { name: "nombreOrigenMezcla", label: "Origen mezcla" , property: null },
            { name: "tipoMaterial", label: "Tipo de material" , property: null },
            { name: "nombreTipoMaterial", label: "Tipo de material" , property: null },
            { name: "claseMaterial", label: "Clase de material" , property: null },
            { name: "nombreClaseMaterial", label: "Clase de material" , property: null },
            { name: "cantidad", label: "Cantidad(m3)", property: null },
        ],
    };

    onEditMaterial(index: number) {
        const comp = this;
        comp.materialIndex = index;
        let material = comp.programacion.material[index];
        comp.materialFormRef.callLast(form => {
            form.model = material;
            form.transferFromModel();
        });
        comp.materialIsEditing = true;
    }

    onDeleteMaterial(index: number) {
        const comp = this;
        for (let i = index + 1; i < comp.programacion.material.length; i++) {
            comp.programacion.material[i - 1] = comp.programacion.material[i];
        }
        comp.programacion.material.pop();
        comp.materialTableRef.callLast(table => table.refreshDataSource());
    }

    onNewMaterial() {
        const comp = this;
        const material = new ProgramacionDiariaTrabajoMaterial();
        comp.materialFormRef.callLast(form => {
            form.model = material;
            form.transferFromModel();
        });
        comp.materialIsEditing = true;
    }

    onSaveMaterial() {
        const claseMaterial = new ListaItem();
        claseMaterial.id = 1001;
        claseMaterial.listaId = 3185;
        claseMaterial.valor = '1001';
        claseMaterial.descripcion = 'CEMENTO';
        claseMaterial.activo = true;
        claseMaterial.eliminado = true;

        const comp = this;
        let cloneMaterial = JSON.parse(JSON.stringify(comp.programacion.material));
        let isValid = true;

        if (comp.materialIndex === -1) {
            const material = new ProgramacionDiariaTrabajoMaterial();
            if (comp.programacion.material == null) {
                comp.programacion.material = [];
            }
            comp.materialFormRef.callLast(form => {

                material.claseMaterial = claseMaterial;
                form.model = material;
                form.transferToModel();
                comp.programacion.material.forEach(element => {
                    if (element.origenMezcla.id !== material.origenMezcla.id) {
                        isValid = false;
                    }
                });
                comp.programacion.material.push(material);
                let indexNew = comp.programacion.material.length -1;
                comp.programacion.material[indexNew].nombreOrigenMezcla = comp.programacion.material[indexNew].origenMezcla ? comp.programacion.material[indexNew].origenMezcla.descripcion : '';
                comp.programacion.material[indexNew].nombreTipoMaterial = comp.programacion.material[indexNew].tipoMaterial ? comp.programacion.material[indexNew].tipoMaterial.descripcion : '';
                comp.programacion.material[indexNew].nombreClaseMaterial = comp.programacion.material[indexNew].claseMaterial ? comp.programacion.material[indexNew].claseMaterial.descripcion : '';

                if (isValid === true) {
                    comp.materialIsEditing = false;
                } else {
                    comp.programacion.material = cloneMaterial;
                    this.snackBar.open('¡Solamente se puede un origen de mezcla para los materiales!', 'X', {
                        duration: 5000,
                        panelClass: ['error-snackbar']
                    });
                }
            });
        } else {
            let material = comp.programacion.material[comp.materialIndex];
            comp.materialFormRef.callLast(form => {
                form.model = material;
                form.transferToModel();
                comp.programacion.material[comp.materialIndex].nombreOrigenMezcla = comp.programacion.material[comp.materialIndex].origenMezcla ? comp.programacion.material[comp.materialIndex].origenMezcla.descripcion : '';
                comp.programacion.material[comp.materialIndex].nombreTipoMaterial = comp.programacion.material[comp.materialIndex].tipoMaterial ? comp.programacion.material[comp.materialIndex].tipoMaterial.descripcion : '';
                comp.programacion.material[comp.materialIndex].nombreClaseMaterial = comp.programacion.material[comp.materialIndex].claseMaterial ? comp.programacion.material[comp.materialIndex].claseMaterial.descripcion : '';
                comp.programacion.material.forEach(element => {
                    if (element.origenMezcla.id !== material.origenMezcla.id) {
                        isValid = false;
                    }
                });
                if (isValid === true) {
                    comp.materialIsEditing = false;
                } else {
                    comp.programacion.material = cloneMaterial;
                    this.snackBar.open('¡Solamente se puede un origen de mezcla para los materiales!', 'X', {
                        duration: 5000,
                        panelClass: ['error-snackbar']
                    });
                }
            });
        }
        comp.materialIndex = -1;
    }

    onCancelMaterial() {
        const comp = this;
        comp.materialIsEditing = false;
        comp.materialIndex = -1;
    }

    materialIndex = -1;

    materialIsEditing = false;

    /**
     * Referencia al formulario de material
     */
    materialFormRef = new Ref<ObjectFormComponent>();
    @ViewChild("materialForm") set _materialForm(form: ObjectFormComponent) {
        this.materialFormRef.setReference(form);
    }

    /**
     * Definición del formulario ProgramacionDiariaTrabajoMaterial
     */
    materialFormDef: FormDef = {
        title: "Material asociado a la programación diaria de trabajo",
        fields: [
            {
                name: "programacionDiariaTrabajo", label: "Referencia a la programación diaria de trabajo a la que está asociado el registro", type: "select",
                options: { path: "", listBy: "descripcion" }
            },
            {
                name: "origenMezcla", label: "Origen mezcla", type: "select",
                options: { path: "/api/administracion/lista/PRODUCCION_ORIGEN_MEZCLA/items", listBy: "descripcion" }
            },
            {
                name: "tipoMaterial", label: "Tipo de material", type: "select",
                options: { path: "/api/administracion/lista/TIPO_MATERIAL/items", listBy: "descripcion" }
            },
            {
                name: "claseMaterial", label: "Clase de material", type: "select",
                options: { listBy: "descripcion" }
            },
            { name: "cantidad", label: "Cantidad(m3)" },
            { name: "hora", label: "Hora", type: "timer" }
        ],
        onValueChanges: form => {
            const fg = form.formGroup;
            let origenMezcla = fg.get("origenMezcla");
            let tipoMaterial = fg.get("tipoMaterial");
            let claseMaterial = fg.get("claseMaterial");
            let cantidad = fg.get("cantidad");
            let hora = fg.get("hora");

            let tipoMaterialHabilitado =
                origenMezcla.value != null;

            let claseMaterialHabilitado =
                origenMezcla.value != null
                && tipoMaterial.value != null;

            let cantidadHabilitado =
                claseMaterial.value != null;

            let horaHabilitado =
                claseMaterial.value != null
                && cantidad.value != null;

            if (cantidadHabilitado) {
                cantidad.enable({ emitEvent: false });
            } else {
                cantidad.disable({ emitEvent: false });
                cantidad.setValue(null, { emitEvent: false });
            }

            if (horaHabilitado) {
                hora.enable({ emitEvent: false });
            } else {
                hora.disable({ emitEvent: false });
                hora.setValue(null, { emitEvent: false });
            }

            if (tipoMaterial.value != null && tipoMaterial.value != "") {
                const current = parseInt(tipoMaterial.value.valor);
                const next = current + 100;
                form.def.fields
                    .filter(x => x.name == "claseMaterial")
                    .forEach(x => {
                        let org = x.options.options;
                        let filtered = org.filter(y => current < parseInt(y.valor) && parseInt(y.valor) < next);
                        x.options.currentOptions = filtered;
                        let notPresent = filtered
                            .filter(y => claseMaterial.value != null && y.id == claseMaterial.value.id)
                            .length == 0;
                        if (notPresent) {
                            claseMaterial.setValue("", { emitEvent: false });
                        }
                    });
                    if (current === 500) {
                        cantidad.setValidators([Validators.required, Validators.pattern("^[0-9]*$")]);
                    } else {
                        cantidad.setValidators([Validators.required, Validators.pattern("^[1-9][0-9]{0,13}(|,[0-9]{1,2})$")]);
                    }
            }
        }
    };


    /**
     * Referencia a la tabla de equipo
     */
    equipoTableRef = new Ref<ArrayTableComponent>();
    @ViewChild("equipoTable") set _equipoTable(table: ArrayTableComponent) {
        this.equipoTableRef.setReference(table);
    }

    /**
     * Definición de la tabla ProgramacionDiariaTrabajoEquipo
     */
    equipoTableDef: TableDef = {
        title: "Equipo asociado a la programación diaria de trabajo",
        newElementFn: () => new ProgramacionDiariaTrabajoEquipo(),
        columns: [
            { name: "programacionDiariaTrabajo", label: "Referencia a la programación diaria de trabajo a la que está asociado el registro" , property: null },
            { name: "equipo", label: "Equipo" , property: null },
            { name: "nombreEquipo", label: "Equipo" , property: null },
            { name: "cantidad", label: "Cantidad(m3)" , property: null },
            { name: "hora", label: "Hora" , property: null },
        ],
    };

    onEditEquipo(index: number) {
        const comp = this;
        comp.equipoIndex = index;
        let equipo = comp.programacion.equipo[index];
        comp.equipoFormRef.callLast(form => {
            form.model = equipo;
            form.transferFromModel();
        });
        comp.equipoIsEditing = true;
    }

    onDeleteEquipo(index: number) {
        const comp = this;
        for (let i = index + 1; i < comp.programacion.equipo.length; i++) {
            comp.programacion.equipo[i - 1] = comp.programacion.equipo[i];
        }
        comp.programacion.equipo.pop();
        comp.equipoTableRef.callLast(table => table.refreshDataSource());
    }

    onNewEquipo() {
        const comp = this;
        let equipo = new ProgramacionDiariaTrabajoEquipo();
        comp.equipoFormRef.callLast(form => {
            form.model = equipo;
            form.transferFromModel();
        });
        comp.equipoIsEditing = true;
    }

    onSaveEquipo() {
        const comp = this;
        if (comp.equipoIndex == -1) {
            let equipo = new ProgramacionDiariaTrabajoEquipo();
            if (comp.programacion.equipo == null) {
                comp.programacion.equipo = [];
            }
            comp.programacion.equipo.push(equipo);
            comp.equipoFormRef.callLast(form => {
                form.model = equipo;
                form.transferToModel();
                comp.equipoIsEditing = false;
            });
            let indexNew = comp.programacion.equipo.length -1;
            comp.programacion.equipo[indexNew].nombreEquipo = comp.programacion.equipo[indexNew].equipo ? comp.programacion.equipo[indexNew].equipo.descripcion : '';

        } else {
            let equipo = comp.programacion.equipo[comp.equipoIndex];
            comp.equipoFormRef.callLast(form => {
                form.model = equipo;
                form.transferToModel();
                comp.equipoIsEditing = false;
            });
            comp.programacion.equipo[comp.equipoIndex].nombreEquipo = comp.programacion.equipo[comp.equipoIndex].equipo ? comp.programacion.equipo[comp.equipoIndex].equipo.descripcion : '';

        }
        comp.equipoIndex = -1;
    }

    onCancelEquipo() {
        const comp = this;
        comp.equipoIsEditing = false;
        comp.equipoIndex = -1;
    }

    equipoIndex = -1;

    equipoIsEditing = false;

    /**
     * Referencia al formulario de equipo
     */
    equipoFormRef = new Ref<ObjectFormComponent>();
    @ViewChild("equipoForm") set _equipoForm(form: ObjectFormComponent) {
        this.equipoFormRef.setReference(form);
    }

    /**
     * Definición del formulario ProgramacionDiariaTrabajoEquipo
     */
    equipoFormDef: FormDef = {
        title: "Equipo asociado a la programación diaria de trabajo",
        fields: [
            {
                name: "programacionDiariaTrabajo", label: "Referencia a la programación diaria de trabajo a la que está asociado el registro", type: "select",
                options: { path: "", listBy: "descripcion" }
            },
            {
                name: "equipo", label: "Equipo", type: "select",
                options: { path: "/api/administracion/lista/EQUIPO_LUMINARIA/items", listBy: "descripcion" }
            },
            {
                name: "cantidad", label: "Cantidad(m3)",
                options: { pattern: "^[1-9][0-9]{0,13}(|,[0-9]{1,2})$" }
            },
            { name: "hora", label: "Hora", type: "timer" },
        ],
        onValueChanges: form => {
            const fg = form.formGroup;
            let equipo = fg.get("equipo");
            let cantidad = fg.get("cantidad");
            let hora = fg.get("hora");

            let cantidadHabilitado =
                equipo.value != null;

            let horaHabilitado =
                equipo.value != null
                && cantidad.value != null;

            if (cantidadHabilitado) {
                cantidad.enable({ emitEvent: false });
            } else {
                cantidad.disable({ emitEvent: false });
                cantidad.setValue(null, { emitEvent: false });
            }

            if (horaHabilitado) {
                hora.enable({ emitEvent: false });
            } else {
                hora.disable({ emitEvent: false });
                hora.setValue(null, { emitEvent: false });
            }
        }
    };



    hideMap() {
        if (this.mapService.getGrid() != null) {
            this.mapService.getGrid().clear();
        }
        this.mapService.disconectGrid();
        this.mapService.getVisor().limpiar();
        this.mapService.getVisor().visible = false;
        this.utilitiesServices.scrollToTop();
        this.currentAction = this.constants.currentAction.registrarProgramacionDiaria;
    }

    completarConMantenimiento(data: ProgramacionDiariaTrabajo, mantenimiento: WorkflowMantenimientoModel): void {
        // Pecompleta la información proveniente del mantenimiento
        data.actividad = mantenimiento.actividad;
        data.barrio = mantenimiento.barrio ? mantenimiento.barrio.nombre : '';
        data.civ = mantenimiento.civ;
        data.directorObra = mantenimiento.directorObra ? mantenimiento.directorObra.nombresYapellidos : "";
        // tslint:disable-next-line: max-line-length
        data.directorObraTelefono = mantenimiento.directorObra ? mantenimiento.directorObra.persona ? mantenimiento.directorObra.persona.telefono : '' : '';
        //        data.directorObraTelefono = "";
        data.ejeVial = mantenimiento.ejeVial;
        data.ejeVialDesde = mantenimiento.desde;
        data.ejeVialHasta = mantenimiento.hasta;
        let intervencion = new IntervencionEncabezado();
        intervencion.id = mantenimiento.intervenciones[0].id;
        data.intervencionEncabezado = intervencion;
        data.localidad = mantenimiento.localidad ? mantenimiento.localidad.nombre : '';
        data.pk = mantenimiento.pk;
        data.residenteObra = mantenimiento.residenteObra ? mantenimiento.residenteObra.nombresYapellidos : "";
        // tslint:disable-next-line: max-line-length
        data.residenteObraTelefono = mantenimiento.residenteObra ? mantenimiento.residenteObra.persona ? mantenimiento.residenteObra.persona.telefono : '' : '';
        //        data.residenteObraTelefono = "";
        // tslint:disable-next-line: max-line-length
        data.tipoIntervencion = mantenimiento.diagnostico ? this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal ? this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal.descripcion : '' : '';
        data.estrategia = mantenimiento.estrategia ? this.mantenimiento.estrategia.descripcion : "";
    }

}
