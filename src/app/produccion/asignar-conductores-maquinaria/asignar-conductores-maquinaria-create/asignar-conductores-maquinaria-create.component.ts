import { Component, OnInit, Input, Output, IterableDiffer, IterableDiffers, SimpleChange } from '@angular/core';
import { AsignarConductoresMaquinaria } from '../models/asignar-conductores-maquinaria.model';
import { AsignarConductoresMaquinariaService } from '../services/asignar-conductores-maquinaria.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { AsignarConductoresMaquinariaDatasource } from '../services/asignar-conductores-maquinaria.datasource';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_ASIGNAR_CONDUCTORES_MAQUINARIA } from '../asignar-conductores-maquinaria.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';

@Component({
  selector: 'sigma-prod-asignar-conductores-maquinaria-create',
  templateUrl: './asignar-conductores-maquinaria-create.component.html',
  styleUrls: ['./asignar-conductores-maquinaria-create.component.scss']
})
export class AsignarConductoresMaquinariaCreateComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ASIGNAR_CONDUCTORES_MAQUINARIA;
  ensayo: AsignarConductoresMaquinaria = new AsignarConductoresMaquinaria();
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: AsignarConductoresMaquinariaDatasource;

  /**Contenedor de los elementos del formulario */
  public form: FormGroup;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledBtn_Login = false;
  ensayoUsuario: string;
  tokenStorageService: TokenStorageService;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: AsignarConductoresMaquinariaService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private differs: IterableDiffers,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    tokenStorageService: TokenStorageService,
  ) {
    this.tokenStorageService = tokenStorageService;
    
    this.form = this.formBuilder.group({
      pk: [null],
      fecha: [null],
      tipoEnsayo: [null, Validators.compose([Validators.required])],
      solicitante: [null]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    var f = new Date();
    this.dataSource = new AsignarConductoresMaquinariaDatasource(this.servicio);
    this.ensayo = new AsignarConductoresMaquinaria();    
    this.ensayoUsuario = this.tokenStorageService.getNombres() + ' ' + this.tokenStorageService.getApellidos();
    this.enviada = false;
  }

  /** Método encargado de inicializar el componente al ser creada nueva instancia */
  new(): void {
    this.enviada = false;
    this.ensayo = new AsignarConductoresMaquinaria();
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.create(this.ensayo).subscribe(
      data => {
        this.disabledBtn_Login = false;
        this.snackBar.open('¡El registro fue creado con exito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.OnGoUrlAdmin();
      },
      error => {
        this.disabledBtn_Login = false;
        this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

  /** Método encargado de devolver a la página principal el componente */
  onBack(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.OnGoUrlAdmin();
      }
    });
  }

  OnGoUrlAdmin(): void {
    const posUltimaPosicion = location.pathname.lastIndexOf('/');
    const urlBack = location.pathname.substr(0, posUltimaPosicion + 1) + 'view';
    this.router.navigate([urlBack]);
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    if (this.form.valid === true) {
      this.disabledBtn_Login = true;
      this.enviada = true;
      this.save();
    } else {
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  public enviarMensaje(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }
}