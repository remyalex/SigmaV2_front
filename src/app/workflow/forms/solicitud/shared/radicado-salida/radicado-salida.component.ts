import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';
import { MantenimientoDatasource } from 'src/app/workflow/datasources/mantenimiento-datasource';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CommonService } from 'src/app/shared/services/common.service';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';

/** Componente usado para gestionar el radicado de salida */
@Component({
  selector: 'app-radicado-salida',
  templateUrl: './radicado-salida.component.html'
})
export class RadicadoSalidaComponent implements OnInit {

  /** Formulario contenedor del componente */
  form: FormGroup;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: MantenimientoDatasource;
  /**
  * Mantenimiento para el cual se realizará el procesamiento
  * de la información */
  mantenimiento: WorkflowMantenimientoModel;
  /**
  * Variable usada para procesar la actividad actual del mantenimiento
  */
  mantenimientoActividad: WorkflowMantenimientoActividadModel;
  /** Variable usada para procesar la información del radicado original de salida */
  radicadoSalidaOriginal: string;
  /** Variable usada para realizar la búsqueda del radicado */
  searchRadicado: string;
  /** Radicado de salida a procesar para el mantenimiento*/
  radicadoSalida: string;
  /** Fecha en la que se realizará la radicación */
  fechaRadicacion: string;
  /** Fecha de vencimiento de radicado */
  fechaVencimiento: string;
  /** Nombre del remitente que realiza la radicación */
  remitente: string;
  /** Asunto con el cual se realiza la radicación de radicado de salida */
  asunto: string;
  /** Fecha de generación del documento de radicado */
  fechaGeneracionDocumento: string;
  /** Origen al que pertenece el radicado de salida */
  origenRadicadoSalida: string;
  /** Dependencia al cual se asigna el radicado */
  dependenciaAsignada: string;
  /** Variable usada para gestionar el servicio de workflow */
  workflowService: WorkflowService;
  /** Componente usado para gestionar los servicios comunes de sigma */
  commonService: CommonService;
  /**
   * Variable bandera con la cual se identifica si el componente
   * se encuentra realizando algun procesamiento de información
   */
  processing: Boolean;
  /** Variable usada para el path del radicado a usar en el componente */
  radicadoRequest: any;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param dialogRef Componente de dialog usado para presentar la información adicional
  * @param data Datos asociados a la funcionalidad a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<RadicadoSalidaComponent>,
    @Inject(MAT_DIALOG_DATA) data: {
      'actividad': WorkflowMantenimientoActividadModel,
      'mantenimiento': WorkflowMantenimientoModel
    },
    formBuilder: FormBuilder,
    private dialog: MatDialog,
    commonService: CommonService,
    workflowService: WorkflowService,
  ) {
    this.commonService = commonService;
    this.mantenimiento = data.mantenimiento;
    this.mantenimientoActividad = data.actividad;
    this.mantenimientoActividad.mantenimiento = data.mantenimiento;
    this.workflowService = workflowService;

    this.form = formBuilder.group({
      'searchRadicado': [],
      'radicadoSalida': [null, Validators.compose([Validators.required])],
      'fechaRadicacion': [],
      'fechaVencimiento': [],
      'remitente': [],
      'asunto': [],
      'fechaGeneracionDocumento': [],
      'dependenciaAsignada': []
    });
    this.processing = false;
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {

    if (this.radicadoRequest) {
      this.radicadoRequest.unsubscribe();
    }
    this.radicadoSalida = this.mantenimientoActividad.mantenimiento.solicitudRadicadoSalida;
    this.radicadoSalidaOriginal = this.mantenimientoActividad.mantenimiento.solicitudRadicadoSalida;

    this.radicadoRequest = this.commonService.getRadicadoOrfeo(this.radicadoSalida).subscribe((item: any) => {
      this.fechaRadicacion = item.fechaRadicado;
      this.fechaVencimiento = item.fechaVencimiento;
      this.remitente = item.nombre + ' ' + item.primerApellido + ' ' + item.segundoApellido;
      this.asunto = item.asunto;
      this.dependenciaAsignada = '';
    });

  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    if (this.radicadoRequest) {
      this.radicadoRequest.unsubscribe();
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.mantenimientoActividad.mantenimiento.solicitudRadicadoSalida = this.radicadoSalidaOriginal;
        this.dialogRef.close();
      }
    });

  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    if (this.radicadoRequest) {
      this.radicadoRequest.unsubscribe();
    }
    this.processing = true;
    this.mantenimientoActividad.mantenimiento.solicitudRadicadoSalida = this.radicadoSalida;
    this.workflowService.setRadicadoSalida(this.mantenimiento).subscribe(
      data => {
        this.mantenimiento.solicitudRadicadoSalida = data.solicitudRadicadoSalida;
        this.processing = false;
        this.dialogRef.close();
      },
      error => {
        this.processing = false;
        this.dialogRef.close();
      });
  }

  /**
   * Método encargado de realizar la búsqueda del radicado
   */
  buscarRadicado() {
    if (this.radicadoRequest) {
      this.radicadoRequest.unsubscribe();
    }
    this.radicadoRequest = this.commonService.getRadicadoOrfeo(this.searchRadicado).subscribe((item: any) => {
      this.mantenimiento.solicitudRadicadoSalida = item.numeroRadicado;
      this.fechaRadicacion = item.fechaRadicado;
      this.fechaVencimiento = item.fechaVencimiento;
      this.remitente = item.nombre + ' ' + item.primerApellido + ' ' + item.segundoApellido;
      this.asunto = item.asunto;
      this.dependenciaAsignada = '';
      this.radicadoSalida = '';
    });
  }


  /**
   * Método encargado de borrar el radicado buscado por el
   * usuario en una acción anterior
   **/
  borrarRadicado() {
    if (this.radicadoRequest) {
      this.radicadoRequest.unsubscribe();
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.mantenimiento.solicitudRadicadoSalida = null;
        this.processing = true;
        this.mantenimientoActividad.mantenimiento.solicitudRadicadoSalida = null;
        this.workflowService.setRadicadoSalida(this.mantenimiento).subscribe(
          data => {
            this.mantenimiento.solicitudRadicadoSalida = data.solicitudRadicadoSalida;
            this.processing = false;
            this.dialogRef.close();
          },
          error => {
            this.processing = false;
            this.dialogRef.close();
          });
            this.dialogRef.close();
      }
    });
  }
}
