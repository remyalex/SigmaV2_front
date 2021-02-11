import { Component, OnInit, Inject } from '@angular/core';
import { SOLICITUD_PMT_CONSTANTS } from '../solicitud-pmt.constants';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { WorkflowMantenimientoModel } from '../../../../models/workflow-mantenimiento.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SolicitudPMT } from '../models/solicitud-pmt.model';
import { ExcelService } from '../../../../../shared/services/excel.service';
import { Archivo } from 'src/app/workflow/models/archivo';
import { SigmaConfirmFormatToExportComponent } from '../../../../../shared/component/sigma-confirm-format-to-export/sigma-confirm-format-to-export.component';
import { PdfService } from '../../../../../shared/services/pdf.service';

@Component({
  selector: 'app-view-form-pmt',
  templateUrl: './view-form-pmt.component.html'
})
export class ViewFormPmtComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = SOLICITUD_PMT_CONSTANTS;
  solicitudPmtId: Number;
  solicitudPmt: SolicitudPMT;
  mantenimiento: WorkflowMantenimientoModel;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  formRadicado: FormGroup;
  archivosSolicitudPMT: any[];
  soloLecturaRadicado: boolean;
  dataSourceExcel: any = [];
  content: any = [];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    pk: 'PK',
    civ: 'CIV',
    zona: 'ZONA',
    localidad: 'LOCALIDAD',
    cuadrante: 'CUADRANTE',
    upla: 'UPZ',
    barrio: 'BARRIO',
    anchoCalzada: 'ANCHO CALZADA',
    areaCalzada: 'AREA CALZADA',
    longitudHo: 'LONGITUD HO',
    tipoMalla: 'TIPO MALLA',
    ejeVial: 'EJE VIAL',
    ejeVialDesde: 'EJE VIAL DESDE',
    ejeVialHasta: 'EJE VIAL HASTA',
    numeroCarriles: 'NUMERO CARRILES',
    tipoIntervencionPri: 'TIPO INTERVENCION PRIORIZACION',
    estadoPk: 'ESTADO PK',
    radicadoIntervencion: 'RADICADO INTERVENCION',
    estadoProgramacion: 'ESTADO PROGRAMACION',
    fechaRadicadoPMT: 'FECHA RADICADO PMT',
    numeroRadicadoPMT: 'NUMERO RADICADO PMT',
    tipoPMT: 'TIPO PMT',
    fechaInicio: 'FECHA INICIO',
    fechaFin: 'FECHA FIN',
    coi: 'COI',
    estadoPMT: 'ESTADO PMT'
  }];

  constructor(@Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<ViewFormPmtComponent>,
    private formBuilder: FormBuilder,
    private excelService: ExcelService,
    private dialog: MatDialog,
    private pdfService: PdfService,
    private snackBar: MatSnackBar) {
    this.solicitudPmtId = data.solicitudPmt;
    this.solicitudPmt = data.mantenimiento.solicitudesPmt[data.solicitudPmt];
    this.mantenimiento = data.mantenimiento;

    this.form = this.formBuilder.group({
      tipoPmt: [null, Validators.compose([Validators.required])],
      numeroRadicadoMovilidad: [null, Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15)])],
      tipoCierre: [null, Validators.compose([Validators.required])],
      fechaInicio: [null, Validators.compose([Validators.required])],
      fechaFin: [null, Validators.compose([Validators.required])],
      horaInicioCierre: [null, Validators.compose([Validators.required])],
      horaFinalCierre: [null, Validators.compose([Validators.required])],
      horaInicioTrabajo: [null, Validators.compose([Validators.required])],
      horaFinalTrabajo: [null, Validators.compose([Validators.required])],
      coi: [null],
      estadoPmt: [null, Validators.compose([Validators.required])],
      adjuntarPmt: [null],
      observaciones: [null, Validators.compose([Validators.required, Validators.maxLength(200)])],
    });

    this.formRadicado = this.formBuilder.group({
      numeroRadicadoPmt: [null, Validators.compose([Validators.required])],
      fechaRadicadoMovilidad: [null, Validators.compose([Validators.required])],
    });
  }

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.extractArchivosBySolicitud();
    this.deshabilitarFormulario();
  }

  loadDataExcel() {
    this.dataSourceExcel = [];
    this.buildData();
  }

  buildData() {
    this.content.pk = this.mantenimiento.pk;
    this.content.civ = this.mantenimiento.civ;
    this.content.zona = this.mantenimiento.zona ? this.mantenimiento.zona.nombre : '';
    this.content.localidad = this.mantenimiento.localidad ? this.mantenimiento.localidad.nombre : '';
    this.content.cuadrante = this.mantenimiento.cuadrante ? this.mantenimiento.cuadrante.nombre : '';
    this.content.upla = this.mantenimiento.upla ? this.mantenimiento.upla.nombre : '';
    this.content.barrio = this.mantenimiento.barrio ? this.mantenimiento.barrio.nombre : '';
    this.content.anchoCalzada = this.mantenimiento.ancho;
    this.content.areaCalzada = this.mantenimiento.area;
    this.content.longitudHo = this.mantenimiento.longitud;
    this.content.tipoMalla = this.mantenimiento.tipoMalla ? this.mantenimiento.tipoMalla.descripcion : '';
    this.content.ejeVial = this.mantenimiento.ejeVial;
    this.content.ejeVialDesde = this.mantenimiento.desde;
    this.content.ejeVialHasta = this.mantenimiento.hasta;
    this.content.numeroCarriles = this.mantenimiento.tipoVia ? this.mantenimiento.tipoVia.descripcion : '';
    this.content.tipoIntervencionPri = '';
    this.content.estadoPk = this.mantenimiento.estadoPk ? this.mantenimiento.estadoPk.descripcion : '';
    this.content.radicadoIntervencion = this.mantenimiento.radicadoIntervencion;
    this.content.estadoProgramacion = this.mantenimiento.estadoProgramacionPk ? this.mantenimiento.estadoProgramacionPk.descripcion : '';
    this.content.fechaRadicadoPMT = this.mantenimiento.fechaRadicadoPmt;
    // tslint:disable-next-line: max-line-length
    this.content.numeroRadicadoPMT = this.mantenimiento.solicitudesPmt ? this.mantenimiento.solicitudesPmt[this.solicitudPmtId.toString()].numeroRadicadoPmt : '';
    // tslint:disable-next-line: max-line-length
    this.content.tipoPMT = this.mantenimiento.solicitudesPmt ? this.mantenimiento.solicitudesPmt[this.solicitudPmtId.toString()].tipoPmt.descripcion : '';
    // tslint:disable-next-line: max-line-length
    this.content.fechaInicio = this.mantenimiento.solicitudesPmt ? this.mantenimiento.solicitudesPmt[this.solicitudPmtId.toString()].fechaInicio : '';
    // tslint:disable-next-line: max-line-length
    this.content.fechaFin = this.mantenimiento.solicitudesPmt ? this.mantenimiento.solicitudesPmt[this.solicitudPmtId.toString()].fechaFin : '';
    this.content.coi = this.mantenimiento.solicitudesPmt ? this.mantenimiento.solicitudesPmt[this.solicitudPmtId.toString()].coi : '';
    // tslint:disable-next-line: max-line-length
    this.content.estadoPMT = this.mantenimiento.solicitudesPmt ? this.mantenimiento.solicitudesPmt[this.solicitudPmtId.toString()].estadoPmt.descripcion : '';
    this.dataSourceExcel.push(this.content);
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close(1);
  }

  deshabilitarFormulario() {
    this.form.get('tipoPmt').disable();
    this.form.get('numeroRadicadoMovilidad').disable();
    this.form.get('tipoCierre').disable();
    this.form.get('fechaInicio').disable();
    this.form.get('fechaFin').disable();
    this.form.get('horaInicioCierre').disable();
    this.form.get('horaFinalCierre').disable();
    this.form.get('horaInicioTrabajo').disable();
    this.form.get('horaFinalTrabajo').disable();
    this.form.get('coi').disable();
    this.form.get('estadoPmt').disable();
    this.form.get('adjuntarPmt').disable();
    this.form.get('observaciones').disable();
    this.formRadicado.get('numeroRadicadoPmt').disable();
    this.formRadicado.get('fechaRadicadoMovilidad').disable();
    this.soloLecturaRadicado = true;
  }

  extractArchivosBySolicitud() {
    if (this.solicitudPmt.solicitudArchivos) {
      this.archivosSolicitudPMT = [];
      for (const solicitudArchivo of this.solicitudPmt.solicitudArchivos) {
        this.archivosSolicitudPMT.push(solicitudArchivo.archivo);
      }
    }
  }

  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX(): void {
    this.loadDataExcel();
    let exportData: any = [];
    exportData = [...this.headers, ...this.dataSourceExcel];
    this.excelService.exportAsExcelFileCustom(exportData, 'SolicitudPmt', true, '');
  }

  exportToFile(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = '';
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmFormatToExportComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(formato => {
      if (formato !== 0) {
        switch (formato) {
          case 'excel':
            this.exportAsXLSX();
            break;
          case 'pdf':
            this.loadDataExcel();
            this.pdfService.exportPdf('SolicitudPmt', this.headers, this.dataSourceExcel);
            break;
        }
      }
    });

  }

}
