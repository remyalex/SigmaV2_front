import { CollectionResponse } from './../../../shared/models/collection-response';
import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { EventoService } from '../services/evento.service';
import { EventoCriteria } from '../models/evento-criteria.model';
import { EventoDatasource } from '../services/evento.datasource';
import { Evento } from '../models/evento.model';
import { EventoEditComponent } from '../evento-edit/evento-edit.component';
import { EventoDetailComponent } from '../evento-detail/evento-detail.component';
import { EventoDeleteComponent } from '../evento-delete/evento-delete.component';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_EVENTO } from './../evento.constant';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Eventorol } from '../eventorol/models/eventorol.model';
import { CONST_ADMINISTRACION_EVENTOROL } from '../eventorol/eventorol.constant';
import { EventorolDatasource } from '../eventorol/services/eventorol.datasource';
import { CONST_ADMINISTRACION_EVENTOUSUARIO } from '../eventousuario/eventousuario.constant';
import { EventousuarioDatasource } from '../eventousuario/services/eventousuario.datasource';
import { Eventousuario } from '../eventousuario/models/eventousuario.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Clase encargada de la lista del componente */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-administracion-evento-list',
  templateUrl: './evento-list.component.html'
})

export class EventoListComponent implements OnInit, AfterViewInit {


  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesServices Componente de utilidades de peticiones a servicios
   */
  constructor(
    private servicio: EventoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private utilitiesServices: UtilitiesService
  ) { }

  /** Bandera para indicar si el componente se encuentra en procesamiento por el servicio  */
  loader = true;
  /** Variable que se encarga de Mostrar o no la informacion en el componente  */
  noInfoToShow = false;
  /**  Variable que se encarga de habilitar la opcion de exportar */
  exportOption = true;
  /** objeto que se usa para determinar el tamaño de la grilla del componente */
  lengthList: Number;
  /** Lista de objetos eventos para la grilla del componente*/
  eventos: Evento[];
  /** Lista de objetos eventos para la grilla del componente*/
  listEventos: any;
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EVENTO;
  constantsRol = CONST_ADMINISTRACION_EVENTOROL;
  constantsUsuarios = CONST_ADMINISTRACION_EVENTOUSUARIO;
  /**  Bandera para indicar si el componente se encuentra en procesamiento por el servicio*/
  cargandoExcel = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: EventoDatasource;
  /**  Conjunto de datos de Eventos que utiliza la exportación del componente */
  dataSourceEventsExport: EventoDatasource;
  /**  Conjunto de datos de Roles que utiliza la exportación del componente */
  dataSourceRolesExport: EventorolDatasource;
  /**  Conjunto de datos de Usuarios que utiliza la exportación del componente */
  dataSourceUsuariosExport: EventousuarioDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new EventoCriteria();
  /**  Criterios de busqueda por los cuales filtrara la la exportación del componente */
  criteriaEventExport = new EventoCriteria();
  /**  Criterios de busqueda por los cuales filtrara la la exportación del componente */
  criteriaExport = new EventoCriteria();
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: EventoDatasource;
  /** Definición de las columnas presentadas en la grilla */
  columns = [
    'nombre',
    'descripcion',
    'activo',
    'acciones'
  ];

  /**  Columnas de que presentará la grilla de Eventos usada en el componente */
  orderEvent = [
    'id',
    'nombre',
    'descripcion',
    'activo'
  ];

  /**  Columnas de que presentará la grilla de Eventos usada en el componente */
  orderRoles = [
    'rolId',
    'evento',
    'fechaDesde',
    'fechaHasta',
    'activo'
  ];
  /**  Columnas de que presentará la grilla de Usuarios usada en el componente */
  orderUsuarios = [
    'usuario',
    'evento',
    'fechaDesde',
    'fechaHasta',
    'activo'
  ];
  /** Definición de los encabezados de las columnas presentadas en la grilla */
  headers = [{
    id: this.constants.id,
    nombre: this.constants.nombre,
    descripcion: this.constants.descripcion,
    activo: this.constants.activo
  }];

  /**  Nombres de columnas que presentará la grilla de eventos usada en el componente */
  headersEventsExport = [{
    id: this.constants.id,
    nombre: this.constants.nombre,
    descripcion: this.constants.descripcion,
    activo: this.constants.activo,
  }];

  /**  Nombres de columnas que presentará la grilla de roles usada en el componente */
  headersRolesExport = [{
    rolId: this.constantsRol.rolId,
    evento: this.constantsRol.eventoId,
    fechaDesde: this.constantsRol.fechaDesde,
    fechaHasta: this.constantsRol.fechaHasta,
    activo: this.constantsRol.activo,
  }];

  /**  Nombres de columnas que presentará la grilla de usuarios usada en el componente */
  headersUsuariosExport = [{
    usuario: this.constantsUsuarios.usuarioId,
    evento: this.constantsUsuarios.eventoId,
    fechaDesde: this.constantsUsuarios.fechaDesde,
    fechaHasta: this.constantsUsuarios.fechaHasta,
    activo: this.constantsUsuarios.activo,
  }];

 /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;

  /**  Conjunto de datos que utiliza la exportación del componente */
  dataEventsExport: any = [];
  /**  Conjunto de datos que utiliza la exportación del componente */
  dataRolesExport: any = [];
  /**  Conjunto de datos que utiliza la exportación del componente */
  dataUsuariosExport: any = [];

 /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource = new EventoDatasource(this.servicio);
    this.loadData();
  }

  /** Método encargado de realizar la consulta de información de Eventos para el componente */
  getInfoEvento() {
    this.loader = true;
    this.servicio.list().subscribe(
      (listaEventos: Evento[]) => {
        this.eventos = listaEventos;
        this.loadData();
      }, error => {
        this.eventos = [];
        this.loadData();
      }
    );
  }

  /** Método encargado de realizar consulta de información para el componente */
  search(): void {
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    this.servicio.search(this.criteria).subscribe(
      (searchEvento: CollectionResponse<Evento>) => {
        this.eventos = searchEvento.content;
        this.criteriaExport.nombre = this.criteria.nombre;
        this.loadData();
      },
      error => {
        this.eventos = [];
        this.loadData();
      }
    );
 }

 /**
  * Método encargado de gestionar la carga de los pks
  * de la grilla al iniciar el componente.
  */
  loadData(): void {
    this.dataSource.loadData(this.criteria);
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
   * Método encargado de realizar el llamado al componente de edición
   * de un registro de la grilla.
   *
   * @param evento Objeto que encapsula los datos del registro seleccionado
   * que se va a editar
   */
  edit(evento: Evento): void {
    this.servicio.updateEventData(evento);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = evento;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(EventoEditComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.loadData();
        }
      }
    );
  }

  /**
   * Método encargado de invocar el componente de visualización de un registro
   * desde el listado actual
   *
   * @param evento Objeto que encapsula los datos del registro seleccionado
   * del cual se va a presentar el detalle de la información
   */
  detail(evento: Evento): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = evento;
    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(EventoDetailComponent, dialogConfig);
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param evento Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(evento: Evento): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = evento;
    const dialogRef = this.dialog.open(EventoDeleteComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(
      val => {
        if (val) {
          this.loadData();
        }
      }
    );
  }

  /**
   * Método encargado de limpiar los campos de filtros de la grilla
   * y refrescar la grilla.
   */
  clear(): void {
    this.criteria.nombre = '';
    this.getInfoEvento();
    this.paginator.pageIndex = 0;
    this.criteria.page = 0;
    let noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (let key in this.criteria) {
      if (!noLimpiar.includes(key)) {
        this.criteriaExport[key] = '';
      }
    }
    this.paginator.pageIndex = 0;
  }

  /**
   * Método encargado de exportar la información de la grilla presentada 
   * en el componente a un archivo de excel.
   */
  exportAsXLSX(): void {

    let worksheetEventos: XLSX.WorkSheet;
    let worksheetRoles: XLSX.WorkSheet;
    let worksheetUsuarios: XLSX.WorkSheet;

    const eventoSubject = new BehaviorSubject<any>([]);
    const rolesSubject = new BehaviorSubject<any>([]);
    const usuariosSubject = new BehaviorSubject<any>([]);

    const loadingEventos$ = eventoSubject.asObservable();
    const loadingRoles$ = rolesSubject.asObservable();
    const loadingUsuarios$ = usuariosSubject.asObservable();

    this.dataSourceExport = new EventoDatasource(this.servicio);
    this.cargandoExcel = true;
    const total = this.dataSource.totalelementsSubject.value;
    const noLimpiar = ['page', 'size', 'sortBy', 'sortOrder', 'getUrlParameters'];
    for (const key in this.criteriaEventExport) {
      if (!noLimpiar.includes(key)) {
        this.criteriaEventExport[key] = this.criteriaEventExport[key];
      }
    }
    this.criteriaExport.size = total;
    this.criteriaExport.page = 0;

    this.dataSourceExport.loadData(this.criteriaExport);

    this.cargandoExcel = true;
    this.dataSourceExport.loading$.subscribe(response => {
      if (!response) {
        this.listEventos = this.dataSourceExport.eventoData;
        const contentEvent = this.dataSourceExport.eventoData.map((evento: any) => {
          return {
            id: evento.id,
            nombre: evento.nombre,
            descripcion: evento.descripcion,
            activo: evento.activo ? this.constants.si : this.constants.no
          };
        });

        this.dataEventsExport = [...this.headersEventsExport, ...contentEvent];
        eventoSubject.next(this.dataEventsExport);
        //EVENTO_ROLES
        let contentRoles = [];
        try {
          for (let erol = 0; erol < this.listEventos.length; erol++) {
            this.listEventos[erol].eventosRol.forEach(element => {
              element.evento = this.listEventos[erol].id;
            });
            let roles = this.listEventos[erol].eventosRol.map((eventorol: Eventorol) => {
              return {
                rolId: eventorol.rol.nombre,
                evento: eventorol.evento,
                fechaDesde: eventorol.fechaDesde,
                fechaHasta: eventorol.fechaHasta,
                activo: eventorol.activo ? this.constants.si : this.constants.no,
              };
            });
            contentRoles = contentRoles.concat(roles);
          }
        } catch (error) { }
        this.dataRolesExport = [...this.headersRolesExport, ...contentRoles];
        rolesSubject.next(this.dataRolesExport);
        //EVENTO_USUARIOS
        let contentUsuarios = [];
        try {
          for (let eus = 0; eus < this.listEventos.length; eus++) {
            this.listEventos[eus].eventosUsuario.forEach(element => {
              element.evento = this.listEventos[eus].id;
            });
            let usuarios = this.listEventos[eus].eventosUsuario.map((eventousuario: Eventousuario) => {
              return {
                usuario: eventousuario.usuario.usuario,
                evento: eventousuario.evento,
                fechaDesde: eventousuario.fechaDesde,
                fechaHasta: eventousuario.fechaHasta,
                activo: eventousuario.activo ? this.constants.si : this.constants.no,
              };
            });
            contentUsuarios = contentUsuarios.concat(usuarios);
          }  
        } catch (error) { }
        this.dataUsuariosExport = [...this.headersUsuariosExport, ...contentUsuarios];
        usuariosSubject.next(this.dataUsuariosExport);

      }
    });

    // tslint:disable-next-line: deprecation
    combineLatest(
      loadingEventos$,
      loadingRoles$,
      loadingUsuarios$,
      (evento, rol, usuario) => {
        const hayEvento = evento.length > 0;
        const hayRol = rol.length > 0;
        const hayUsuario = usuario.length > 0;
        if (hayEvento && hayRol && hayUsuario) {
          const compilado = { 'eventos': evento, 'roles': rol, 'usuarios': usuario };
          return compilado;
        }
      })
      .subscribe((data: any) => {
        if (typeof data !== 'undefined') {

          const hayEvento = data.eventos.length > 0;
          const hayRol = data.roles.length > 0;
          const hayUsuario = data.usuarios.length > 0;

          worksheetEventos = XLSX.utils.json_to_sheet(data.eventos, { skipHeader: true, header: this.orderEvent });
          worksheetRoles = XLSX.utils.json_to_sheet(data.roles, { skipHeader: true, header: this.orderRoles });
          worksheetUsuarios = XLSX.utils.json_to_sheet(data.usuarios, { skipHeader: true, header: this.orderUsuarios });
          let workbook;

          if (hayEvento && hayRol && hayUsuario) {
            workbook = {
              Sheets: { 'eventos': worksheetEventos, 'roles': worksheetRoles, 'usuarios': worksheetUsuarios },
              SheetNames: ['eventos', 'roles', 'usuarios']
            };
          }
          else {
            if (hayEvento && hayRol) {
              workbook = {
                Sheets: { 'eventos': worksheetEventos, 'roles': worksheetRoles },
                SheetNames: ['eventos', 'roles']
              };
            }
            else {
              if (hayEvento && hayUsuario) {
                workbook = {
                  Sheets: { 'eventos': worksheetEventos, 'usuarios': worksheetUsuarios },
                  SheetNames: ['eventos', 'usuarios']
                };
              }
              else {
                if (hayEvento) {
                  workbook = {
                    Sheets: { 'eventos': worksheetEventos },
                    SheetNames: ['eventos']
                  };
                }
              }
            }
          }

          if (hayEvento || hayRol || hayUsuario) {
            const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'eventos');
            this.cargandoExcel = false;
          }
        }
      });
  }

  /** Método encargado de almacenar el archivo Excel
   * @param buffer Objeto que recibe el archivo xlsx
   * @param fileName nombre del archivo
   */
  private saveAsExcelFile(buffer: any, fileName: string): void {

    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';

    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
