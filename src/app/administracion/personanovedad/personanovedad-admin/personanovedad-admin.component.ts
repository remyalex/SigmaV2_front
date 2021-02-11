import { Component, OnInit, ViewChild, Input  } from '@angular/core';
import { Router } from '@angular/router';
import { CONST_ADMINISTRACION_PERSONANOVEDAD } from './../personanovedad.constant';
import { PersonanovedadService } from '../services/personanovedad.service';
import { Personanovedad } from '../models/personanovedad.model';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { PersonanovedadCreateComponent } from '../personanovedad-create/personanovedad-create.component';

/** Componente encargado de gestionar las novedades de las personas */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-administracion-personanovedad-admin',
  templateUrl: './personanovedad-admin.component.html'
})
export class PersonanovedadAdminComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONANOVEDAD;

  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   */
   constructor(
    private router: Router,
    private servicio: PersonanovedadService,
    private dialog: MatDialog,
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /**
   Método encargado de realizar el llamado al componente de creación
  * de un registro de la grilla.
  */
  crear(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(PersonanovedadCreateComponent, dialogConfig);
  }

}
