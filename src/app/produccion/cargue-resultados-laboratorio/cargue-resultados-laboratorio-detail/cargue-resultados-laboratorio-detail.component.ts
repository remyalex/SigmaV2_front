import { Component, OnInit, Inject } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { SolicitudEnsayos } from '../../solicitud-ensayos/models/solicitud-ensayos.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Permiso } from 'src/app/administracion/permisos/models/permiso.model';
import { SolicitudEnsayosService } from '../../solicitud-ensayos/services/solicitud-ensayos.service';
import { PermisosService } from 'src/app/administracion/permisos/services/permisos.service';
import { Router } from '@angular/router';
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
import { Archivo } from 'src/app/workflow/models/archivo';
import { ArchivoModel } from 'src/app/administracion/formato/models/formato.model';

@Component({
  selector: 'sigma-prod-cargue-resultados-laboratorio-detail',
  templateUrl: './cargue-resultados-laboratorio-detail.component.html'
})
export class CargueResultadosLaboratorioDetailComponent extends BaseComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_SOLICITUD_ENSAYOS;
  ensayo: SolicitudEnsayos;
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

  usuarioTramite: string;
  archivo: Archivo;

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
    private dialogRef: MatDialogRef<SolicitudEnsayosComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: SolicitudEnsayos,
  ) {
    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);


    this.ensayo = data;
    if(this.ensayo.generico){
      this.form = this.formBuilder.group({
        id: [{ value: this.ensayo.id }],
        fecha: [{ value: this.ensayo.fecha }, Validators.compose([Validators.required])],
        usuario: [{ value: this.ensayo.usuario }, Validators.compose([Validators.required, Validators.maxLength(255)])],
        tipoEnsayo: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
        fechaRegistroEnsayo: [null, Validators.compose([Validators.required])],
        usuarioTramite: [null, Validators.compose([Validators.required])],
        archivo: [null],
        observaciones: [null, Validators.compose([Validators.maxLength(255)])],
        mantenimiento: [this.ensayo.mantenimiento]
      });
  
    }else{
      this.form = this.formBuilder.group({
        id: [{ value: this.ensayo.id }],
        fecha: [{ value: this.ensayo.fecha }, Validators.compose([Validators.required])],
        usuario: [{ value: this.ensayo.usuario }, Validators.compose([Validators.required, Validators.maxLength(255)])],
        pk: [{ value: this.ensayo.mantenimiento.pk }, Validators.compose([Validators.required])],
        tipoEnsayo: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
        fechaRegistroEnsayo: [null, Validators.compose([Validators.required])],
        usuarioTramite: [null, Validators.compose([Validators.required])],
        archivo: [null],
        observaciones: [null, Validators.compose([Validators.maxLength(255)])],
        mantenimiento: [this.ensayo.mantenimiento]
      });
        
    }

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.cargarDatosForm();
  }

  cargarDatosForm() {
    this.usuarioTramite = this.ensayo.usuarioTramite.nombres + ' ' + this.ensayo.usuarioTramite.apellidos;
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
        this.dialogRef.close();
      }
    });
  }

}
