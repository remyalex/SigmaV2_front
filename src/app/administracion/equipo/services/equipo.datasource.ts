import { DataSource } from '@angular/cdk/table';
import { Equipo } from '../models/equipo.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { EquipoService } from './equipo.service';
import { EquipoCriteria } from '../models/equipo-criteria.model';
import { CONST_ADMINISTRACION_EQUIPO } from './../equipo.constant';
import { log } from 'util';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class EquipoDatasource implements DataSource<Equipo> {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPO;
  /** Variable usada para notificación a otros componentes de cambios */
  private equipoSubject = new BehaviorSubject<Equipo[]>([]);
  /** Variable usada para notificación a otros componentes de cambios */
  public totalelementsSubject = new BehaviorSubject<number>(0);
  /** Variable usada para notificación a otros componentes de cambios */
  private loadingSubject = new BehaviorSubject<boolean>(false);
  /** Variable usada para notificación a otros componentes de cambios */
  private errorSubject = new BehaviorSubject<boolean>(false);
  /** Variable usada para notificación a otros componentes de cambios */
  private errorMessageSubject = new BehaviorSubject<string>('');

  /** Observable usado para tener la totalización de los elementos devueltos */
  public totalElements$ = this.totalelementsSubject.asObservable();
  /**
   * Observable usado para para notificar el estado
   * de la respuesta desde el servidor
   */
  public loading$ = this.loadingSubject.asObservable();
  /** Variable usada para notificación de errores */
  public error$ = this.errorSubject.asObservable();
  /** Variable usada para notificación mensaje de error */
  public errorMessage$ = this.errorMessageSubject.asObservable();
  /** Variable con url de peticion a realizar */
  public petitionList = null;
  /** Variable con datos obtenidos de la petición al servidor */
  public equipoData: any;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio del componente al cual se va a realizar la petición de información
  */
  constructor (private servicio: EquipoService) { }

  /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<Equipo[]> {
    return this.equipoSubject.asObservable();
  }

  /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.equipoSubject.complete();
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
  loadData(criteria: EquipoCriteria): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.search(criteria)
      .subscribe(
        async (data: any) => {
          this.equipoData = data;
          this.equipoSubject.next(data.content);
          this.totalelementsSubject.next(data.totalElements);
          this.errorSubject.next(false);
          this.errorMessageSubject.next('');
          this.loadingSubject.next(false);
        },
        error => {
          this.equipoSubject.next([]);
          this.totalelementsSubject.next(0);
          this.errorSubject.next(true);
          this.errorMessageSubject.next(this.constants.noResultados);
          this.loadingSubject.next(false);
        }

      );
  }

  /**
   * Método encargado de cargar los datos según el criterio enviado como parámetro
   *
   * @param criteria Objeto de tipo Criteria con los filtros de la consulta a realizar
   */
  loadDataFallasMaquinaria(criteria: EquipoCriteria): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.searchFallasMaquinaria(criteria)
      .subscribe(
        async (data: any) => {
          this.equipoData = data;
          this.equipoSubject.next(data.content);
          this.totalelementsSubject.next(data.totalElements);
          this.errorSubject.next(false);
          this.errorMessageSubject.next('');
          this.loadingSubject.next(false);
        },
        error => {
          this.equipoSubject.next([]);
          this.totalelementsSubject.next(0);
          this.errorSubject.next(true);
          this.errorMessageSubject.next(this.constants.noResultados);
          this.loadingSubject.next(false);
        }

      );
  }

}
