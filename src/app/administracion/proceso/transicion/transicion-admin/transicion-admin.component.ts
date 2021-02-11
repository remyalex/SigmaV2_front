import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CONST_ADMINISTRACION_PROCESOTRANSICION } from '../transicion.constant';
import { TransicionCreateComponent } from '../transicion-create/transicion-create.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Proceso } from '../../models/proceso.model';

/** Componente encargado de gestionar las transiciones */
@Component({
  selector: 'sigma-administracion-procesotransicion-admin',
  templateUrl: './transicion-admin.component.html'
})
export class TransicionAdminComponent implements OnInit {

  /** Objeto que recibe valor por entrada */
  @Input() proceso: Proceso;

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PROCESOTRANSICION;

  /**
  * Método encargado de construir una instancia de la clase
  * @param router Componente usado para redireccionar entre componentes
  * @param dialog Componente gráfico usado para presentar cuadros de dialog
  */
  constructor(
    private router: Router,
    private dialog: MatDialog,
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /**
  * Método encargado de realizar el llamado del componente encagado de
  * gestionar la creación de un objeto del componente.
  */
  create(): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.data = {
      proceso: this.proceso
    };
    const dialogRef = this.dialog.open(TransicionCreateComponent, dialogConfig);
  }

}
