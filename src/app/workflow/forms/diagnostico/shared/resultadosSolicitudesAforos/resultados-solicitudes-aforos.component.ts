import { WorkflowMantenimientoModel } from './../../../../models/workflow-mantenimiento.model';
import { ArchivosMantenimientoComponent } from './../archivos-mantenimiento/archivos-mantenimiento.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CONST_WORKFLOW_DIAGNOSTICO } from '../diagnostico.constants';
import { ArchivoMantenimientoModel } from 'src/app/workflow/models/archivoMantenimiento';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { CountMaxElementsValidator, CountMinElementsValidator } from 'src/app/shared/form/count.elements';
import { ResultadoApiqueService } from 'src/app/mejoramiento/predisenio/services/resultadoApique.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';
import { UsuarioInfo } from 'src/app/workflow/models/usuario-info.model';
import { Profile } from 'src/app/seguridad/models/profile';
import { ProfileService } from 'src/app/seguridad/services/profile.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';

/** Componente encargado de gestionar los resultados de las solicitudes
 *  enviados a estudio de aforos */
@Component({
  selector: 'app-resultados-solicitudes-aforos',
  templateUrl: './resultados-solicitudes-aforos.component.html'
})
export class ResultadosSolicitudesAforosComponent implements OnInit {

  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Número máximo de archivos que se permiten cargar */
  maxArchivos = 50;
  /** Número mínimo de archivos que se deben cargar */
  minArchivos = 1;
  /** Fuente de datos de archivos cargados de resultados al mantenimiento */
  archivosDatasource = new MatTableDataSource<ArchivoMantenimientoModel>();
  /** Columnas presentadas en la grilla del listado de archivos */
  columnasTablaArchivos = ['archivos', 'observacion'];
  /**
   * Variable bandera con la cual se identifica si el componente
   * se encuentra realizando algun procesamiento de información
   */
  processing = false;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;

 /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_DIAGNOSTICO;
  /**
  * Mantenimiento para el cual se realizará el procesamiento
  * de la información */
  mantenimiento: WorkflowMantenimientoModel;
  /** Clón del objeto que se va a modificar información */
  clone: WorkflowMantenimientoModel;
  /**
   * Variable usada para recibir en la invocación del componente
   * la actividad del mantenimiento
   **/
  data: WorkflowMantenimientoActividadModel;
  /**  Componente de utilidades de peticiones a servicios*/
  utilitiesServices: UtilitiesService;

  /**variable usada para permitir la edicion del formulario*/
  editable = true;
  /* Variable para obtener el usuario logueado */
  usuarioLogueado: UsuarioInfo;


 /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param workflowService Componente usado para invocar los servicios de workflow
   * @param formBuilder Componente usado para gestionar los elementos del formulario
   */
  constructor(
    private dialogRef: MatDialogRef<ResultadosSolicitudesAforosComponent>,
    @Inject(MAT_DIALOG_DATA) data: {
      'mantenimiento': WorkflowMantenimientoModel,
      'editable': boolean
    },
    formBuilder: FormBuilder,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private servicio: ResultadoApiqueService,
    private snackBar: MatSnackBar,
    private workflowService: WorkflowService,
    private tokenStorage: TokenStorageService,
  ) {
    const formato = 'DD-MM-YYYY';
    this.data = new WorkflowMantenimientoActividadModel();
    this.mantenimiento = data.mantenimiento;
    if (data.editable !== undefined && data.editable !== null) {
      this.editable = data.editable;
    }
    if (this.editable) {
      this.columnasTablaArchivos.push('acciones');
    }
    this.form = formBuilder.group({
      archivos: [
        null,
        Validators.compose([
          Validators.required,
          CountMaxElementsValidator(this.maxArchivos),
          CountMinElementsValidator(this.minArchivos)
        ])
      ]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.mantenimiento));
    this.archivosDatasource = new MatTableDataSource<ArchivoMantenimientoModel>(this.mantenimiento.resultadosSolicitudesAforos);
    this.usuarioLogueado = this.tokenStorage.getStorage(this.tokenStorage.PERFIL);
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.dialogRef.close();
      }
    });
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.processing = true;
    this.clone = JSON.parse(JSON.stringify(this.mantenimiento));
    this.data.mantenimiento = this.mantenimiento;
    this.data.actividad = this.mantenimiento.actividadActual;
    this.data.ejecutadoPor = this.usuarioLogueado;
    this.data.transicion = this.mantenimiento.actividadActual.transiciones[0];
    this.workflowService.update(this.data).subscribe(
      data => {
        this.data = data;
        this.mantenimiento = JSON.parse(JSON.stringify(data.mantenimiento));
        this.processing = false;
        this.dialogRef.close(0);
        this.snackBar.open(this.constants.successEdit, 'X', {
          duration: 6000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.processing = false;
        this.utilitiesServices.formErrorMessages(
          error,
          this.form,
          this.snackBar
        );
      }
    );
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    this.disableSubmit = true;
    if (this.form.valid == true) {
      this.disableSubmit = true;
      this.save();
    } else {
      this.disableSubmit = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 10000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  /** Método encargado de adicionar un archivo al listado de archivos de resultados */
  addArchivo(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      'actividadCargaArchivos': 'registrar-resultado-aforo',
      'mantenimiento': this.mantenimiento,
      'datasource': this.archivosDatasource,
      'archivoMantenimiento': new ArchivoMantenimientoModel()
    };
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(ArchivosMantenimientoComponent, dialogConfig);
  }

  /** Método encargado de remover el archivo con index proporcionado
   * del listado de archivos de resultados
   *
   * @param index Indice del registro a eliminar del listado de archivos de resultados
   **/
  removeArchivo(index: number) {
    this.mantenimiento.resultadosSolicitudesAforos.splice(index, 1);
    this.archivosDatasource.data = this.mantenimiento.resultadosSolicitudesAforos;
    this.form.get('archivos')
      .setValue(this.mantenimiento.resultadosSolicitudesAforos);
  }

    /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    // tslint:disable-next-line:forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

}
