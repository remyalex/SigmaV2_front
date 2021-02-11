import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CONST_ADMINISTRACION_PROCESOACTIVIDAD } from '../actividades.constant';
import { ActividadCreateComponent } from '../actividad-create/actividad-create.component';

/** Componente encargado de gestionar las actividad */
@Component({
  selector: 'sigma-administracion-procesoactividad-admin',
  templateUrl: './actividad-admin.component.html'
})
export class ActividadAdminComponent implements OnInit {

  /** Objeto que recibe valor por entrada */
  @Input() proceso: any = {};
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PROCESOACTIVIDAD;


  /**
  * Método encargado de construir una instancia de la clase
  * @param router Componente usado para redireccionar entre componentes
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  */
  constructor(
    private router: Router,
    private dialog: MatDialog
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la creación de un objeto del componente.
   */
  create(): void {
    console.log('proceso', this.proceso);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.data = {
      proceso: this.proceso
    };
    const dialogRef = this.dialog.open(ActividadCreateComponent, dialogConfig);
  }

}
