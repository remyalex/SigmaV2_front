import { Component, OnInit, Input } from '@angular/core';
import { GrupoModel } from '../../models/grupo.model';
import { CONST_ADMINISTRACION_MANTENIMIENTO } from '../mantenimiento.constant';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MantenimientoAddComponent } from '../mantenimiento-add/mantenimiento-add.component';
import { GrupoService } from '../../services/grupo.service';

/** Componente encargado de gestionar la administración de los elementos mantenimiento*/
@Component({
  selector: 'sigma-administracion-mantenimiento-admin',
  templateUrl: './mantenimiento-admin.component.html'
})
export class MantenimientoAdminComponent implements OnInit {

   grupo: GrupoModel;
   @Input() idGrupo: number;
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_MANTENIMIENTO;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialog: MatDialog,
    private servicio: GrupoService,
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.grupo = new GrupoModel();
  }
}
