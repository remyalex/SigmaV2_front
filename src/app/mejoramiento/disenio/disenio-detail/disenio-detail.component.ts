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
import { DisenioDocumento } from '../models/disenio-documento.model';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { ResultadosSolicitudesApiquesComponent } from 'src/app/workflow/forms/diagnostico/shared/resultadosSolicitudesApiques/resultados-solicitudes-apiques.component';
import { ResultadosSolicitudesAforosComponent } from 'src/app/workflow/forms/diagnostico/shared/resultadosSolicitudesAforos/resultados-solicitudes-aforos.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-disenio-detail',
  templateUrl: './disenio-detail.component.html'
})
export class DisenioDetailComponent implements OnInit {

  @Input() disenio: Disenio;
  @Input() mantenimiento: WorkflowMantenimientoModel;
  @Input() componentExterno = false;
  @Input() botonCerrar = true;
 
  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();

  /** Constantes a usar en el componente */
  constants = CONST_MEJORAMIENTO_DISEINO;
  /** Variable usada para control de permisos que aplican */
  @Input() permiso = this.constants.mejoramiento_diseino_view;

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

  currentAction: any = 'list';

  options = [
    { value: true, name: 'SI' },
    { value: false, name: 'NO' }
  ];


  /**
  * Método encargado de construir una instancia
  */
  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private dialog: MatDialog, private utilitiesServices: UtilitiesService) {

    //  this.disenio = new Disenio();
    this.consultaRedes = [];
    this.modulacionLosas = new Archivo();
    this.leventamientoTopografico = new Archivo();
    this.fichaEstructural = new Archivo();
    this.informacionDiseino = new Archivo();
    this.otrosDocumentos = [];

    this.form = this.formBuilder.group({
      apiques: [{ value: null, disabled: true }],
      aforos: [{ value: null, disabled: true }],
      consultaRedes: [{ value: null, disabled: true }],
      modulacionLosas: [{ value: null, disabled: true }],
      levantamientoTopografico: [{ value: null, disabled: true }],
      evaluacionEstructural: [{ value: null, disabled: true }],
      informacionDisenio: [{ value: null, disabled: true }],
      otrosDocumentos: [{ value: null, disabled: true }],
      archivoId: [{ value: null, disabled: true }]
    });

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.extractArchivosBySolicitud();
  }

  loadData() {
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
  }

  actionChangeDisenioInformacion(disenio, mantenimiento) {
    this.currentAction = 'formDisenioInformacion';
    this.mantenimiento = mantenimiento;
    this.disenio = disenio;
    this.back.emit({ currentAction: this.currentAction });
  }

  callExterno(disenio, mantenimiento) {
    this.currentAction = 'disenioInformacionCallExterno';
    this.mantenimiento = mantenimiento;
    this.disenio = disenio;
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

  onbackExterno() {
    this.currentAction = 'list';
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
    if (event.id) {
      this.disenio[field] = new Documento();
      this.disenio[field].archivo = event;
      this.disenio[field].tipoDocumento = new ListaItem();
      this.disenio[field].tipoDocumento.id = 252;
    }
  }

  setArchivoSolicitud(event: any) {
    let eventObject;
    if (event && event.length > 0) {
      this.runFiles(event);
    } else if (event) {
      eventObject = '[' + JSON.stringify(event) + ']';
      eventObject = JSON.parse(eventObject);
      this.runFiles(eventObject);
    }

    if (event === '') {
      this.consultaRedes = [];
      this.disenio.consultaRedes = [];
    }
  }

  runFiles(event: any) {
    for (const archivo of event) {
      if (archivo.id) {
        let existe = false;
        for (const solicitudArchivo of this.disenio.consultaRedes) {
          if (archivo.id === solicitudArchivo.archivo.id) {
            existe = true;
          }
        }
        if (!existe && archivo.id) {
          const seccionArchivo = new DisenioDocumento();
          seccionArchivo.fecha = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());
          seccionArchivo.archivo = archivo;
          this.disenio.consultaRedes.push(seccionArchivo);
        }
      }
    }
  }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    // tslint:disable-next-line: forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  patternString(attr, data) {
    const re = /[a-zA-z]/gi;
    const newstr = data.target.value.replace(re, '');
    this.disenio[attr] = newstr.trim();
  }

}
