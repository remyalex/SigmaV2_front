import { PdfService } from './../../../../../shared/services/pdf.service';
import { GridMantenimientoDatasource } from './../../../../../shared/component/grid-mantenimientos/datasources/grid-mantenimientos.datasource';
import { GridMantenimientoCriteria } from './../../../../../shared/component/grid-mantenimientos/model/grid-mantenimiento.criteria.model';
import { CondicionService } from './../../../../../administracion/transicioncondiciones/services/transicioncondiciones.services';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { PersonaService } from 'src/app/administracion/persona/services/persona.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { CONST_ASIGNAR_MAQUINARIA_DISPONIBLE } from '../asignar-maquinaria-disponible.constants';
// tslint:disable-next-line: max-line-length
import { ProgCalendarioEquipoService } from 'src/app/produccion/asignar-maquinaria-disponible-a-solicitudes/services/progcalendarioequipo.service';
import { SigmaSendMailComponent } from 'src/app/shared/component/sigma-send-mail/sigma-send-mail.component';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { GridMantenimientosComponent } from 'src/app/shared/component/grid-mantenimientos/grid-mantenimientos.component';
import { ProgramacionDiariaTrabajo } from '../../../intervencion/registro-programacion-diaria-trabajo/programacion-diaria-trabajo.model';
import { ConfirmacionComponent } from 'src/app/produccion/asignar-maquinaria-disponible-a-solicitudes/confirmacion/confirmacion.component';

@Component({
  selector: 'app-asignar-maquinaria-disponible',
  templateUrl: './asignar-maquinaria-disponible.component.html'
})
export class AsignarMaquinariaDisponibleComponent extends BaseComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ASIGNAR_MAQUINARIA_DISPONIBLE;

  filtros = [
    'pk', 'civ'
  ];
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'posicion', 'pk', 'civ', 'direccion'
  ];

  // tslint:disable-next-line: max-line-length
  singleActions: GridAccion[] = [
    { nombre: this.constants.programarMaquinaria, label: 'Programar MQ/E', icono: 'schedule', color: 'primary' },
    { nombre: this.constants.cancelarProgramacion, label: 'Cancelar Programación', icono: 'cancel_schedule_send', color: 'warn' }
  ];

  masiveActions: GridAccion[] = [
    { nombre: this.constants.generarInforme, label: 'Generar Informe', icono: 'library_books', color: 'primary' },
    { nombre: this.constants.enviarInforme, label: 'Enviar Informe', icono: 'contact_mail', color: 'warn' }
  ];

  programacionDiaria: ProgramacionDiariaTrabajo;
  mantenimientos: WorkflowMantenimientoModel[];
  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  grid: GridMantenimientosComponent;

  dataSourceExportGrid: GridMantenimientoDatasource;
  criteriaExportGrid: GridMantenimientoCriteria;
  


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
    private personaService: PersonaService,
    private progCalendarioEquipoService: ProgCalendarioEquipoService,
    private dialog: MatDialog,
    private condicionService: CondicionService,
    private pdfService: PdfService
  ) {
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);
    this.criteriaExportGrid = new GridMantenimientoCriteria();
    this.dataSourceExportGrid = new GridMantenimientoDatasource(this.condicionService);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.mapService.getVisor().visible = true;
    this.commonService.getCondicionByNombre('CONSULTAR_Y_ASIGNAR_MAQUINARIA_DISPONIBLE').subscribe(_condicion => {
      this.condicion = _condicion;
    });
  }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar(event: any) {
    this.mantenimiento = event.mantenimiento;
    switch (event.accion) {
      case this.constants.programarMaquinaria:
        this.programarMaquinaria();
        break;
      case this.constants.cancelarProgramacion:
        this.grid = event.grid;
        this.cancelarProgramacionMaquinaria();
        break;
    }
  }

  ejecutarMasive(event: any) {
    this.mantenimientos = event.mantenimientos;
    switch (event.accion) {
      case this.constants.generarInforme:
        this.informe();
        break;
      case this.constants.enviarInforme:
        this.informe(true);
        break;
    }
  }

  programarMaquinaria() {
    if (this.validarData()) {
      const diaAnterior = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(
        this.utilitiesServices.removeDays(this.utilitiesServices.convertStringToDate(
          this.programacionDiaria.fechaProgramacion, 'DD-MM-YYYY'), 1
        )
      );

      const hoy = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());
      if (diaAnterior === hoy) {
        this.mapService.getVisor().visible = false;
        this.currentAction = this.constants.programarMaquinaria;
      } else {
        this.showMessageAlert('Acción solo permitida el día anterior a la fecha de programación', 'error-snackbar');
      }
    }
  }


  cancelarProgramacionMaquinaria() {
    if (this.validarData()) {

      let programado = false;
      const programacionesId = [];

      for (const programacionMaq of this.programacionDiaria.maquinaria) {
        if (programacionMaq.equipoCalendarios.length > 0) {
          programacionesId.push(programacionMaq.id);
          programado = true;
        }
      }

      if (programado) {

        const diaAnterior = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(
          this.utilitiesServices.removeDays(this.utilitiesServices.convertStringToDate(
            this.programacionDiaria.fechaProgramacion, 'DD-MM-YYYY'), 1
          )
        );

        const hoy = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());
        if (diaAnterior === hoy) {

          const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = 'custom-modalbox';
          dialogConfig.width = '30%';
          dialogConfig.disableClose = true;
          dialogConfig.autoFocus = true;
          const dialogRef = this.dialog.open(ConfirmacionComponent, dialogConfig);

          // tslint:disable-next-line: deprecation
          dialogRef.beforeClosed().subscribe(response => {
            const observacion = response.observacion;
            this.progCalendarioEquipoService.cancelarProgramacionEquipos(programacionesId, 'observacion: ' + observacion).subscribe(res => {
              this.showMessageAlert('Cancelación se ejecutó exitosamente', 'success-snackbar');
              setTimeout(() => {
                this.seleccionarGrid(0);
                this.mapService.getVisor().zoomQuerylocalizar(this.mapService.getVisor().definitionExpressionOriginal);
              }, 500);
            }, error => {
              this.utilitiesServices.formErrorMessages(error, null, this.snackBar);
            });
          });
        } else {
          this.showMessageAlert('Acción solo permitida el día anterior a la fecha de programación', 'error-snackbar');
        }
      } else {
        this.showMessageAlert('Mantenimiento sin progrmación de equipos', 'error-snackbar');
      }
    }
  }


  validarData(): boolean {
    // tslint:disable-next-line: max-line-length
    if (this.mantenimiento.intervenciones && this.mantenimiento.intervenciones.length > 0) {
      // tslint:disable-next-line: max-line-length
      if (this.mantenimiento.intervenciones[0].programacionesDiarias && this.mantenimiento.intervenciones[0].programacionesDiarias.length > 0) {
        this.programacionDiaria = this.mantenimiento.intervenciones[0].programacionesDiarias[0];
        // tslint:disable-next-line: max-line-length
        if (this.programacionDiaria.maquinaria && this.programacionDiaria.maquinaria.length > 0) {
          return true;
        } else {
          this.showMessageAlert('Mantenimiento no tiene Solicitudes de asignación Maquinaria', 'error-snackbar');
          return false;
        }
      } else {
        this.showMessageAlert('Mantenimiento no tiene Programaciones Diarias', 'error-snackbar');
        return false;
      }
    } else {
      this.showMessageAlert('Mantenimiento no tiene Intervencion', 'error-snackbar');
      return false;
    }
  }


  enviar(doc: any) {
    const mantenimientosId: number[] = [];
    for (const mantenimiento of this.mantenimientos) {
      mantenimientosId.push(mantenimiento.id);
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '45%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      titulo: 'Enviar Informe de Programación',
      asunto: 'Informe de programación de MQ/E',
      // tslint:disable-next-line: max-line-length
      mensaje: 'Buen día \n \n Se hace envió de la programación, adjunto a este correo se encuentra el informe generado \n \n Cordialmente ',
      mantenimientosId: mantenimientosId,
      attacheds: doc
    };
    const dialogRef = this.dialog.open(SigmaSendMailComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
        }
      }
    );
  }

  informe(enviarInforme = false) {
    let alreadyExport = false;
    let exportData: any = [];
    const total = 1;
    this.criteriaExportGrid.actividadActualId = '82';
    this.criteriaExportGrid.size = this.mantenimientos.length;
    this.criteriaExportGrid.page = 0;
    this.criteriaExportGrid.isExport = true;
    this.dataSourceExportGrid.loadData(this.criteriaExportGrid);
    this.dataSourceExportGrid.loading$.subscribe(response => {
      if (!response && !alreadyExport) {
        alreadyExport = true;
        let content = [];
        content = this.dataSourceExportGrid.getMantenimientos().map((mantenimiento: any) =>
          this.elementToRow(mantenimiento));
        const headerAndOrder = { No: 'No.', pk: 'PK', civ: 'CIV', direccion: 'Direccion' };
        exportData = [...[headerAndOrder], ...content];
        // const header = this.converArrayObjectToArray(headerAndOrder, headerAndOrder);
        // const body = this.converArrayDataObjectToArray(content, headerAndOrder);
        if (enviarInforme) {
          const doc = this.pdfService.generatePdfArchive('Mantenimiento', [headerAndOrder], content, false);
          this.enviar(doc);
        } else {
          this.pdfService.exportPdf('Mantenimiento', [headerAndOrder], content, false);
        }
      }
    });
  }

  elementToRow(mantenimiento: any) {
    const datos = {
      posicion: mantenimiento.posicion ? mantenimiento.posicion : '',
      pk: mantenimiento.pk ? mantenimiento.pk : '',
      civ: mantenimiento.civ ? mantenimiento.civ : '',
      direccion: mantenimiento.ejeVial && mantenimiento.desde ? mantenimiento.ejeVial + ' N° ' + mantenimiento.desde : '',
    };
    return datos;

  }

  converArrayObjectToArray(obeject: any, order: Array<any>) {
    const array = [];
    const arrayInterno = [];
    for (let i = 0; i < order.length; i++) {
      // tslint:disable-next-line: forin
      for (const label in obeject[0]) {
        if (order[i] === label) {
          arrayInterno.push(obeject[0][label]);
        }
      }
    }
    array.push(arrayInterno);
    return array;
  }

  converArrayDataObjectToArray(obeject: any, order: Array<any>) {
    const array = [];
    for (let x = 0; x < obeject.length; x++) {
      const arrayInterno = [];
      for (let i = 0; i < order.length; i++) {
        for (const label in obeject[x]) {
          if (order[i] === label) {
            arrayInterno.push(obeject[x][label]);
          }
        }
      }
      array.push(arrayInterno);
    }
    return array;
  }

  showMessageAlert(message: string, clase: string) {
    this.snackBar.open(message, 'X', {
      duration: 10000,
      panelClass: [clase]
    });
  }

  cancelar() {
    this.currentAction = 'list';
    this.mapService.getVisor().visible = true;
    setTimeout(() => {
      this.seleccionarGrid(0);
      this.mapService.getVisor().zoomQuerylocalizar(this.mapService.getVisor().definitionExpressionOriginal);
    }, 500);
  }


}
