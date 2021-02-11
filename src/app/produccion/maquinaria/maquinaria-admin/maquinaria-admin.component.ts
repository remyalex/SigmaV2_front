import { Component, OnInit, ViewChild } from '@angular/core';
import { CONST_PRODUCCION_MAQUINARIA } from '../maquinaria.constant'
import { Router } from '@angular/router';
import { Maquinaria } from '../models/maquinaria.model';
import { MaquinariaAction } from '../models/maquinaria-action.model';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { MaquinariaDeleteComponent } from '../maquinaria-delete/maquinaria-delete.component';
import { ListMaquinariaComponent } from '../list-maquinaria/list-maquinaria.component';

@Component({
  selector: 'app-maquinaria-admin',
  templateUrl: './maquinaria-admin.component.html'
})
export class MaquinariaAdminComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_MAQUINARIA;
  acciones: MaquinariaAction[] = [
    {
      name: 'delete',
      icon: 'delete',
      tooltip: 'Eliminar'
    }
  ];

  @ViewChild(ListMaquinariaComponent)
  listMaquinaria: ListMaquinariaComponent;


  /**
  * Método encargado de construir una instancia
  */
  constructor(private router: Router,
    private dialog: MatDialog) { }

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

  runAction(result: any) {
    console.log("Executing", result);
    if (result.action.name === 'delete') {
      this.delete(result.maquinaria);
    }
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(maquinaria: Maquinaria): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = maquinaria;

    const dialogRef = this.dialog.open(MaquinariaDeleteComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.listMaquinaria.loadData();
        }
      }
    );
  }

}
