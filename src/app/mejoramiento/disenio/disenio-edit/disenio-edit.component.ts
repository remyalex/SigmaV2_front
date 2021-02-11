import { Component, OnInit, AfterViewInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CONST_MEJORAMIENTO_DISEINO } from '../disenio.constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { Documento } from '../models/documento.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { Disenio } from '../models/disenio.model';
import { Archivo } from 'src/app/workflow/models/archivo.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { DisenioDocumento } from '../models/disenio-documento.model';
// tslint:disable-next-line: max-line-length
import { ResultadosSolicitudesApiquesComponent } from 'src/app/workflow/forms/diagnostico/shared/resultadosSolicitudesApiques/resultados-solicitudes-apiques.component';
// tslint:disable-next-line: max-line-length
import { ResultadosSolicitudesAforosComponent } from 'src/app/workflow/forms/diagnostico/shared/resultadosSolicitudesAforos/resultados-solicitudes-aforos.component';
import { BaseDisenio } from '../models/base-disenio';
import { MapService } from 'src/app/shared/services/map.service';


@Component({
  selector: 'sigma-disenio-edit',
  templateUrl: './disenio-edit.component.html'
})
export class DisenioEditComponent extends BaseDisenio implements OnInit {

  @Input() disenio: Disenio;
  @Input() mantenimiento: WorkflowMantenimientoModel;
  @Output() saveFuncion = new EventEmitter();

  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();

  /** Constantes a usar en el componente */
  constants = CONST_MEJORAMIENTO_DISEINO;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  documento: Documento;
  requerido = true;

  apiques: number;
  aforos: number;
  consultaRedes = [];
  modulacionLosas: Archivo;
  leventamientoTopografico: Archivo;
  fichaEstructural: Archivo;
  informacionDiseino: Archivo;
  otrosDocumentos = [];

  currentAction: any;

  options = [
    { value: true, name: 'SI' },
    { value: false, name: 'NO' }
  ];


  /**
  * Método encargado de construir una instancia
  */
  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, snackBar: MatSnackBar, private dialog: MatDialog,
    utilitiesServices: UtilitiesService, private mapService: MapService) {
    super(snackBar, utilitiesServices);
    this.consultaRedes = [];
    this.modulacionLosas = new Archivo();
    this.leventamientoTopografico = new Archivo();
    this.fichaEstructural = new Archivo();
    this.informacionDiseino = new Archivo();
    this.otrosDocumentos = [];

    this.form = this.formBuilder.group({
      apiques: [{ value: null, disabled: true }, Validators.compose([Validators.required, Validators.maxLength(2)])],
      aforos: [null],
      consultaRedes: [null],
      modulacionLosas: [null],
      levantamientoTopografico: [null],
      evaluacionEstructural: [null],
      informacionDisenio: [null],
      otrosDocumentos: [null],
      archivoId: [null]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.extractArchivosBySolicitud();
    this.mapService.getVisor().localizar(this.mantenimiento);
    this.mapService.getVisor().activarSeleccion = false;
  }

  loadData() {
  }

  mostrarResultadosApiques() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '200';
    dialogConfig.data = {
      'mantenimiento': this.mantenimiento,
      'editable': false,
    };
    const dialogRef = this.dialog.open(ResultadosSolicitudesApiquesComponent, dialogConfig);
  }

  mostrarResultadosAforos() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '200';
    dialogConfig.data = {
      'mantenimiento': this.mantenimiento,
      'editable': false,
    };
    const dialogRef = this.dialog.open(ResultadosSolicitudesAforosComponent, dialogConfig);
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.mantenimiento.disenio = this.disenio;
    this.saveFuncion.emit({ mantenimiento: this.mantenimiento });
  }

  actionChangeDisenioInformacion(disenio, mantenimiento) {
    this.currentAction = 'formDisenioInformacion';
    this.mantenimiento = mantenimiento;
    this.disenio = disenio;
    this.back.emit({ currentAction: this.currentAction, disenio: this.disenio });
  }

  validateUploadFile(boolean) {
    this.requerido = boolean;
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    this.disableSubmit = true;
    if (this.form.valid === true) {
      this.disableSubmit = true;
      this.save();
    } else {
      this.disableSubmit = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  onBack() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          this.currentAction = 'list';
          this.back.emit({ currentAction: this.currentAction });
        }
      }
    );
  }

  extractArchivosBySolicitud() {
    if (this.disenio.consultaRedes) {
      this.consultaRedes = [];
      for (const itemArchivo of this.disenio.consultaRedes) {
        this.consultaRedes.push(itemArchivo.archivo);
      }
      this.otrosDocumentos = [];
      for (const itemArchivo of this.disenio.otrosDocumentos) {
        this.otrosDocumentos.push(itemArchivo.archivo);
      }
    }
  }

  secuenceField(field: string, event) {
    if (typeof(event) !== 'undefined' && event !== '' ) {
      this.disenio[field] = new Documento();
      this.disenio[field].archivo = event;
      this.disenio[field].tipoDocumento = new ListaItem();
      this.disenio[field].tipoDocumento.id = 252;
    } else {
      this.disenio[field] = null;
    }
  }

}
