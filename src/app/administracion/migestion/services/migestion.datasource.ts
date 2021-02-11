import { DataSource } from '@angular/cdk/table';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { CONST_ADMINISTRACION_MIGESTION } from '../migestion.constant';
import { MiGestionService } from './migestion.service';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { MiGestionCriteria } from '../models/migestion-criteria.model';
import { MiGestionWidgetCriteria } from '../models/migestion-widget-criteria.model';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class MiGestionDatasource implements DataSource<WorkflowMantenimientoModel> {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_MIGESTION;
  public miGestionSubject = new BehaviorSubject<WorkflowMantenimientoModel[]>([]);
  public totalelementsSubject = new BehaviorSubject<number>(0);
  /** Variable usada para notificación a otros componentes de cambios */
  private loadingSubject = new BehaviorSubject<boolean>(false);
  /** Variable usada para notificación a otros componentes de cambios */
  private errorSubject = new BehaviorSubject<boolean>(false);
  /** Variable usada para notificación a otros componentes de cambios */
  private errorMessageSubject = new BehaviorSubject<string>('');

  /** Variable usada para notificación a otros componentes de cambios */
  public totalElements$ = this.totalelementsSubject.asObservable();
  /** Variable usada para notificación a otros componentes de cambios */
  public loading$ = this.loadingSubject.asObservable();
  /** Variable usada para notificación a otros componentes de cambios */
  public error$ = this.errorSubject.asObservable();
  /** Variable usada para notificación a otros componentes de cambios */
  public errorMessage$ = this.errorMessageSubject.asObservable();
  /** Variable con url de peticion a realizar */
  public petitionList = null;
  /** Variable con datos obtenidos de la petición al servidor */
  public miGestionData: any;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio del componente al cual se va a realizar la petición de información
  */
  constructor (private servicio: MiGestionService) { }

  /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<WorkflowMantenimientoModel[]> {
    return this.miGestionSubject.asObservable();
  }

  /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.miGestionSubject.complete();
    this.loadingSubject.complete();
    this.totalelementsSubject.complete();
    this.errorSubject.complete();
    this.errorMessageSubject.complete();
  }

 /**
   * Método encargado de cargar los datos según el criterio enviado como parámetro
   *
   * @param criteria Objeto de tipo Criteria con los filtros de la consulta a realizar
   */
  loadData(criteria: MiGestionCriteria): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.search(criteria)
      .subscribe(async (data: any) => {
        const datosNuevos = data.content.map(async (miGestion) => {

          const miGestion_permiso = await this.servicio.searchByList(
            this.constants.path_administracion_migestion_permisoId, miGestion.permisoId);
          return {
            ...miGestion,
            ...{

              permisoValor: (typeof miGestion_permiso != 'undefined') ? miGestion_permiso.nombre : this.constants.noEncontrado,
            }
          };
        });
        Promise.all(datosNuevos)
          .then((completed) => {
            data.content = completed;
            this.miGestionData = completed;
            this.miGestionSubject.next(data.content);
            this.totalelementsSubject.next(data.totalElements);
            this.errorSubject.next(false);
            this.errorMessageSubject.next('');
            this.loadingSubject.next(false);
          });        
      },
        () => {
          this.miGestionSubject.next([]);
          this.totalelementsSubject.next(0);
          this.errorSubject.next(true);
          this.errorMessageSubject.next('No se encontraron resultados.');
          this.loadingSubject.next(false);
        }
      );
  }


  loadDataToWidget(criteria: MiGestionWidgetCriteria): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.searchFirstThreeRecords(criteria)
      .subscribe(async (data: any) => {
        const datosNuevos = data.content.map(async (miGestion) => {

          const miGestion_permiso = await this.servicio.searchByList(
            this.constants.path_administracion_migestion_permisoId, miGestion.permisoId);
          return {
            ...miGestion,
            ...{

              permisoValor: (typeof miGestion_permiso != 'undefined') ? miGestion_permiso.nombre : this.constants.noEncontrado,
            }
          };
        });
        Promise.all(datosNuevos)
          .then((completed) => {
            data.content = completed;
            this.miGestionData = completed;
            this.miGestionSubject.next(data.content);
            this.totalelementsSubject.next(data.totalElements);
            this.errorSubject.next(false);
            this.errorMessageSubject.next('');
            this.loadingSubject.next(false);
          });        
      },
        () => {
          this.miGestionSubject.next([]);
          this.totalelementsSubject.next(0);
          this.errorSubject.next(true);
          this.errorMessageSubject.next('No se encontraron resultados.');
          this.loadingSubject.next(false);
        }
      );
  }


}
