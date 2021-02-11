import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE } from '../../registrar-acta-vecindad-volante/registrar-acta-vecindad-volante.constant';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ActaVolanteDatasource } from '../services/acta-volante.datasource';
import { ActaVolanteCriteria } from '../models/acta-volante-criteria.model';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { ActaVolanteService } from '../services/acta-volante.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { IntervencionInfo } from 'src/app/intervencion/models/intervencionInfoModel.model';
import { ActaVolanteModel } from '../models/acta-volante.model';
import { ArchivoActaVolanteComponent } from '../archivo-acta-volante/archivo-acta-volante.component';
import { ProfileService } from 'src/app/seguridad/services/profile.service';
import { SigmaConfirmFormatToExportComponent } from 'src/app/shared/component/sigma-confirm-format-to-export/sigma-confirm-format-to-export.component';

@Component({
  selector: 'sigma-social-acta-volante-list-exp',
  templateUrl: './acta-volante-list-exp.component.html'
})
export class ActaVolanteListExpComponent implements OnInit {

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

  dataSource: ActaVolanteDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new ActaVolanteCriteria();
  actaVolanteCrear: ActaVolanteModel = new ActaVolanteModel();
  total: any;
  isLabelNuevo: boolean = true;
  actasVolanteResidente: ActaVolanteModel[];
  //  actaVolanteResidente: ActaVolanteResidenteModel = new ActaVolanteResidenteModel();
  //  currentAction: any;
  public currentAction = 'listVolante';
  processing = true;
  listVolante = true;
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

  puedeSeleccionarElFormato = false;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: ActaVolanteService,
    private dialog: MatDialog,
    private router: Router,
    private servicioMantenimiento: MantenimientoService,
    private _route: ActivatedRoute,
    private profileService: ProfileService
  ) {
    //    this.mantenimiento = data;
  }

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new ActaVolanteDatasource(this.servicio);
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
    this.puedeSeleccionarElFormato = this.profileService.isGrantedFunction(this.constants.permiso_social_actas_export_excel);

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
    this.listVolante = false;

  }

  onBack() {
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
          //          window.location.href = 'gestion-social/registrarActaVecindadVolante/admin';
          window.location.href = 'workflow/social/registrar-acta-vecindad-volante';
        }
      }
    );
  }

  list(event) {
    if (event.pk !== undefined) {
      this.mantenimiento.pk = event.pk;
      this.dataSource = new ActaVolanteDatasource(this.servicio);
      this.loadData();
    } else {
      this.listVolante = false;
    }
  }

  adjuntar(actaVolante: ActaVolanteModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    actaVolante.intervencionEncabezado = new IntervencionInfo();
    actaVolante.intervencionEncabezado.id = this.mantenimiento.intervenciones[0].id;
    actaVolante.intervencionEncabezado.nroActa = this.mantenimiento.intervenciones[0].nroActa;
    actaVolante.intervencionEncabezado.observaciones = this.mantenimiento.intervenciones[0].observaciones;
    actaVolante.intervencionEncabezado.fechaVisita = this.mantenimiento.intervenciones[0].fechaVisita;
    actaVolante.intervencionEncabezado.activo = this.mantenimiento.intervenciones[0].activo;
    actaVolante.intervencionEncabezado.tipoVia = this.mantenimiento.tipoVia;
    actaVolante.intervencionEncabezado.tipoEjecucion = this.mantenimiento.intervenciones[0].tipoEjecucion;
    actaVolante.intervencionEncabezado.clase = this.mantenimiento.clase;
    actaVolante.intervencionEncabezado.rutaTransporte = this.mantenimiento.intervenciones[0].rutaTransporte;
    actaVolante.intervencionEncabezado.usuario = this.mantenimiento.intervenciones[0].usuario;
    actaVolante.intervencionEncabezado.tipoSuperficie = this.mantenimiento.intervenciones[0].tipoSuperficie;
    dialogConfig.data = actaVolante;

    const dialogRef = this.dialog.open(ArchivoActaVolanteComponent, dialogConfig);
  }


  exportHandler(acta: ActaVolanteModel) {
    if (this.puedeSeleccionarElFormato) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'custom-modalbox';
      dialogConfig.width = '30%';
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      const dialogRef = this.dialog.open(SigmaConfirmFormatToExportComponent, dialogConfig);

      dialogRef.beforeClosed().subscribe(formato => {
          if (formato !== 0) {
            this.exportarDocumento(acta, formato);
          }
        }
      );
    } else {
      this.exportarDocumento(acta, 'pdf');
    }
  }

  exportarDocumento(acta: ActaVolanteModel, tipo_documento: string) {
    this.disabledReport = true;
    this.servicio.generarDocumento(acta.id, tipo_documento);
    this.disabledReport = false;
  }

}
