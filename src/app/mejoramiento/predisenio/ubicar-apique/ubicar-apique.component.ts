import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { CONST_MEJORAMIENTO_PREDISENIO } from '../predisenio.constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Predisenio } from '../models/predisenio.model';
import { PredisenioService } from '../service/predisenio.service';
import { VisitaPredisenoApiqueModel } from 'src/app/workflow/models/visita.prediseno.apique.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { UbicarApiqueCriteria } from './models/ubicar-apique-criteria.model';
import { NumberValidator } from '../../../shared/form/number.validator';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ubicar-apique',
  templateUrl: './ubicar-apique.component.html'
})
export class UbicarApiqueComponent implements OnInit, AfterViewInit {

 /** Constantes a usar en el componente */
  constants = CONST_MEJORAMIENTO_PREDISENIO;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new UbicarApiqueCriteria();
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  predisenioEdit: Predisenio;
  mantenimientoTemp: any;
  disabled: boolean;
  dataSolicitudApique: MatTableDataSource<VisitaPredisenoApiqueModel>;
  newSolicitudApique: VisitaPredisenoApiqueModel;
  lengthList: Number;
  currentAction: any;
  existe: Boolean = false;
  noInfoToShow: Boolean;
  today = Date.now();

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'nomenclatura',
    'observacion'
  ];

  filterValues = {
    nomenclatura: '',
    observacion: ''
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) mantenimiento: WorkflowMantenimientoModel,
    private dialogRef: MatDialogRef<UbicarApiqueComponent>,
    private formBuilder: FormBuilder,
    private servicio: PredisenioService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.disabled = false;
    this.newSolicitudApique = new VisitaPredisenoApiqueModel();
    this.mantenimientoTemp = mantenimiento;
    this.predisenioEdit = mantenimiento.predisenio;
    this.form = this.formBuilder.group({
      'nomenclaturaInput': [null, Validators.compose([Validators.required])],
      'observacionInput': [null, Validators.compose([Validators.required, Validators.maxLength(200)])]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.loadData();
    this.currentAction = 'tableApiques';
  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.criteria.page = this.paginator.pageIndex;
      this.criteria.size = this.paginator.pageSize;
      this.loadData();
    });

    this.sort.sortChange.subscribe(() => {
      this.criteria.sortBy = this.sort.active;
      this.criteria.sortOrder = this.sort.direction || 'asc';
      this.loadData();
    });
 }

 /**
  * Método encargado de gestionar la carga de los pks
  * de la grilla al iniciar el componente.
  */
  loadData(): void {
    if (this.predisenioEdit.apiques === undefined || this.predisenioEdit.apiques === null) {
      this.noInfoToShow = false;
      this.disabled = false;
      this.predisenioEdit.apiques = [];
      this.dataSolicitudApique = new MatTableDataSource([]);
      this.dataSolicitudApique.sort = this.sort;
      this.dataSolicitudApique.paginator = this.paginator;
      this.lengthList = this.dataSolicitudApique.filteredData.length;
    } else {
      if (this.mantenimientoTemp.actividadActual.id === 36 || this.mantenimientoTemp.actividadActual.id === 38) {
        this.disabled = true;
        this.form.disable();
      }
      this.noInfoToShow = false;
      this.dataSolicitudApique = new MatTableDataSource(this.predisenioEdit.apiques);
      this.dataSolicitudApique.sort = this.sort;
      this.dataSolicitudApique.paginator = this.paginator;
      this.lengthList = this.dataSolicitudApique.filteredData.length;
    }
  }

  applyFilterNom(filterValue: string) {
    this.dataSolicitudApique.filter = filterValue.trim().toLowerCase();
  }

  /**
  * Método encargado de invocar la petición de consulta
  * al servicio según los criterios definidos
  */
  search(): void {
    this.paginator.pageIndex = 0;
    this.filterValues.nomenclatura = this.criteria.nomenclatura.trim().toLowerCase();
    this.filterValues.observacion = this.criteria.observacion.trim().toLowerCase();

    this.dataSolicitudApique.filter = JSON.stringify(this.filterValues);

    this.dataSolicitudApique.filterPredicate = function (data, filter: string): boolean {
      const searchTerms = JSON.parse(filter);
      return data.nomenclatura.trim().toLowerCase().indexOf(searchTerms.nomenclatura) !== -1
        && data.observacion.trim().toLowerCase().indexOf(searchTerms.observacion) !== -1;
    };
    if (this.dataSolicitudApique.filteredData.length > 0) {
      this.noInfoToShow = false;
    } else {
      this.noInfoToShow = true;
    }
  }

  /**
   * Método encargado de limpiar los campos de filtros de la grilla
   * y refrescar la grilla.
   */
  clear(): void {
    let noLimpiar = ["page", "size", "sortBy", "sortOrder", "getUrlParameters"];
    for (let key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteria[key] = "";
      }
    }
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  newApique() {
    this.form.markAsUntouched();
    this.newSolicitudApique = new VisitaPredisenoApiqueModel();
    this.newSolicitudApique.nomenclatura =
      this.mantenimientoTemp != null && this.mantenimientoTemp.ejeVial && this.mantenimientoTemp.desde ?
      this.mantenimientoTemp.ejeVial + ' ' + this.mantenimientoTemp.desde : '';
    this.currentAction = 'createApique';
  }

  addUbicarApique() {
    this.existe = false;
    this.predisenioEdit.apiques.forEach(apiques => {
      if (apiques.nomenclatura === this.newSolicitudApique.nomenclatura) {
        this.existe = true;
        this.snackBar.open('El registro ya existe', 'X', {
          duration: 5000,
          panelClass: ['warning-snackbar']
        });
        return;
      }
    });
    if (this.existe === false) {
      this.predisenioEdit.apiques.push(this.newSolicitudApique);
      this.loadData();
      this.currentAction = 'tableApiques';
    }
  }

  back() {
    this.currentAction = 'tableApiques';
  }
  
  /** Método encargado de devolver a la página principal el componente */
  onBack(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val == 1) {
          this.dialogRef.close(0);
        }
      }
    );
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    if (this.dataSolicitudApique.filteredData.length > 0) {
      this.predisenioEdit.apiques = [];
      this.predisenioEdit.apiques = this.dataSolicitudApique.filteredData;
      this.mantenimientoTemp.predisenio = this.predisenioEdit;
      this.servicio.listenerAction(this.mantenimientoTemp);
      this.dialogRef.close(1);
    } else {
      this.snackBar.open('Favor agregar apiques', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    /*for (let index = 0; index < this.predisenioEdit.apiques.length; index++) {
      if (this.predisenioEdit.apiques[index].id == null) {
        this.predisenioEdit.apiques.splice(index, 1);
      }
    }*/
    this.dialogRef.close(0);
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.form);
    if (this.form.valid === true) {
      this.addUbicarApique();
    } else {
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }


  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    // tslint:disable-next-line: forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

}
