import { Component, OnInit } from '@angular/core';
import {CONST_ADMINISTRACION_BARRIO} from '../models/barrio.constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Barrio } from '../models/barrio.model';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { BarrioService } from '../services/barrio.service';
import { Router } from '@angular/router';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';

/** Componente encargado de gestionar la creación de un barrio*/
@Component({
  selector: 'app-barrio-create',
  templateUrl: './barrio-create.component.html'
})
export class BarrioCreateComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_BARRIO;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  barrio: Barrio;


   /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   * @param barrioService Componente usado para gestionar los servicios del barrio
   */
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private barrioService: BarrioService,
    private router: Router,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService
  ) {
    this.form = formBuilder.group({
      'id': [null, Validators.compose([Validators.required])],
      'nombre': [null, Validators.compose([Validators.required])],
      'valor': [null, Validators.compose([Validators.required])]
    });
    this.barrio = new Barrio();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

 /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la creación de un objeto del componente.
   */
  create() {
    this.barrioService.create(this.barrio).subscribe(barrio => {
      this.showMessage('¡Se creo el Barrio con exito!', 'success-snackbar');
      const urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin');
      this.router.navigate([urlBack]);
    },
    error => {
      this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
    });
  }


  /** Método encargado de devolver a la pagina principal el componente */
  onBack() {
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

  /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar el llamado al componente admin del componente.
   */
  OnGoUrlAdmin(): void {
    const posUltimaPosicion = location.pathname.lastIndexOf('/');
    const urlBack = location.pathname.substr(0, posUltimaPosicion + 1) + 'admin';
    this.router.navigate([urlBack]);
  }


  /**
   * Método encargado de gestionar la presentación del
   * mensaje de usuario en el componente
   *
   * @param message Mensaje a presentar por parte del usuario
   * @param clase Clase del mensaje q se presentará al usuario
   **/
  showMessage(message: string, clase: string ) {
  this.snackBar.open(message, 'X', {
    duration: 5000,
    panelClass: [clase]
  });
  }

}
