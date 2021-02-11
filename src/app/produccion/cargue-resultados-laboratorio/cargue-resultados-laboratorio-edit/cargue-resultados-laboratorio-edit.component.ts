import { Component, OnInit, Inject } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { SolicitudEnsayos } from '../../solicitud-ensayos/models/solicitud-ensayos.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Permiso } from 'src/app/administracion/permisos/models/permiso.model';
import { SolicitudEnsayosService } from '../../solicitud-ensayos/services/solicitud-ensayos.service';
import { PermisosService } from 'src/app/administracion/permisos/services/permisos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { SolicitudEnsayosComponent } from '../../solicitud-ensayos/solicitud-ensayos/solicitud-ensayos.component';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { CONST_PRODUCCION_SOLICITUD_ENSAYOS } from '../../solicitud-ensayos/solicitud-ensayos.constant';
import { Documento } from 'src/app/administracion/proceso/transicion/documentos/models/documento.model';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { MapService } from 'src/app/shared/services/map.service';
import { Usuario } from 'src/app/administracion/usuario/models/usuario.model';
import { Archivo } from 'src/app/workflow/models/archivo.model';
import { ArchivoModel } from 'src/app/administracion/formato/models/formato.model';
import { CountMaxElementsValidator, CountMinElementsValidator } from 'src/app/shared/form/count.elements';
import { ProcessService } from 'src/app/shared/services/process.service';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';

@Component({
  selector: 'sigma-prod-cargue-resultados-laboratorio-edit',
  templateUrl: './cargue-resultados-laboratorio-edit.component.html'
})


export class CargueResultadosLaboratorioEditComponent extends BaseComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_SOLICITUD_ENSAYOS;
  ensayo: SolicitudEnsayos;
  mantenimiento: WorkflowMantenimientoModel;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  listaPermiso: Permiso[];
  dataMap = new Map([]);
  selectedPermiso: Permiso;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledBtn_Login = false;
  parentId: any;
  permisoId: any;
  requerido = true;

  fechaRegistroEnsayo: string;
  usuarioNom: string;
  usuarioTramite: string;
  archivo: Archivo;

  maxArchivos = 1;
  minArchivos = 1;
  processing = true;

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
    public servicioEnsayo: SolicitudEnsayosService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _route: ActivatedRoute,
    private processService: ProcessService,
    private router: Router,
    //    @Inject(MAT_DIALOG_DATA) data: SolicitudEnsayos,
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);

    this.form = this.formBuilder.group({
      id: [null],
      fecha: [null, Validators.compose([Validators.required])],
      pk: [null],
      tipoEnsayo: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      fechaRegistroEnsayo: [null, Validators.compose([Validators.required])],
      archivo: [null, Validators.compose([Validators.required])],
      observaciones: [null, Validators.compose([Validators.maxLength(1000)])],
    });

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.ensayo = new SolicitudEnsayos();
    this.mantenimiento = new WorkflowMantenimientoModel();
    const pk = this._route.snapshot.paramMap.get('pk');
    const id = this._route.snapshot.paramMap.get('id');
    this.servicioEnsayo.detail(Number(id)).subscribe(
      (data: SolicitudEnsayos) => {
        this.ensayo = data;
        this.cargarDatosForm();
        this.mantenimiento = this.ensayo.mantenimiento;
        this.processing = false;
      },
      error => {
        this.ensayo.observaciones = 'error';
      }
    );
  }

  cargarDatosForm() {
    if (this.ensayo.fechaRegistroEnsayo == null) {
      this.fechaRegistroEnsayo = this.utilitiesServices.convertDateToString(new Date(), 'DD-MM-YYYY');
    } else {
      this.fechaRegistroEnsayo = this.ensayo.fechaRegistroEnsayo;
    }

    if (this.ensayo.usuarioTramite == null) {
      this.ensayo.usuarioTramite = this.tokenStorageService.getStorage('payload1');
    }
    this.usuarioNom = this.ensayo.usuario.nombres + ' ' + this.ensayo.usuario.apellidos;
    this.usuarioTramite = this.ensayo.usuarioTramite.nombres + ' ' + this.ensayo.usuarioTramite.apellidos;
    this.ensayo['fechaMaxima'] = this.utilitiesServices.convertDateToString(new Date());
  }

  setDataEnsayo(atributo: any, objeto: any) {
    this.archivo = objeto;
    this.ensayo.archivo = objeto;
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
    if (this.form.valid === true) {
      this.save();
      this.close();
    } else {
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 10000,
        panelClass: ['warning-snackbar']
      });
    }
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

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.ensayo.fechaRegistroEnsayo = this.fechaRegistroEnsayo;
    this.servicioEnsayo.update(this.ensayo).subscribe(
      data => {
        this.disabledBtn_Login = false;
        this.currentAction = 'listSol';
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        const urlBack = location.pathname.substr(0, location.pathname.lastIndexOf('/edit')) + '/list/' + this.mantenimiento.pk;
        this.router.navigate([urlBack]);
      },
      error => {
        this.disabledBtn_Login = false;
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
        this.currentAction = 'listSolEn';
      },
    );
  }


  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        const urlBack = location.pathname.substr(0, location.pathname.lastIndexOf('/edit')) + '/list/' + this.mantenimiento.pk;
        this.router.navigate([urlBack]);
      }
    });
  }

}
