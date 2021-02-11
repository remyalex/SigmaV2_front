import { Component, OnInit, AfterViewInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CONST_MEJORAMIENTO_DISEINO } from '../disenio.constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { Documento } from '../models/documento.model';
import { Disenio } from '../models/disenio.model';
import { Archivo } from 'src/app/workflow/models/archivo.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { Predisenio } from '../../predisenio/models/predisenio.model';
import { DisenioDocumento } from '../models/disenio-documento.model';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { WorkflowService } from '../../../workflow/services/workflow-service.service';
// tslint:disable-next-line: max-line-length
import { ResultadosSolicitudesApiquesComponent } from 'src/app/workflow/forms/diagnostico/shared/resultadosSolicitudesApiques/resultados-solicitudes-apiques.component';
// tslint:disable-next-line: max-line-length
import { ResultadosSolicitudesAforosComponent } from 'src/app/workflow/forms/diagnostico/shared/resultadosSolicitudesAforos/resultados-solicitudes-aforos.component';
import { SigmaFormUploadFileComponent } from 'src/app/shared/component/sigma-form-upload-file/sigma-form-upload-file.component';
import { BaseDisenio } from '../models/base-disenio';
import { MapService } from 'src/app/shared/services/map.service';

@Component({
  selector: 'sigma-disenio-create',
  templateUrl: './disenio-create.component.html'
})
export class DisenioCreateComponent extends BaseDisenio implements OnInit {

  @Input() mantenimiento: any;
  @Input() disenioCurrent: Disenio;
  @Input() data: any;
  @Output() saveFuncion = new EventEmitter();

  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();

  /** Constantes a usar en el componente */
  constants = CONST_MEJORAMIENTO_DISEINO;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  documento: Documento;
  requerido = true;

  predisenio: Predisenio;
  apiques: number;
  aforos: number;
  consultaRedes = [];
  saveConsultaRedes = [];
  modulacionLosas: Archivo;
  leventamientoTopografico: Archivo;
  fichaEstructural: Archivo;
  informacionDiseino: Archivo;
  otrosDocumentos = [];
  saveOtrosDocumentos = [];
  currentAction: any;
  public petition = null;
  disableInformacionDisenio = true;

  options = [
    { value: 1, name: 'SI' },
    { value: 0, name: 'NO' }
  ];

  /**
  * Método encargado de construir una instancia
  */
  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, snackBar: MatSnackBar, private dialog: MatDialog, utilitiesServices: UtilitiesService,
    private workflowService: WorkflowService, private mapService: MapService, ) {
    super(snackBar, utilitiesServices);
    this.consultaRedes = [];
    this.modulacionLosas = new Archivo();
    this.leventamientoTopografico = new Archivo();
    this.fichaEstructural = new Archivo();
    this.informacionDiseino = new Archivo();
    this.otrosDocumentos = [];


    this.form = this.formBuilder.group({
      apiques: [{ value: null, disabled: true }, Validators.compose([Validators.maxLength(2)])],
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
    this.predisenio = this.mantenimiento.predisenio;
    this.disenio = new Disenio();
    this.disenio.consultaRedes = [];

    if (this.disenioCurrent) {
      this.disenio = this.disenioCurrent;
      this.modulacionLosas = this.disenioCurrent.modulacionLosas ? this.disenioCurrent.modulacionLosas.archivo : null;
      this.fichaEstructural = this.disenioCurrent.fichaEstructural ? this.disenioCurrent.fichaEstructural.archivo : null;
      this.informacionDiseino = this.disenioCurrent.informacionDiseino ? this.disenioCurrent.informacionDiseino.archivo : null;
      // tslint:disable-next-line: max-line-length
      this.leventamientoTopografico = this.disenioCurrent.leventamientoTopografico ? this.disenioCurrent.leventamientoTopografico.archivo : null;
      this.extractArchivosBySolicitud();
    }

    this.disenio.aforos = this.predisenio !== null ? Number(this.predisenio.requiereAforo) : 0;
    this.disenio.apiques = this.predisenio !== null ? this.predisenio.apiques.length : 0;

    this.mapService.getVisor().localizar(this.mantenimiento);
    this.mapService.getVisor().activarSeleccion = false;

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

    this.enviada = false;
    this.disableSubmit = true;
    this.saveConsultaRedes = this.disenio.consultaRedes;
    this.saveOtrosDocumentos = this.disenio.otrosDocumentos;
    this.disenio.consultaRedes = [];
    this.disenio.otrosDocumentos = [];
    this.disenio.fechaCreacionDisenio = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());
    this.mantenimiento.disenio = this.disenio;
    this.data.mantenimiento = this.mantenimiento;
    this.data.transicion = null;

    if (this.petition) {
      this.petition.unsubscribe();
    }

    this.petition = this.workflowService.update(this.data)
    .subscribe((mantenimientoActividad) => {
      this.mantenimiento = mantenimientoActividad.mantenimiento;
      this.mantenimiento.disenio.consultaRedes = this.saveConsultaRedes;
      this.mantenimiento.disenio.otrosDocumentos = this.saveOtrosDocumentos;
      this.disenio = this.mantenimiento.disenio;
      this.data.mantenimiento = mantenimientoActividad.mantenimiento;
      this.disableInformacionDisenio = false;
      this.petition = this.workflowService.update(this.data)
        .subscribe((mantenimientoActividad2) => {
          this.disableSubmit = false;
          this.enviada = true;
          this.mantenimiento = mantenimientoActividad2.mantenimiento;
          this.disenio = this.mantenimiento.disenio;
          this.data.mantenimiento = mantenimientoActividad2.mantenimiento;
          this.disableInformacionDisenio = false;
          this.saveFuncion.emit({ mantenimiento: this.mantenimiento });
        },
        error => {
          this.disableSubmit = false;
          this.enviada = false;
          this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
        });
    },
      error => {
        this.disableSubmit = false;
        this.enviada = false;
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
      });

  }

  validateUploadFile(boolean) {
    this.requerido = boolean;
  }

  actionChangeDisenioInformacion(disenio, mantenimiento) {
    this.currentAction = 'formDisenioInformacion';
    this.mantenimiento = mantenimiento;
    this.disenio = disenio;
    this.back.emit({ currentAction: this.currentAction, disenio: this.disenio });
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    this.disableSubmit = true;
    if (this.form.valid === true) {
      this.save();
    } else {
      this.disableSubmit = false;
      this.enviada = false;
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
    }
    if (this.disenio.otrosDocumentos) {
      this.otrosDocumentos = [];
      for (const itemArchivo of this.disenio.otrosDocumentos) {
        this.otrosDocumentos.push(itemArchivo.archivo);
      }
    }
  }

  secuenceField(field: string, event) {
    if (typeof (event) !== 'undefined' && event !== '') {
      if (event.id) {
        this.disenio[field] = new Documento();
        this.disenio[field].archivo = event;
        this.disenio[field].tipoDocumento = new ListaItem();
        this.disenio[field].tipoDocumento.id = 252;
      }
    }
  }

}
