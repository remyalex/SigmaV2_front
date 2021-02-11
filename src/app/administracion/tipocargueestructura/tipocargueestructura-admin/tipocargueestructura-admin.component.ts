import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CONST_ADMINISTRACION_TIPOCARGUEESTRUCTURA } from './../tipocargueestructura.constant';
import { TipocargueestructuraService } from '../services/tipocargueestructura.service';
import { Tipocargueestructura } from '../models/tipocargueestructura.model';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { TipocargueestructuraCreateComponent } from '../tipocargueestructura-create/tipocargueestructura-create.component';
import { Tipocargue } from '../../tipocargue/models/tipocargue.model';

/** Componente encargado de gestionar los tipo cargue estructura */
@Component({
  selector: 'sigma-administracion-tipocargueestructura-admin',
  templateUrl: './tipocargueestructura-admin.component.html'
})
export class TipocargueestructuraAdminComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOCARGUEESTRUCTURA;

  /**
  * Método encargado de construir una instancia de la clase
  * @param router Componente usado para redireccionar entre componentes
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  */
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private servicio: TipocargueestructuraService,
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() { }

  /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la creación de un objeto del componente.
   * @param tipocargueestructura Objeto que encapsula los datos del registro seleccionado
   *
   */
  create(tipocargueestructura: Tipocargueestructura): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = tipocargueestructura;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(TipocargueestructuraCreateComponent, dialogConfig);
  }

}
