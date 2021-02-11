import { Component, OnInit, Input, Output, EventEmitter, ViewChild, SimpleChanges } from '@angular/core';
import { CONST_INTERVENCION_VISITA_VERIFICACION } from '../visitatecnicaverificacion.constants';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { MatDialogConfig, MatTableDataSource, MatDialog, Sort, MatPaginator, MatSort } from '@angular/material';
import { IntervencionFoto } from '../../models/intervencionFoto.model';
import { FotosComponent } from '../../shared/fotos/fotos.component';
import { IntervencionEncabezado } from '../visita-verificacion-admin/models/intervencionEncabezado.model';
import { BehaviorSubject } from 'rxjs';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CountMaxElementsValidator, CountMinElementsValidator } from 'src/app/shared/form/count.elements';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-visita-verificacion-fotografias',
  templateUrl: './visita-verificacion-fotografias.component.html'
})
export class VisitaVerificacionFotografiasComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_INTERVENCION_VISITA_VERIFICACION;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  maxFotos = 6;
  minFotos = 2;
  processing = false;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = ['numeroFoto', 'fechaRegistro', 'nombreFoto', 'fotos', 'acciones'];

  /** Variable usada para agrupar los elementos de la sección
   * de fotos del formulario */
  formularioFotos: FormGroup;

  fotosDatasource: MatTableDataSource<IntervencionFoto> = new MatTableDataSource<IntervencionFoto>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

   /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;

  @Input() mantenimiento: WorkflowMantenimientoModel;
  @Output() saveRegistro = new EventEmitter;
  @Input() isEditable = true;
  @Input() loading = false;

  private sectionFotos = new BehaviorSubject({});
  public sectionFotos$ = this.sectionFotos.asObservable();
  mantenimientoTabla: WorkflowMantenimientoModel;

  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  init() {
    this.formularioFotos = this.formBuilder.group({
      fotos: [
        null,
        Validators.compose([
          Validators.required,
          CountMaxElementsValidator(this.maxFotos),
          CountMinElementsValidator(this.minFotos)
        ])
      ]
    });
    this.mantenimientoTabla = JSON.parse(JSON.stringify(this.mantenimiento));
    this.getDatasource();
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
//    this.columns = this.columns.filter( c => c !== 'acciones');
  }

  addFotos(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let newFoto = new IntervencionFoto();
    newFoto.intervencionEncabezado = new IntervencionEncabezado();
    newFoto.intervencionEncabezado.id = this.mantenimientoTabla.intervenciones[0].id;
    dialogConfig.data = {
      fotos: JSON.parse(JSON.stringify( this.mantenimientoTabla.intervenciones[0].fotos)),
      datasource: this.fotosDatasource,
      foto: JSON.parse(JSON.stringify( newFoto))
    };
    dialogConfig.width = '70%';
    const dialogRef = this.dialog.open(FotosComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(
      val => {
        if (val.code === 1) {
          //this.fotosDatasource.data.push(val.foto);
          this.mantenimientoTabla.intervenciones[0].fotos.push(val.foto);
          this.validate(this.formularioFotos);
          this.getDatasource();
        }
      }
    );
  }

  public getFormValue(): IntervencionFoto[] {
    if (this.mantenimientoTabla === undefined) {
      this.init();
    }
    return this.mantenimientoTabla.intervenciones[0].fotos;
  }

  getDatasource() {
      const _this = this;
      setTimeout(this.getDatasourceDaemon, 50, _this);
  }

  getDatasourceDaemon(_this) {
    if (_this.mantenimientoTabla.intervenciones.length > 0) {
      _this.fotosDatasource.data = JSON.parse(JSON.stringify( _this.mantenimientoTabla.intervenciones[0].fotos));
      _this.validate(_this.formularioFotos);
      if (_this.fotosDatasource.data.length === 0 ) {
        _this.getDatasource();
      }
    }
  }

  removeFoto(index: number) {
    this.mantenimientoTabla.intervenciones[0].fotos.splice(index, 1);
    this.fotosDatasource.data = JSON.parse(JSON.stringify( this.mantenimientoTabla.intervenciones[0].fotos));
    // let formFoto = this.formularioFotos.get('fotos') as any;
    // formFoto.value = this.fotosDatasource.data;
    this.validate(this.formularioFotos);
  }

  saveSeccion() {
    if (this.validate(this.formularioFotos) === true) {
      const cloneMantenimiento = JSON.parse(JSON.stringify( this.mantenimientoTabla));
      this.saveRegistro.emit({ mantenimiento: cloneMantenimiento });
    }
  }

  isAvailable() {
    if (this.mantenimiento.intervenciones !== undefined && this.mantenimiento.intervenciones.length > 0
      && this.mantenimiento.intervenciones[0].fotos !== undefined && this.formularioFotos !== undefined &&
       typeof this.formularioFotos.get('fotos') !== 'undefined') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Método encargado de validar los datos del formulario indicado
   * @param form Formulario del cual se va a realizar la validación
   */
  public validate(form: FormGroup): boolean {
    let formFoto = this.formularioFotos.get('fotos') as any;
    formFoto.value = this.fotosDatasource.data;
    // tslint:disable-next-line: forin
    for (const inner in form.controls) {
      if (inner === 'id') {
        form.get(inner).clearValidators();
        form.get(inner).setErrors(null);
      }
      form.get(inner).markAsTouched();
      form.get(inner).updateValueAndValidity();
    }
    return form.valid;
  }

  public formIsValid() {
    if (this.formularioFotos.get('fotos').valid ) {
      return true;
    }
    return false;
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
  this.fotosDatasource.data = this.fotosDatasource.data.sort((a, b) => {
    const isAsc = sort.direction === 'asc';
    switch (sort.active) {
      case 'numeroFoto':
        return _this_1.compare(a.numeroFoto, b.numeroFoto, isAsc);
      case 'fechaRegistro':
        return _this_1.compare(a.fechaRegistro, b.fechaRegistro, isAsc);
      case 'nombreFoto':
        return _this_1.compare(a.archivo.ruta.substring(a.archivo.ruta.lastIndexOf('\\') + 1),
          b.archivo.ruta.substring(a.archivo.ruta.lastIndexOf('\\') + 1), isAsc);
      default:
        return 0;
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
