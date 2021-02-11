import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatTableDataSource, Sort } from '@angular/material';
import { GestionarprocesosService } from 'src/app/administracion/gestionarprocesos/services/gestionarprocesos.service';
import { Router } from '@angular/router';
import { DataGenericService } from '../../services/data-generic.service';

/** Componente encargado de la gestión de registros de actividades de mantenimiento */
@Component({
  selector: 'sigma-mantenimiento-records',
  templateUrl: './sigma-mantenimiento-records.component.html'
})
export class SigmaMantenimientoRecordsComponent implements OnInit {

  /** Listado de registro de actividades */
  dataSource: MatTableDataSource<any> = new MatTableDataSource(null);
  //listaRegistroActividades: any;
  /** Bandera para indicar si el componente se encuentra en procesamiento por el servicio  */
  loader: Boolean = true;
  /** Variable que se encarga de Mostrar o no la informacion en el componente  */
  noInfoToShow: Boolean;
  /** Bandera para identificar si se puede exportar los datos */
  exportOption: Boolean = false;
  /** Variable usada para notificación a otros componentes de cambios */
  errorMessage: String;
  /** Cantidad de datos en la lista indicada */
  lengthList: number;
  /** Path del mantenimiento de los registros a presentar */
  path_mantenimiento_records = '/api/workflow/mantenimiento-registro';
  /** Constantes a usar en el componente */
  constants = {
    noResultados: 'No se encuentran resultados.',
    id: 'Gestión ID',
    actividad: 'Actividad',
    usuario: 'Usuario',
    estado: 'Estado',
    fechaAsignacion: 'Fecha asignación',
    fechaInicio: 'Fecha inicio',
    fechaFin: 'Fecha fin',
    observaciones: 'Observaciones',
    fechaVencimiento: 'Fecha de vencimiento',
  };

  /** Id del mantenimiento seleccionado */
  @Input() mantId: Number;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'id',
    'actividad',
    'usuario',
    //'estado',
    'fechaAsignacion',
    'fechaInicio',
    'fechaFin',
    'fechaVencimiento',
    'observaciones',
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    id: this.constants.id,
    actividad: this.constants.actividad,
    usuario: this.constants.usuario,
    estado: this.constants.estado,
    fechaAsignacion: this.constants.fechaAsignacion,
    fechaInicio: this.constants.fechaInicio,
    fechaFin: this.constants.fechaFin,
    observaciones: this.constants.observaciones,
    fechaVencimiento: this.constants.fechaVencimiento,
  }];

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;


  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param servicioGeneral Componente de utilidades de servicios de datos
   */
  constructor(
    private servicio: GestionarprocesosService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private servicioGeneral: DataGenericService,
  ) { }

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      // this.sortedData = data;
      return;
    }
    const data = this.dataSource.data.slice();
    const _this_1 = this;
    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'actividad': return _this_1.compare(a.actividad.nombre, b.actividad.nombre, isAsc);
        case 'usuario': return _this_1.compare(a.usuarioAsignado.usuario, b.usuarioAsignado.usuario, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  ngAfterViewInit() {
    if (this.mantId) {
      const path = this.path_mantenimiento_records + '/' + this.mantId;
      this.servicio.listRecords(this.mantId).subscribe(
        (records: any) => {
          console.log(records);
          this.dataSource.data = records;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.lengthList = this.dataSource.filteredData.length;
          if (this.dataSource.filteredData.length === 0) {
            this.noInfoToShow = true;
            this.loader = false;
            this.exportOption = false;
          } else {
            this.noInfoToShow = false;
            this.loader = false;
            this.exportOption = true;
          }
        },
        error => {
          this.noInfoToShow = true;
        }
      );
    }
    
  }
}
