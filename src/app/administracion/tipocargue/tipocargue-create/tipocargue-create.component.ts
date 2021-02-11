import { Component, OnInit } from '@angular/core';
import { Tipocargue } from '../models/tipocargue.model';
import { TipocargueService } from '../services/tipocargue.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_TIPOCARGUE } from './../tipocargue.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la creación de tipo cargue */
@Component({
  selector: 'sigma-administracion-tipocargue-create',
  templateUrl: './tipocargue-create.component.html'
})
export class TipocargueCreateComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOCARGUE;
  /** Objeto usado para enviar al servicio de CRUD*/
  tipocargue: Tipocargue = new Tipocargue();
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledBtn_Login = false;
  /** Variable usada para procesar el mensaje que se presentará al usuario */
  mensaje = '';
  /**Contenedor de los elementos del formulario */
  public form: FormGroup;

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private servicio: TipocargueService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private dataGenericService:  DataGenericService
  ) {
    this.form = this.formBuilder.group({
      'activo': [null, Validators.compose([Validators.required])],
      'descripcion': [null, Validators.compose([Validators.required, Validators.maxLength(300)])],
      'nombre': [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      'programaSql': [null, Validators.compose([Validators.maxLength(30)])],
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.tipocargue = new Tipocargue();
    this.enviada = false;
  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new(): void {
    this.enviada = false;
    this.tipocargue = new Tipocargue();
  }

  /** Método encargado de devolver a la página principal el componente */
  onBack(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val == 1) {
          let urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin')
          this.router.navigate([urlBack]);
        }
      }
    );
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.create(this.tipocargue).subscribe(
      data => {
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.dataGenericService.removeCacheListContain(this.constants.path_administracion_tipocargue);
        const urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin');
        this.router.navigate([urlBack]);
      },
      error => {
        this.disabledBtn_Login = false;
        this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
  onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    this.disabledBtn_Login = true;
    if (this.form.valid) {
      this.disabledBtn_Login = true;
      this.save();
    } else {
      this.disabledBtn_Login = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    for (let inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

}
