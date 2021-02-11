import { Component, OnInit } from '@angular/core';
import { Lista } from '../models/lista.model';
import { ListasService } from '../services/listas.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ADMINISTRACION_LISTAS } from './../listas.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de gestionar la creación de una lista*/
@Component({
  selector: 'sigma-app-listas-create',
  templateUrl: './listas-create.component.html'
})
export class ListasCreateComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LISTAS;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  lista: Lista = new Lista();
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /** Variable usada para procesar el mensaje que se presentará al usuario */
  mensaje = '';
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledBtn_Login = false;

  /**Contenedor de los elementos del formulario */
  public form: FormGroup;


  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   */
  constructor(
    private servicio: ListasService,
    private router: Router,
    public formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService,
    ) {
    this.form = this.formBuilder.group({
      nombre: [null, Validators.compose([
        Validators.required,
        Validators.maxLength(100),
        ])],
      descripcion: [null, Validators.compose([
        Validators.required,
        Validators.maxLength(100),
      ])],
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.lista = new Lista();
    this.enviada = false;
    }

  /** Método encargado de instanciar el componente */
  new (): void {
    this.enviada = false;
    this.lista = new Lista();
  }

  /** Método encargado de realizar solicitud de almacenamiento al servicio*/
  save (){
    this.servicio.create(this.lista).subscribe(
      data => {
        this.disabledBtn_Login = false;
        this.snackBar.open(this.constants.successSave, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.router.navigateByUrl('/administracion/listas/admin');
      },
      error => {
        this.disabledBtn_Login = false;
        this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

  /** Método encargado de realizar validar datos de entrada solicitar
   * almacenamiento de información al método save
   */
  onSubmit () {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;    
    if (this.form.valid == true) {
      this.enviada = true;
      this.disabledBtn_Login = true;
      this.save();
    } else {
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
    // tslint:disable-next-line:forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  /** Método encargado de devolver a la página principal el componente */
  onBack(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width="30%";
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val == 1) {
          const urlBack = location.pathname.replace(
            location.pathname.split('/')[location.pathname.split('/').length - 1],
          'admin' );
          this.router.navigate([urlBack]);
        }
      }
    );
  }
}
