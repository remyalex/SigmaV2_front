import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';
import { SolicitudLaboratorio } from 'src/app/workflow/models/solicitud-laboratorio.model';
import { Usuario } from 'src/app/administracion/usuario/models/usuario.model';
import { SolicitudLaboratorioArchivo } from 'src/app/workflow/models/solicitud-laboratorio-archivo.model';
import { Archivo } from 'src/app/workflow/models/archivo.model';
import { SolicitudLaboratorioArchivoInfo } from 'src/app/workflow/models/solicitud-laboratorio-archivo-info.model';
import { CONST_PRODUCCION_RESULTADOS_DENSIDADES } from './resultados-densidades-campos.constant';
import { SolicitudLaboratorioService } from './services/solicitud-laboratorio.service';
import { SolicitudLaboratorioInfo } from 'src/app/workflow/models/solicitud-laboratorio-info.model';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';


@Component({
  selector: 'app-editar-resultados-densidades-campo',
  templateUrl: './editar-resultados-densidades-campo.component.html'
})
export class EditarResultadosDensidadesCampoComponent
 extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {

  // constants
  constans = CONST_PRODUCCION_RESULTADOS_DENSIDADES;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'pk',
    'localidad',
    'zona',
    'barrio',
    'upla',
    //'fechaInstalacion',
    'desde',
    'hasta',
    'responsable'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'pk',
    'localidad',
    'zona',
    'barrio',
    'upla',
    'fechaSolicitud',
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
    'id', 'pk', 'UsuarioTramite', 'Fechasolicitud', 'tipoMezcla',   'acciones'
  ];

  dataSourceSolicitudesLaboratorioLocal: MatTableDataSource<SolicitudLaboratorio>;
  _solicitudLaboratorio: SolicitudLaboratorio[] = [];
  __solicitudLaboratorioSorted: SolicitudLaboratorio[] = [];

  @ViewChild('paginatorSolicitudLaboratorio') paginatorSolicitudLaboratorio: MatPaginator;
  @ViewChild('sortSolicitudLaboratorio') sortSolicitudLaboratorio: MatSort;

  enviada = false;
  solicitudLaboratorioService: SolicitudLaboratorioService;
  defaulFilters: KeyValuePair[] = [];

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
    this.defaulFilters.push({key: 'permisoId', value: '1'});
    this.commonService.getCondicionByNombre('PK_TIENE_SOLICITUD_LABORATORIO_DENSIDADES_CAMPO').subscribe(_condicion => {
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
          solicitud => solicitud.tipoResultado.id === 747426
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
    //this.solicitudLaboratorioArchivo.solicitudLaboratorio = this.solicitudLaboratorio;
    
    /*
    let  solicitudLaboratorioTmp = new SolicitudLaboratorio();
    solicitudLaboratorioTmp.id = solicitudesLaboratorio.id;
    this.solicitudLaboratorioArchivo.solicitudLaboratorio = solicitudLaboratorioTmp;
    */
    this.solicitudLaboratorio.solicitudLaboratorioArchivos.push(this.solicitudLaboratorioArchivo);

    this.currentAction = 'adjuntarResultados';
  }

  /** Método encargado de devolver a la página principal el componente */
  onBack(): void {
    this.ngOnInit();
//    this.search();
    this.currentAction = 'list';
  }

  subirArchivo(solicitudesLaboratorio: SolicitudLaboratorio){
    this.solicitudLaboratorio = solicitudesLaboratorio;
    this.archivos = [];
    /*      
    for( const solicitudArchivo of this.solicitudLaboratorio.solicitudLaboratorioArchivos){
      this.archivos.push(solicitudArchivo.archivo);
    }
    */
    this.currentAction = 'adjuntarResultados';
  }

  onBackSolicitudes(): void {
    this.currentAction = 'listarSolicitudes';
  }

  
   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.processing = true;

    //this.asignarArchivosSeleccionados(this.solicitudLaboratorioArchivo);

    this.workflowService.update(this.data).subscribe(
        data => {
            this.data = data;
            this.processing = false;
            this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
                duration: 5000,
                panelClass: ['success-snackbar']
            });
            //let urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'admin')
            //this.router.navigate([urlBack]);
            this.onBackSolicitudes();

        },
        error => {
            this.processing = false;
            //this.disableSubmit = false;
            this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
        });
   }

saveLab(){
  this.solicitudLaboratorioService.update(this.solicitudLaboratorio).subscribe(
    data => {
//      this.disabledBtn_Login = false;
      this.currentAction = 'listarSolicitudes';
      this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
//      const urlBack = location.pathname.substr(0, location.pathname.lastIndexOf('/edit')) + '/list/' + this.mantenimiento.pk;
//      this.router.navigate([urlBack]);
    },
    error => {
//      this.disabledBtn_Login = false;
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
    //this.enviada = false;
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
            //if (!existe) {
            const solicitudArchivo = new SolicitudLaboratorioArchivo();
            //solicitudArchivo.fecha = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());
            solicitudArchivo.archivo = archivo;
            let solicitudLaboratorioInfo = new SolicitudLaboratorioInfo();
            solicitudLaboratorioInfo.id = this.solicitudLaboratorio.id;
        
            solicitudArchivo.solicitudLaboratorio = solicitudLaboratorioInfo;
             this.solicitudLaboratorio.solicitudLaboratorioArchivos.push(solicitudArchivo);
            //this.data.mantenimiento.solicitudesLaboratorio.push(solicitudArchivo);
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
