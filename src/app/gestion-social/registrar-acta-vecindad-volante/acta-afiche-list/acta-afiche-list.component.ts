import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE } from '../../registrar-acta-vecindad-volante/registrar-acta-vecindad-volante.constant';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ActaAficheDatasource } from '../services/acta-afiche.datasource';
import { ActaAficheCriteria } from '../models/acta-afiche-criteria.model';
import { ActaAficheModel } from '../models/acta-afiche.model';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { ActaAficheService } from '../services/acta-afiche.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { ArchivoActaAficheComponent } from '../archivo-acta-afiche/archivo-acta-afiche.component';
import { IntervencionInfo } from 'src/app/intervencion/models/intervencionInfoModel.model';
import { Archivo } from 'src/app/workflow/models/archivo.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-social-acta-afiche-volante-list',
  templateUrl: './acta-afiche-list.component.html'
})
export class ActaAficheListComponent implements OnInit, AfterViewInit {

 /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE;
  // inputs
  @Input() mantenimiento: WorkflowMantenimientoModel = new WorkflowMantenimientoModel();
  
  /**
   * Variable usada para identificar la acción a la
   * cual se dirigirá el click del botón atras del formualario
   * actual
   **/
  @Output() back = new EventEmitter();

  dataSource: ActaAficheDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new ActaAficheCriteria();
  actaAfiche: ActaAficheModel;
  actaAficheCrear: ActaAficheModel = new ActaAficheModel();
  total: any;
  isLabelNuevo: boolean = true;
  actasAficheResidente: ActaAficheModel[];
  //  actaAficheResidente: ActaAficheResidenteModel = new ActaAficheResidenteModel();
  //  currentAction: any;
  public currentAction = 'listAfiches';
  processing = true;
  listAfiche = true;
  creaAfiche = false;
  editarVolante = false;
  consultar = false;
  disabledReport = false;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'numero',
    'fechaRegistro',
    'acciones'
  ];


  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: ActaAficheService,
    private dialog: MatDialog,
    private router: Router,
    private servicioMantenimiento: MantenimientoService,
    private _route: ActivatedRoute
  ) {
    //    this.mantenimiento = data;
  }

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new ActaAficheDatasource(this.servicio);
    const pk = this._route.snapshot.paramMap.get('pk');
    if (pk !== null && pk.length > 0) {
      this.servicioMantenimiento.detailByPk(Number(pk)).subscribe(data => {
        this.mantenimiento = data;
        this.loadData();
      }, error => {
      });
    } else {
      this.loadData();
    }

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
    this.criteria.pk = this.mantenimiento.pk;
    this.dataSource.loadData(this.criteria);
    this.processing = false;
    this.listAfiche = false;
  }

  /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la creación de un objeto del componente.
   */
  create(): void {
    this.processing = false;
    this.listAfiche = true;
    this.creaAfiche = true;
    /**
    const posUltimaPosicion = location.pathname.lastIndexOf('/list');
    const url = '/gestion-social/registrarActaVecindadVolante/createAfiche/' + this.mantenimiento.pk;
    this.router.navigate([url]);
     */
  }

  /**
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(actaAfiche: ActaAficheModel): void {
    this.actaAfiche = actaAfiche;
    this.processing = false;
    this.listAfiche = true;
    this.editarVolante = true;
    //const urlBack = '/gestion-social/registrarActaVecindadVolante/editAfiche/' + actaAfiche.id + '/' + this.mantenimiento.pk;
    //this.router.navigate([urlBack]);
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param {nombre_parametro} Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(actaAfiche: ActaAficheModel): void {
    /*    const urlBack = '/gestion-social/registrarActaVecindadVolante/listAfiche/' + this.mantenimiento.pk + '/true';
        this.router.navigate([urlBack]);
        */
    this.consultar = true;
  }


  onBack() {
    if (this.consultar) {
      this.consultar = false;
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'custom-modalbox';
      dialogConfig.width = '30%';
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

      dialogRef.beforeClosed().subscribe(
        val => {
          if (val === 1) {
            const currentAction = 'list';
//            window.location.href = 'gestion-social/registrarActaVecindadVolante/admin';
            window.location.href = 'workflow/social/registrar-acta-vecindad-volante';
          }
        }
      );
    }
  }

  list(event) {
    if (event.pk !== undefined) {
      this.mantenimiento.pk = event.pk;
      this.dataSource = new ActaAficheDatasource(this.servicio);
      this.loadData();
    } else {
      this.listAfiche = false;
    }
    this.creaAfiche = false;
    this.editarVolante = false;
  }

  adjuntar(actaAfiche: ActaAficheModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    actaAfiche.intervencionEncabezado = new IntervencionInfo();
    actaAfiche.intervencionEncabezado.id = this.mantenimiento.intervenciones[0].id;
    actaAfiche.intervencionEncabezado.nroActa = this.mantenimiento.intervenciones[0].nroActa;
    actaAfiche.intervencionEncabezado.observaciones = this.mantenimiento.intervenciones[0].observaciones;
    actaAfiche.intervencionEncabezado.fechaVisita = this.mantenimiento.intervenciones[0].fechaVisita;
    actaAfiche.intervencionEncabezado.activo = this.mantenimiento.intervenciones[0].activo;
    actaAfiche.intervencionEncabezado.tipoVia = this.mantenimiento.tipoVia;
    actaAfiche.intervencionEncabezado.tipoEjecucion = this.mantenimiento.intervenciones[0].tipoEjecucion;
    actaAfiche.intervencionEncabezado.clase = this.mantenimiento.clase;
    actaAfiche.intervencionEncabezado.rutaTransporte = this.mantenimiento.intervenciones[0].rutaTransporte;
    actaAfiche.intervencionEncabezado.usuario = this.mantenimiento.intervenciones[0].usuario;
    actaAfiche.intervencionEncabezado.tipoSuperficie = this.mantenimiento.intervenciones[0].tipoSuperficie;
    dialogConfig.data = actaAfiche;

    const dialogRef = this.dialog.open(ArchivoActaAficheComponent, dialogConfig);
  }

  exportarPDF(acta: ActaAficheModel) {
    this.disabledReport = true;
    this.servicio.generarPDF(acta.id);
    this.disabledReport = false;
}


}
