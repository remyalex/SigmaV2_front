import { DataSource } from '@angular/cdk/table';

import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { CONST_ADMINISTRACION_RECURSO } from '../recurso.constant';
import { Recurso } from '../models/recurso.model';
import { RecursoCriteria } from '../models/recurso-criteria.model';
import { RecursoService } from './recurso.service';


export class RecursoDatasource implements DataSource<Recurso> {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_RECURSO;
  private recursoSubject = new BehaviorSubject<Recurso[]>([]);
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
  public recursoData: any;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio del componente al cual se va a realizar la petición de información
  */
  constructor (private servicio: RecursoService) { }

  /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<Recurso[]> {
    return this.recursoSubject.asObservable();
  }

  /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.recursoSubject.complete();
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
  loadData(criteria: RecursoCriteria): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.search(criteria)
      .subscribe(async (data: any) => {
        const datosNuevos = data.content.map(async (recurso) => {

          // const recurso_equipo = await this.servicio.searchByList(
          // this.constants.path_administracion_recurso_equipoId, recurso.equipoId);
          // const recurso_tipoAsignacion = await this.servicio.searchByList(
          // this.constants.path_administracion_recurso_tipoAsignacionId, recurso.tipoAsignacionId);
          // const recurso_tipoDisponibilidad = await this.servicio.searchByList(
          // this.constants.path_administracion_recurso_tipoDisponibilidadId, recurso.tipoDisponibilidadId);
          // const recurso_turno = await this.servicio.searchByList(
          // this.constants.path_administracion_recurso_turnoId, recurso.turnoId);
          // return {...recurso,
          // ...{

          //   equipoValor: (typeof recurso_equipo != 'undefined') ? recurso_equipo.valor : this.constants.noEncontrado,
          //   tipoAsignacionValor: (typeof recurso_tipoAsignacion != 'undefined') ? recurso_tipoAsignacion.valor : this.constants.noEncontrado,
          //   tipoDisponibilidadValor: (typeof recurso_tipoDisponibilidad != 'undefined') ? recurso_tipoDisponibilidad.valor : this.constants.noEncontrado,
          //   turnoValor: (typeof recurso_turno != 'undefined') ? recurso_turno.valor : this.constants.noEncontrado,
          //   }};
        });
        Promise.all(datosNuevos)
          .then((completed) => {
            data.content = completed;
            this.recursoData = completed;

            this.recursoSubject.next(data.content);
            this.totalelementsSubject.next(data.totalElements);
            this.errorSubject.next(false);
            this.errorMessageSubject.next('');
            this.loadingSubject.next(false);
          });
      },
        error => {
          this.recursoSubject.next([]);
          this.totalelementsSubject.next(0);
          this.errorSubject.next(true);
          this.errorMessageSubject.next(this.constants.noResultados);
          this.loadingSubject.next(false);
        }
      );
  }


}


