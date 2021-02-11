import { SigmaConfirmComponent } from './../../../shared/sigma-confirm/sigma-confirm.component';
import { MapService } from 'src/app/shared/services/map.service';
import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { CONST_PRODUCCION_SOLICITUD_ENSAYOS } from '../solicitud-ensayos.constant';
import { SolicitudEnsayosService } from '../services/solicitud-ensayos.service';
import { Router } from '@angular/router';
import { SolicitudEnsayosDatasource } from '../services/solicitud-ensayos.datasource';
import { SolicitudEnsayosCriteria } from '../models/solicitud-ensayos-criteria.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-prod-solicitud-ensayos',
  templateUrl: './solicitud-ensayos.component.html'
})
export class SolicitudEnsayosComponent extends BaseComponent implements OnInit, AfterViewChecked, FormComponent {
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_SOLICITUD_ENSAYOS;

  disabledTabEnsayoLabPK = false;

  urlBack: string;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledBtn_Login = false;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'civ',
    'estadoPk',
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk',
    'fechaSolicitudEnsayo',
    'tipoEnsayo',
    'fechaRegistroEnsayo'
  ];

  defaultFilter: KeyValuePair[] = [
    { key: 'actividadActualId', value: '28' },
  ];
  /** Variable usada para enviar a la grilla el listado
   * de acciones a ejecutar para el mantenimiento en este componente */
  acciones: GridAccion[] = [
    { nombre: 'adicionar', label: 'Adicionar solicitud de ensayos', icono: 'note_add', color: 'primary' },
    { nombre: 'listar', label: 'Solicitudes de ensayos de laboratorio', icono: 'visibility', color: 'primary' },
  ];

  public columnsToExport = [
    'pk', 'civ', 'estadoPk'
  ];

  public form: FormGroup;
  dataSourceSol: SolicitudEnsayosDatasource;
  criteriaSol = new SolicitudEnsayosCriteria();
  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  defaulFilters: KeyValuePair[] = [];

  // Constructor del componente
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
    private router: Router,
    private dialog: MatDialog,
    private servicioSol: SolicitudEnsayosService,
  ) {
    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.defaulFilters.push({key: 'permisoId', value: '1'});
    this.data = new WorkflowMantenimientoActividadModel();
    this.commonService.getCondicionByNombre('PK_ENSAYO_LABORATORIO').subscribe(_condicion => {
      this.condicion = _condicion;
    });
   }

  cambiarEstadoTabEnsayoLabPK(event: any) {
    if (event && event === 'true') {
      this.disabledTabEnsayoLabPK = true;
    } else {
      this.disabledTabEnsayoLabPK = false;
    }
  }


   /** Método encargado de devolver a la página principal el componente */
  irEnsayosLabPKTab(btnAtras): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      let gridSeleccion: number;
      if (val === 1) {
        btnAtras.click();
        gridSeleccion = 0;
      } else {
        gridSeleccion = 1;
      }
      setTimeout(() => {
        this.seleccionarGrid(gridSeleccion);
        this.mapService.getVisor().visible = true;
      }, 500);
    });
  }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar( event) {
    switch (event.accion) {
      case 'listar':
        //if (event.mantenimiento.tieneSolicitudEnsayo) {
          CONST_PRODUCCION_SOLICITUD_ENSAYOS.pkListar = event.mantenimiento.pk;
          this.urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'list');
          this.router.navigate([this.urlBack]);
        /** } else {
          this.snackBar.open('El Pk no tiene Solicitudes de Ensayo', 'X', {
            duration: 5000,
            panelClass: ['warning-snackbar']
          });
        }*/
        break;
      case 'adicionar':
        CONST_PRODUCCION_SOLICITUD_ENSAYOS.mObject = event.mantenimiento;
        CONST_PRODUCCION_SOLICITUD_ENSAYOS.pkListar = event.mantenimiento.pk;
        this.urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'create');
        this.router.navigate([this.urlBack]);
        break;
    }
  }
}
