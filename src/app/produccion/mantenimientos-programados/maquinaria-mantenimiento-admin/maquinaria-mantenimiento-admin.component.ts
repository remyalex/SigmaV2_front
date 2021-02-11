import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CONST_ADMINISTRACION_EQUIPO } from '../../../administracion/equipo/equipo.constant';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';
import { MaquinariaMantenimientoAddComponent } from '../maquinaria-mantenimiento-add/maquinaria-mantenimiento-add.component';
import { MaquinariaEquipoListComponent } from '../maquinaria-equipo-list/maquinaria-equipo-list.component';
import { MantenimientoProgramado } from '../models/mantenimientos-programados.model';
import { MaquinariaMantenimientoCancelComponent } from '../maquinaria-mantenimiento-cancel/maquinaria-mantenimiento-cancel.component';

@Component({
  selector: 'sigma-maquinaria-mantenimiento-admin',
  templateUrl: './maquinaria-mantenimiento-admin.component.html'
})
export class MaquinariaMantenimientoAdminComponent implements OnInit {

  @ViewChild(MaquinariaEquipoListComponent)
  listComponent: MaquinariaEquipoListComponent;

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPO;

  /**
  * Método encargado de construir una instancia de la clase
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
    const posUltimaPosicion = location.pathname.lastIndexOf('/');
    const urlBack = location.pathname.substr(0, posUltimaPosicion + 1) + 'create';
    this.router.navigate([urlBack]);
  }

  scheduleMaintance(equipo: Equipo) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = equipo;

    const dialogRef = this.dialog.open(MaquinariaMantenimientoAddComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      result => {
        if (result) {
          if (result !== 0) {
            this.listComponent.actionNeedsUpdate(result.equipo.id);
          }
        }
      }
    );
  }

  cancelMaintance(mantenimiento: MantenimientoProgramado) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = mantenimiento;
    dialogConfig.width = '50%';
    const dialogRef = this.dialog.open(MaquinariaMantenimientoCancelComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      result => {
        if (result) {
          if (result !== 0) {
            this.listComponent.actionNeedsUpdate(result.equipo.id);
          }
        }
      }
    );
  }
}



