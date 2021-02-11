import { Component, OnInit, ViewChild, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CONST_INTERVENCION_VISITA_VERIFICACION } from '../visitatecnicaverificacion.constants';
import { MatSnackBar, MatDialog, MatPaginator, MatTableDataSource, MatDialogConfig, Sort, MatSort } from '@angular/material';
import { IntervencionChequeoModel } from '../../models/intervencion-chequeo.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { IntervencionChequeoEditComponent } from '../intervencion-chequeo-edit/intervencion-chequeo-edit.component';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CountMaxElementsValidator } from 'src/app/shared/form/count.elements';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-visita-verificacion-obs-foto',
  templateUrl: './visita-verificacion-obs-foto.component.html'
})
export class VisitaVerificacionObsFotoComponent implements OnInit, AfterViewInit {

 /** Constantes a usar en el componente */
  constants = CONST_INTERVENCION_VISITA_VERIFICACION;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  intervencionChequeo: IntervencionChequeoModel;

  @Input() mantenimiento: WorkflowMantenimientoModel;
  @Output() saveRegistro = new EventEmitter;
  @Input() isEditable = true;
  @Input() loading = false;

  mantenimientoTabla: WorkflowMantenimientoModel;

    /** Cantidad máxima de fotos permitidas */
    maxFotos = 100;

  /** Variable usada para agrupar los elementos de la sección
   * de fotos del formulario */
  formularioFotos: FormGroup;

  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog
    ) {
    this.intervencionChequeo = new IntervencionChequeoModel();
  }

  // tslint:disable-next-line: max-line-length
  displayedColumns: string[] = ['chequeo', 'observaciones', 'imagen', 'imagen2', 'imagen3', 'imagen4', 'acciones'];
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: MatTableDataSource<IntervencionChequeoModel> = new MatTableDataSource<IntervencionChequeoModel>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

   /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;

  ngAfterViewInit() {
    //this.init();
  }
  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.formularioFotos = this.formBuilder.group({
      fotos: [
        null,
        Validators.compose([
          CountMaxElementsValidator(this.maxFotos),
        ])
      ]
    });
    // this.mantenimientoTabla = JSON.parse(JSON.stringify(this.mantenimiento));
    // //this.getDatasource();
    // this.dataSource.data = this.mantenimientoTabla.intervenciones[0].chequeos;
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    // this.formularioFotos = this.formBuilder.group({
    //   fotos: [
    //     null,
    //     Validators.compose([
    //       CountMaxElementsValidator(this.maxFotos),
    //     ])
    //   ]
    // });
  }

  public init() {
    // this.mantenimientoTabla = JSON.parse(JSON.stringify(this.mantenimiento));
    // this.getDatasource();
    
    //this.getDatasource();
    this.mantenimientoTabla = JSON.parse(JSON.stringify(this.mantenimiento));
    this.dataSource.data = this.mantenimientoTabla.intervenciones[0].chequeos;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDatasource() {
    const _this = this;
    setTimeout(this.getDatasourceDaemon, 50, _this);
}

getDatasourceDaemon(_this) {
  if (_this.mantenimientoTabla.intervenciones.length > 0) {
    _this.dataSource.data = JSON.parse(JSON.stringify( _this.mantenimientoTabla.intervenciones[0].fotos));
    if (_this.fotosDatasource.data.length === 0 ) {
      _this.getDatasource();
    }
  }
}

  search() {}

  /**
   * Método encargado de validar los datos del formulario indicado
   * @param form Formulario del cual se va a realizar la validación
   */
  public validate(form: FormGroup): boolean {
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

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() { }

  configBasicMatDialog(): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    return dialogConfig;
  }

  adicionar() {
    const dialogConfig = this.configBasicMatDialog();
    dialogConfig.data = {
      mantenimiento: this.mantenimientoTabla,
      datasource: this.dataSource,
      chequeo: new IntervencionChequeoModel(),
      accion: 'create'
    };
    const dialogRef = this.dialog.open(IntervencionChequeoEditComponent, dialogConfig);
  }

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */

  edit(chequeo: IntervencionChequeoModel) {
    const dialogConfig = this.configBasicMatDialog();
    if (chequeo.id === undefined) {
      const chequeoConsulta = this.mantenimientoTabla.intervenciones[0].chequeos.find(w => w.observaciones === chequeo.observaciones);
      if (chequeoConsulta !== null) {
        chequeo = chequeoConsulta;
      }
    }
    dialogConfig.data = {
      mantenimiento: this.mantenimientoTabla,
      datasource: this.dataSource,
      chequeo: chequeo,
      accion: 'edit'
    };
    const dialogRef = this.dialog.open(IntervencionChequeoEditComponent, dialogConfig);
  }

  public getFormValue(): IntervencionChequeoModel[] {
    return this.mantenimientoTabla.intervenciones[0].chequeos;
  }

  show(chequeo: IntervencionChequeoModel) {
    const dialogConfig = this.configBasicMatDialog();
    dialogConfig.data = {
      mantenimiento: this.mantenimientoTabla,
      datasource: this.dataSource,
      chequeo: chequeo,
      accion: 'show'
    };
    const dialogRef = this.dialog.open(IntervencionChequeoEditComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(index: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = this.constants.confirmar;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.mantenimientoTabla.intervenciones[0].chequeos.splice(index, 1);
        this.dataSource.data = this.mantenimientoTabla.intervenciones[0].chequeos;
        this.formularioFotos
        .get('fotos')
        .setValue(this.mantenimientoTabla.intervenciones[0].chequeos);
      }
    });
  }

  saveSeccion() {
    if ( this.validate(this.formularioFotos)) {
      this.mantenimientoTabla.intervenciones[0].activo = true;
      this.saveRegistro.emit({mantenimiento: JSON.parse(JSON.stringify(this.mantenimientoTabla))});
    } else {
      return;
    }
  }

  public formIsValid() {
    if ( this.validate(this.formularioFotos) && this.mantenimientoTabla.intervenciones[0].chequeos.length > 0 ) {
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
    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'chequeo':
          return _this_1.compare(a.listaChequeo.descripcion, b.listaChequeo.descripcion, isAsc);
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
