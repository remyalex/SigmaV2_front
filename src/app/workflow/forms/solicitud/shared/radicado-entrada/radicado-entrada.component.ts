import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';
import { MantenimientoDatasource } from 'src/app/workflow/datasources/mantenimiento-datasource';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CommonService } from 'src/app/shared/services/common.service';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { Lista } from 'src/app/administracion/listas/models/lista.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

/** Componente encargado de gestionar el proceso de radiado de entrada*/
@Component({
  selector: 'app-radicado-entrada',
  templateUrl: './radicado-entrada.component.html'
})
export class RadicadoEntradaComponent implements OnInit {

  /** Formulario contenedor del componente */
  formEntrada: FormGroup;
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
  /** Variable usada para procesar la información del radicado original de la entrada */
  radicadoEntradaOriginal: string;
  /** Variable usada para realizar la búsqueda del radicado */
  searchRadicado: string;
  /** Variable usada para el procesamiento de información del radiado de entrada */
  radicadoEntrada: string;
  /** Fecha en la que se realizará la radicación de la entrada */
  fechaRadicacion: string;
  /** Fecha de vencimiento de radicado */
  fechaVencimiento: string;
  /** Nombre del remitente que realiza la radicación */
  remitente: string;
  /** Asunto con el cual se realiza la radicación de entrada */
  asunto: string;
  /** Fecha de generación del documento de radicado */
  fechaGeneracionDocumento: string;
  /** Origen al que pertenece el radicado de entrada */
  origenradicadoEntrada: string;
  /** Dependencia al cual se asigna el radicado */
  dependenciaAsignada: string;
  /** Tipo de respuesta del radicado de salida */
  tipoRtaRadSalida: number;
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
  /** Rdicado de respuesta en el que se encuentra la reserva */
  radicadoRespuestaReserva: ListaItem;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param dialogRef Componente de dialog usado para presentar la información adicional
  * @param data Datos asociados a la funcionalidad a procesar
  */
  constructor(
    private dialogRef: MatDialogRef<RadicadoEntradaComponent>,
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

    this.formEntrada = formBuilder.group({
      'searchRadicado': [],
      'radicadoEntrada': [null, Validators.compose([Validators.required])],
      'fechaRadicacion': [],
      'fechaVencimiento': [],
      'remitente': [],
      'asunto': [],
      'fechaGeneracionDocumento': [],
      'dependenciaAsignada': [],
      'tipoRtaRadSalida': [Validators.compose([Validators.required])],
    });
    this.processing = false;
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {

    if (this.radicadoRequest) {
      this.radicadoRequest.unsubscribe();
    }

   this.radicadoEntrada = this.mantenimientoActividad.mantenimiento.radicadoRespuestaReserva;
   this.radicadoEntradaOriginal = this.mantenimientoActividad.mantenimiento.radicadoRespuestaReserva;

    this.radicadoRequest = this.commonService.getRadicadoOrfeo(this.radicadoEntrada).subscribe((item: any) => {
      this.fechaRadicacion = item.fechaRadicado;
      this.fechaVencimiento = item.fechaVencimiento;
      this.remitente = item.nombre + ' ' + item.primerApellido+ ' ' + item.segundoApellido;
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
        this.mantenimientoActividad.mantenimiento.tipoRadicadoRespuestaReserva = this.radicadoRespuestaReserva;
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
    this.mantenimientoActividad.mantenimiento.radicadoRespuestaReserva = this.radicadoEntrada;
    this.mantenimientoActividad.mantenimiento.tipoRadicadoRespuestaReserva =this.radicadoRespuestaReserva;

    this.workflowService.setRadicadoRespuestaReserva(this.mantenimiento).subscribe(
      data => {
        this.mantenimiento.radicadoRespuestaReserva = data.radicadoRespuestaReserva;
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
      this.mantenimiento.solicitudRadicadoEntrada = item.numeroRadicado;
      this.mantenimiento.solicitudFecha = item.fechaRadicado;
      this.mantenimiento.solicitudVencimiento = item.fechaVencimiento;
      this.mantenimiento.solicitudRemitente = item.nombre + ' ' + item.primerApellido + ' ' + item.segundoApellido;
      this.mantenimiento.solicitudAsunto = item.asunto;
      this.mantenimiento.solicitudDependenciaAsignada = '';
      this.radicadoEntrada = '';
    });
  }

  /** Método encargado de actualizar la información del tipo de respuesta
   * en el modelo
   *
   * @param lista Lista item de la opción seleccionada por el usuario para
   * actualizar el modelo
   */
  onChangeTipoRta(lista: ListaItem): void {
    if (typeof lista !== 'undefined' && typeof lista.id !== 'undefined') {
      this.mantenimiento.tipoRadicadoRespuestaReserva = lista;
      this.radicadoRespuestaReserva = lista;
    }
  }

  /** Método encargado de borrar el radicado buscado por el
   * usuario en una acción anterior */
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
        this.mantenimiento.solicitudRadicadoEntrada = null;
        this.processing = true;
        this.mantenimientoActividad.mantenimiento.radicadoRespuestaReserva = null;
          this.workflowService.setRadicadoRespuestaReserva(this.mantenimiento).subscribe(
          data => {
            this.mantenimiento.radicadoRespuestaReserva = data.radicadoRespuestaReserva;
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
