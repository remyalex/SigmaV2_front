import { IntervencionFalla } from '../../models/intervencion-falla';
import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar, MatDialogConfig, Sort, MatSortable } from '@angular/material';
import { CONST_INTERVENCION_VISITA_VERIFICACION } from '../visitatecnicaverificacion.constants';
import { VisitaVerificacionDisenioComponent } from '../visita-verificacion-disenio/visita-verificacion-disenio.component';
import { RegistroEditComponent } from '../registro-edit/registro-edit.component';
import { WorkflowMantenimientoModel } from '../../../workflow/models/workflow-mantenimiento.model';
import { FallasCampoCriteria } from './models/fallas-criteria.model';
import { BehaviorSubject } from 'rxjs';


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-visita-verificacion-fallas',
  templateUrl: 'visita-verificacion-fallas.component.html'
})
export class VisitaVerificacionFallasComponent implements OnInit {

  @Input() mantenimiento: WorkflowMantenimientoModel;
  @Output() saveRegistro = new EventEmitter;
  @Input() isEditable = true;
  @Input() loading = false;
  private sectionFallas = new BehaviorSubject({});
  public sectionFallas$ = this.sectionFallas.asObservable();

  mantenimientoTabla: WorkflowMantenimientoModel;

  dataSource: MatTableDataSource<IntervencionFalla> = new MatTableDataSource<IntervencionFalla>();

 /** Elemento usado para gestionar la paginación de la grilla */
 @ViewChild(MatPaginator)
 paginator: MatPaginator;

 /** Elemento usado para gestionar el ordenamiento de la grilla */
 @ViewChild(MatSort)
 sort: MatSort;

  noInfoToShow = false;
  formatoId = null;
  loader = false;
  lengthList: Number;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new FallasCampoCriteria();

  intervencionRegistro = new IntervencionFalla();
 /** Constantes a usar en el componente */
  constants = CONST_INTERVENCION_VISITA_VERIFICACION;
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'numero',
    'distancia',
    'tipoFalla',
    'tipoSuperficie',
    'longitud',
    'ancho',
    'areaFalla',
    'espesor',
    'volumen',
    'tipoIntervencion',
    'acciones'
  ];
  ultimoElementoEditado: number;

  // tslint:disable-next-line: max-line-length

  /**
  * Método encargado de construir una instancia
  */
  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.init();
    this.sort.sort(({ id: 'id', start: 'asc'}) as MatSortable);
  }

  init() {
    this.mantenimientoTabla = JSON.parse(JSON.stringify(this.mantenimiento));
    this.getDatasource();
  }

  viewDisenioInfo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { mantenimiento: this.mantenimientoTabla };
    const dialogRef = this.dialog.open(VisitaVerificacionDisenioComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {

        }
      }
    );
  }

  getDatasource() {
    const _this = this;
    setTimeout(this.getDatasourceDaemon, 50, _this);
}

getDatasourceDaemon(_this) {
  _this.mantenimientoTabla.intervenciones[0].fallas.forEach( (item: IntervencionFalla, index: number) => {
      item.numero = index  + 1;
    });
    _this.dataSource.data = _this.mantenimientoTabla.intervenciones[0].fallas;
    _this.dataSource.paginator = _this.paginator;
    _this.dataSource.sort = _this.sort;
    if (_this.dataSource.data.length === 0 ) {
      _this.getDatasource();
    }
}

  fallaEdit( falla: IntervencionFalla, index: number) {
    this.ultimoElementoEditado = index;
    const clone = JSON.parse(JSON.stringify(this.mantenimientoTabla.intervenciones[0].fallas));
    const dialogConfig = new MatDialogConfig(); 
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      falla: falla,
      fallas: this.mantenimientoTabla.intervenciones[0].fallas,
      datasource: this.dataSource,
      ingresa: true,
      mantenimiento: this.mantenimientoTabla
    };
    const dialogRef = this.dialog.open(RegistroEditComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val.code === 1) {
          const posicion = this.mantenimientoTabla.intervenciones[0].fallas.findIndex(f => f.numero === val.falla.numero);
            //this.mantenimientoTabla.intervenciones[0].fallas[this.ultimoElementoEditado] = val.falla;
            this.mantenimientoTabla.intervenciones[0].fallas[posicion] = val.falla
            //this.getDatasource();
        } if (val.code === 0) {
          this.mantenimientoTabla.intervenciones[0].fallas = clone;
          this.dataSource.data = this.mantenimientoTabla.intervenciones[0].fallas;
        }
      }
    );
  }

  public getFormValue(): IntervencionFalla[] {
    this.mantenimientoTabla.intervenciones[0].fallas.forEach( (item: IntervencionFalla, index: number) => {
      item.numero = (index + 1);
    });
    return this.mantenimientoTabla.intervenciones[0].fallas;
  }

  guardarTodo() {
    let valid = true;
    const _this = this;
    this.mantenimientoTabla.intervenciones[0].fallas.forEach( (item: IntervencionFalla, index: number) => {
      item.numero = index  + 1;
      if (item.id !== undefined && item.id > 0) {
        this.dataSource.data[index].id = item.id;
      }
    });
    this.mantenimientoTabla.intervenciones[0].fallas = this.dataSource.data;
    valid = this.formIsValid();

    if (valid) {
      this.saveRegistro.emit({ mantenimiento: JSON.parse(JSON.stringify(this.mantenimientoTabla))  });
    } else {
      this.snackBar.open('Existen fallas con datos imcompletos', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  public formIsValid() {
    let valid = true;
    this.mantenimientoTabla.intervenciones[0].fallas.forEach( (falla: IntervencionFalla) => {
      if ((falla.distancia == null || undefined) || (falla.tipoSuperficie == null || undefined)
        || (falla.espesor == null || undefined) || (falla.volumen == null || undefined)) {
        valid = false;
      }
    });
    return valid;
  }

    /**
   * Método encargado de ordenar el listado de datos según criterio de ordenamiento
   *
   * @param sort Criterio de datos por el cual se va a realizar el ordenamiento de la
   * información
  */
  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }
    const _this_1 = this;
    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return _this_1.compare(a.id, b.id, isAsc);
        case 'numero': return _this_1.compare(a.numero, b.numero, isAsc);
        case 'tipoFalla': return _this_1.compare(a.tipoFalla.descripcion, b.tipoFalla.descripcion, isAsc);
        case 'tipoSuperficie': return _this_1.compare(a.tipoSuperficie.descripcion, b.tipoSuperficie.descripcion, isAsc);
        case 'tipoIntervencion': return _this_1.compare(a.tipoIntervencion.descripcion, b.tipoIntervencion.descripcion, isAsc);
        default: return 0;
      }
    });
  }

/**
 * Método encargado de comparar dos elementos numericos y retornar
 * si son iguales, mayores o menores.
 *
 * @param a Valor a comparar
 * @param b Segundo valor a comparar
 * @param isAsc Criterio si indica si se comparará ascendentemente o descendente
*/
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
