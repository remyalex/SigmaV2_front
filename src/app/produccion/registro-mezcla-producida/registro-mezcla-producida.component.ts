import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialogConfig, MatDialog, MatTableDataSource, MatSnackBarRef } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { TableDef, ArrayTableComponent } from 'src/app/shared/component/sg-array-table/sg-array-table.component';
import { Utils, Ref } from 'src/app/shared/utils/global-functions';
import { ObjectFormComponent, FormDef } from 'src/app/shared/component/sg-object-form/sg-object-form.component';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { IntervencionEncabezado } from 'src/app/intervencion/visitatecnicaverificacion/visita-verificacion-admin/models/intervencionEncabezado.model';
//import { SolicitudMezclaService } from 'src/app/produccion/mezcla/solicitud-mezcla.service';
import { SolicitudMezcla } from 'src/app/produccion/mezcla/solicitud-mezcla.model';
import { SolicitudMezclaCriteria } from '../mezcla/solicitud-mezcla-criteria.model';
import { SolicitudMezclaMaterial } from '../mezcla/solicitud-mezcla-material.model';
import { SolicitudMezclaService } from '../mezcla/solicitud-mezcla.service';


@Component({
    selector: 'app-registro-mezcla-producida',
    templateUrl: './registro-mezcla-producida.component.html'
})
export class RegistroMezclaProducidaComponent implements OnInit {

    currentAction = "buscar";
    processing = false;

    constructor(
        servicio: MantenimientoService,
        commonService: CommonService,
        formBuilder: FormBuilder,
        workflowService: WorkflowService,
        excelService: ExcelService,
        private utilitiesServices: UtilitiesService,
        private snackBar: MatSnackBar,
        tokenStorageService: TokenStorageService,
        private mapService: MapService,
        private dialog: MatDialog,
        private solicitudMezclaService: SolicitudMezclaService,
    ) {

    }

    ngOnInit() {
        this.currentAction = "buscar";
    }

    onBack(): void {
        this.ngOnInit();
        this.mapService.getVisor().visible = true;
        this.currentAction = 'list';
    }

    onBackRegistro(): void {

    }

    back(event) {
        this.ngOnInit();
        this.mapService.getVisor().visible = true;
        this.currentAction = event.currentAction;
    }

    // ---------------------- SOLICITUDES

    /**
     * Modelo de todas las solicitudes
     */
    solicitudes: SolicitudMezcla[] = [];

    /**
     * Referencia a la tabla de solicitudes
     */
    solicitudesTableRef = new Ref<ArrayTableComponent>();
    @ViewChild("solicitudesTable") set _solicitudesTableRef(x: ArrayTableComponent) {
        this.solicitudesTableRef.setReference(x);
    }

    /**
     * Definición de la tabla de solicitudes
     */
    solicitudesTableDef: TableDef = {
        title: "Solicitudes de mezcla",
        newElementFn: () => new SolicitudMezcla(),
        columns: [
            { name: "id", label: "Número de solicitud" , property: null },
            { name: "fechaSolicitud", label: "Fecha de solicitud" , property: null },
            { name: "jornada", label: "Turno" , property: null },
            { name: "tipoMaterial", label: "Material" , property: null },
            { name: "cantidad", label: "Cantidad" , property: null }
        ],
    };

    solicitud = new SolicitudMezcla();

    onEditSolicitud(index: number) {
        this.currentAction = "detalle";
        const comp = this;
        let solicitud = comp.solicitudes[index];
        comp.solicitud = solicitud;
        comp.solicitudDetalleFormRef.callLast(form => {
            form.model = comp.solicitud;
            form.transferFromModel();
        });
        comp.solicitudDetalleTableRef.callLast(table => {
            table.model = comp.solicitud.materiales;
            table.refreshDataSource();
        });
    }

    /**
     * Definición del formulario de búsqueda
     */
    solicitudesCriteriaFormDef: FormDef = {
        title: "Búsqueda de solicitudes de mezcla",
        fields: [
            { name: "fechaProgramacionDesde", label: "Fecha desde", type: "calendar" },
            { name: "fechaProgramacionHasta", label: "Fecha hasta", type: "calendar" },
            {
                name: "jornada", label: "Jornada", type: "select", options: {
                    path: "/api/administracion/lista/TAB_CONSOLIDADO_DIARIO_OBRA_ID_TIPO_JORNADA/items",
                    listBy: "descripcion"
                }
            },
            {
                name: "tipoMaterial", label: "Tipo de material", type: "select", options: {
                    path: "/api/administracion/lista/TIPO_MATERIAL/items",
                    listBy: "descripcion"
                }
            }
        ]
    }

    /**
     * Referencia al formulario de búsqueda
     */
    solicitudesCriteriaFormRef = new Ref<ObjectFormComponent>();
    @ViewChild("solicitudesCriteriaForm") set _solicitudesCriteriaForm(x: ObjectFormComponent) {
        this.solicitudesCriteriaFormRef.setReference(x);
    }

    /**
     * Maneja el evento de búsqueda
     */
    onBuscar(): void {
        const comp = this;
        comp.solicitudesCriteriaFormRef.callLast(form => {
            const criteria = new SolicitudMezclaCriteria();
            form.model = criteria;
            form.transferToModel();
            comp.solicitudMezclaService.search(criteria).subscribe(
                data => {
                    comp.solicitudesTableRef.callLast(table => {
                        comp.solicitudes = data.content;
                        table.model = comp.solicitudes;
                        table.refreshDataSource();
                    });
                },
                error => { comp.snackBar.open(Utils.friendlyHttpError(error), "Cerrar", { duration: 10000 }) }
            );
        });
    }

    /**
     * Referencia al formulario de detalle
     */
    solicitudDetalleFormRef = new Ref<ObjectFormComponent>();
    @ViewChild("solicitudDetalleForm") set _solicitudDetalleForm(x: ObjectFormComponent) {
        this.solicitudDetalleFormRef.setReference(x);
    }

    /**
     * Referencia a la tabla de detalle
     */
    solicitudDetalleTableRef = new Ref<ArrayTableComponent>();
    @ViewChild("solicitudDetalleTable") set _solicitudDetalleTable(x: ArrayTableComponent) {
        this.solicitudDetalleTableRef.setReference(x);
    }

    /**
     * Definición del formulario de detalle
     */
    solicitudDetalleFormDef: FormDef = {
        title: "Detalle de la solicitud",
        fields: [
            { name: "id", label: "Número de solicitud" },
            {
                name: "jornada", label: "Jornada", type: "select", options: {
                    path: "/api/administracion/lista/TAB_CONSOLIDADO_DIARIO_OBRA_ID_TIPO_JORNADA/items",
                    listBy: "descripcion"
                }
            },
        ]
    };

    /**
     * Definición de la tabla de detalle de la solicitud
     */
    solicitudDetalleTableDef: TableDef = {
        title: "Detalle de la solicitud",
        newElementFn: () => new SolicitudMezclaMaterial(),
        columns: [
            { name: "tipoMaterial", label: "Material" , property: null },
            { name: "unidad", label: "Unidad" , property: null },
            { name: "cantidad", label: "Cantidad" , property: null },
            { name: "cantidadDespachada", label: "Cantidad despachada" , property: null },
            { name: "barrio", label: "Barrio" , property: null },
            { name: "placa", label: "Placa/No. interno" , property: null },
            { name: "localidad", label: "Localidad destino" , property: null },
            { name: "pk", label: "PK destino" , property: null },
            { name: "civ", label: "CIV" , property: null },
            { name: "eje", label: "Eje" , property: null },
            { name: "ejeDesde", label: "Eje vial (desde)" , property: null },
            { name: "ejeHasta", label: "Eje vial (hasta)" , property: null },
            { name: "personaContacto", label: "Persona de contacto" , property: null },
            { name: "horaRetiro", label: "Hora retiro" , property: null },
            { name: "fechaRetiro", label: "Fecha retiro" , property: null },
            { name: "inspector", label: "Inspector quien recibe" , property: null },
        ]
    }

    hideMap() {
        if (this.mapService.getGrid() != null) {
            this.mapService.getGrid().clear();
        }
        this.mapService.disconectGrid();
        this.mapService.getVisor().limpiar();
        this.mapService.getVisor().visible = false;
        this.utilitiesServices.scrollToTop();
    }

}
