import { CONST_MENU } from './../constantes-menu';
import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Menu } from '../models/menu.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MenuadminService } from '../services/menuadmin.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Permiso } from '../../permisos/models/permiso.model';
import { PermisosService } from '../../permisos/services/permisos.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

/** Componente encargado de gestionar la visualización del menú*/
@Component({
  selector: 'sigma-administracion-menu-detail',
  templateUrl: './menu-detail.component.html'
})
export class MenuDetailComponent implements OnInit {

  /**  Constantes que utiliza el componente */
  constantes = CONST_MENU;
  /** Objeto usado para enviar al servicio de CRUD*/
  menu: Menu;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /** lista de permisos usado en el componente */
  listaPermiso: Permiso[];
  /** data usada en la grilla del componente */
  listaMenu: Menu[];
  /** array no usada */
  arbolData: Menu[];
  /** array no usada */
  dataMap = new Map([]);
  /** objeto que retiene el permiso seleccionado */
  selectedPermiso: Permiso;
  /** objeto que recibe dato para uso del componente */
  tipoEnlace: string = '';
  /** variable no usada */
  seleccionarTipoEnlace: any;
  /** variable no usada */
  seleccionarMenuPadre: any;
  /** variable no usada */
  seleccionarPermiso: any;
  /** variable que recibe el Id del objeto parent del menú */
  parentId: any;
  /** variable que recibe el Id del objeto permiso del menú */
  permisoId: any;

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param servicioPermiso Servicio Permiso usado en el componente para gestionar las peticiones
  * @param router Componente usado para redireccionar entre componentes
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param data Información a procesar
  */
  constructor(
    private servicio: MenuadminService,
    private servicioPermiso: PermisosService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<MenuDetailComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Menu
  ) {
    this.inicializarForm(data);
  }

  /** Método encargado de inicializar el formulario del componente */
  inicializarForm(data: Menu): void {
    this.menu = data;
    this.selectedPermiso = data.permiso;

    if (this.menu.routerLink != null) {
      this.tipoEnlace = 'Interno';
    } else {
      this.tipoEnlace = 'Externo';
    }

    this.servicioPermiso.list().subscribe(data => {
      this.listaPermiso = data;
    });

    this.servicio.list().subscribe(data => {
      this.listaMenu = data;
    });
    this.parentId = this.menu.parent ? this.menu.parent.id : 0;
    this.permisoId = this.menu.permiso ? this.menu.permiso.id : 0;

  }
  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close();
  }

}
