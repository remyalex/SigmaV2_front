import { MapService } from './../../../../shared/services/map.service';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { SolicitudLaboratorioArchivo } from 'src/app/workflow/models/solicitud-laboratorio-archivo.model';
import { SolicitudLaboratorioInfo } from 'src/app/workflow/models/solicitud-laboratorio-info.model';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { SolicitudLaboratorio } from 'src/app/workflow/models/solicitud-laboratorio.model';
import { Archivo } from 'src/app/workflow/models/archivo.model';
import { SolicitudLaboratorioService } from '../editar-resultados-densidades-campo/services/solicitud-laboratorio.service';

@Component({
  selector: 'app-editar-resultados-extraccion-nucleo',
  templateUrl: './editar-resultados-extraccion-nucleo.component.html'
})
export class EditarResultadosExtraccionNucleoComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {


  columns = [
    'pk',
    'localidad',
    'zona',
    'barrio',
    'upla',
    'desde',
    'hasta',
    'tipoIntervencion'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk',
    'localidad',
    'zona',
    'barrio',
    'upla',
    'fechaInstalacion',
  ];

  actions: GridAccion[] = [
    { nombre: 'listarSolicitudes', label: 'Listar Solicitudes', icono: 'list', color: 'primary' }
  ];

  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;
  solicitudLaboratorio: SolicitudLaboratorio = new SolicitudLaboratorio();
  solicitudesLaboratorio: SolicitudLaboratorio[];
  archivos: Archivo[];
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  solicitudLaboratorioArchivo: SolicitudLaboratorioArchivo = new SolicitudLaboratorioArchivo();
  solicitudesLaboratorioArchivo: SolicitudLaboratorioArchivo[];

  columnsSolicitud = [
    'id', 'pk', 'Fechasolicitud', 'tipoMezcla', 'espesorDisenio', 'UsuarioTramite', 'FechaInstalacion', 'acciones'
  ];

  dataSourceSolicitudesLaboratorioLocal: MatTableDataSource<SolicitudLaboratorio>;
  _solicitudLaboratorio: SolicitudLaboratorio[] = [];
  __solicitudLaboratorioSorted: SolicitudLaboratorio[] = [];

  @ViewChild('paginatorSolicitudLaboratorio') paginatorSolicitudLaboratorio: MatPaginator;
  @ViewChild('sortSolicitudLaboratorio') sortSolicitudLaboratorio: MatSort;

  enviada = false;
  solicitudLaboratorioService: SolicitudLaboratorioService;

  // Constructor del componente
  constructor(
    servicio: MantenimientoService,
    commonService: CommonService,
    formBuilder: FormBuilder,
    workflowService: WorkflowService,
    excelService: ExcelService,
    utilitiesServices: UtilitiesService,
    snackBar: MatSnackBar,
    tokenStorageService: TokenStorageService,
    mapService: MapService,
    solicitudLaboratorioService: SolicitudLaboratorioService
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService);

      this.solicitudLaboratorioService = solicitudLaboratorioService;

      this.dataSourceSolicitudesLaboratorioLocal = new MatTableDataSource([]);
      this.solicitudLaboratorio.solicitudLaboratorioArchivos = [];
      this.solicitudesLaboratorioArchivo = [];

      // Definición de formularios
      this.form = this.formBuilder.group({
        archivo: [null, Validators.compose([Validators.required])],
      });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.commonService.getCondicionByNombre('PK_TIENE_SOLICITUD_LABORATORIO_EXTRACCION_NUCLEO').subscribe(_condicion => {
      this.condicion = _condicion;
    });
   }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar( event) {
    switch (event.accion) {
      case 'listarSolicitudes':
        this.dataSourceSolicitudesLaboratorioLocal = event.mantenimiento.solicitudesLaboratorio.filter(
          solicitud => solicitud.tipoResultado.id === 747427
        );
        this._solicitudLaboratorio = event.mantenimiento.solicitudesLaboratorio;
        this.listarSolicitudes(event.mantenimiento);
        break;
      case 'adjuntarResultados':
        this.adjuntarResultados(event.mantenimiento.solicitudesLaboratorio);
        break;

    }
  }

  listarSolicitudes(mantenimiento: WorkflowMantenimientoModel) {
    this.mapService.disconectGrid();
    this.mantenimiento = mantenimiento;
    this.data.mantenimiento = this.mantenimiento;
    this.currentAction = 'listarSolicitudes';
  }

  adjuntarResultados(solicitudesLaboratorio: SolicitudLaboratorio){
    this.solicitudLaboratorio = solicitudesLaboratorio;
    this.solicitudLaboratorio.solicitudLaboratorioArchivos.push(this.solicitudLaboratorioArchivo);
    this.currentAction = 'adjuntarResultados';
  }

  /** Método encargado de devolver a la página principal el componente */
  onBack(): void {
    this.ngOnInit();
    this.currentAction = 'list';
  }

  subirArchivo(solicitudesLaboratorio: SolicitudLaboratorio){
    this.solicitudLaboratorio = solicitudesLaboratorio;
    this.archivos = [];
    this.currentAction = 'adjuntarResultados';
  }

  onBackSolicitudes(): void {
    this.currentAction = 'listarSolicitudes';
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.processing = true;
    this.workflowService.update(this.data).subscribe(
        data => {
            this.data = data;
            this.processing = false;
            this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
                duration: 5000,
                panelClass: ['success-snackbar']
            });
            this.onBackSolicitudes();

        },
        error => {
            this.processing = false;
            this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
        });
   }

saveLab() {
  this.solicitudLaboratorioService.update(this.solicitudLaboratorio).subscribe(
    data => {
      this.currentAction = 'listarSolicitudes';
      this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
    },
    error => {
      this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
      this.currentAction = 'listarSolicitudes';
    },

  );
}

   updateDataSourceSolicitudesLaboratorio() {
    this.dataSourceSolicitudesLaboratorioLocal.data = this._solicitudLaboratorio;
    this.dataSourceSolicitudesLaboratorioLocal.paginator = this.paginatorSolicitudLaboratorio;
    this.dataSourceSolicitudesLaboratorioLocal.sort = this.sortSolicitudLaboratorio;
  }

  getCantidadSolicitudes() {
    return this._solicitudLaboratorio.length;
  }

  setArchivoSolicitud(event: any) {
    if (event && event.length > 0) {
      if (event.length < 3) {
        for (const archivo of event) {
          let existe = false;
          for (const solicitudArchivo of this.solicitudLaboratorio.solicitudLaboratorioArchivos) {
            if (archivo.id === solicitudArchivo.archivo.id) {
              existe = true;
            }
          }
          if (!existe && archivo.id) {
            const solicitudArchivo = new SolicitudLaboratorioArchivo();
            solicitudArchivo.archivo = archivo;
            const solicitudLaboratorioInfo = new SolicitudLaboratorioInfo();
            solicitudLaboratorioInfo.id = this.solicitudLaboratorio.id;

            solicitudArchivo.solicitudLaboratorio = solicitudLaboratorioInfo;
             this.solicitudLaboratorio.solicitudLaboratorioArchivos.push(solicitudArchivo);
          }

        }
      } else {
        this.enviada = true;
        this.snackBar.open('Solo es posible cargar un maximo de 2 archivos', 'X', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    }

    if (event === '') {
      this.solicitudLaboratorio.solicitudLaboratorioArchivos = [];
    }
  }

}
