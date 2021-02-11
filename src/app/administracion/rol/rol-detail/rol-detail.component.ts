import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Rol } from '../models/rol.model';
import {
  MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort
} from '@angular/material';
import { CONST_ADMINISTRACION_ROL } from '../rol.constant';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de gestionar la visualización de un detalle */
@Component({
  selector: 'sigma-administracion-rol-detail',
  templateUrl: './rol-detail.component.html'
})
export class RolDetailComponent implements OnInit {

  /**
  * Método encargado de construir una instancia de la clase
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
  */
  constructor(
    private dialogRef: MatDialogRef<RolDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data: Rol,
    private excelService: ExcelService,
    private utilitiesServices: UtilitiesService,
  ) {
    this.rol = data;
  }

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_ROL;
  /** Objeto usado para enviar al servicio de CRUD*/
  rol: Rol;
  /** variable que recibe  permiso asignado del rol */
  permisos: any;
  /**  Nombres de columnas que presentará la grilla de mantenimiento usada en el componente */
  headers = [{
    nombre: 'Nombre',
    descripcion: 'Descripción',
    permiso: 'Permiso',
  }];

  /** Definición de las columnas presentadas en la grilla */
  columnsPermisos = [
    'nombre',
  ];

  /**  Nombres de columnas que presentará la grilla de mantenimiento usada en el componente */
  headersPermisos = [{
    nombre: 'Nombre',
  }];

  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;
  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [{}];

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.permisos = new MatTableDataSource(this.utilitiesServices.orderArray(this.rol.permisos, 'nombre'));
    this.permisos.sort = this.sort;
    this.permisos.paginator = this.paginator;
  }

  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo excel
   */
  exportAsXLSX(): void {
    const permisos = this.rol.permisos;
    this.dataExport = [...this.headers, ...permisos
      .map((item: any) => ({
        ...{ nombre: this.rol.nombre },
        ...{ descripcion: this.rol.descripcion }, ...{ permiso: item.nombre }
      }))];
    const order = ['nombre', 'descripcion', 'permiso', 'estadoNombre'];
    this.excelService.exportAsExcelFileCustom(this.dataExport, 'roles', true, order);
  }

}
