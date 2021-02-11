import { DataSource } from '@angular/cdk/table';
import {  EquipoConductor } from '../models/equipoconductor.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { EquipoConductorCriteria } from '../models/equipoconductor-criteria.model';
import { CONST_ADMINISTRACION_EQUIPOCONDUCTOR } from './../equipoconductor.constant';
import { EquipoConductorService } from './equipoconductor.service';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class EquipoConductorDatasource implements DataSource<EquipoConductor> {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPOCONDUCTOR;
  public equipoConductorSubject = new BehaviorSubject<EquipoConductor[]>([]);
  public totalelementsSubject = new BehaviorSubject<number>(0);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  public errorSubject = new BehaviorSubject<boolean>(false);
  public errorMessageSubject = new BehaviorSubject<string>('');

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
  public equipoconductorData: any;


  /**
  * Método encargado de construir una instancia del componente
  */
  constructor(public servicio: EquipoConductorService) { }

  /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<EquipoConductor[]> {
    return this.equipoConductorSubject.asObservable();
  }

  /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.equipoConductorSubject.complete();
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
  loadData(criteria: EquipoConductorCriteria): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    
    this.petitionList = this.servicio.search(criteria)
      .subscribe(async (data: any) => {
        this.equipoconductorData = data.content;
        this.equipoConductorSubject.next(data.content);
        this.totalelementsSubject.next(data.totalElements);
        this.errorSubject.next(false);
        this.errorMessageSubject.next('');
        this.loadingSubject.next(false);
      },
        error => {
          this.equipoConductorSubject.next([]);
          this.totalelementsSubject.next(0);
          this.errorSubject.next(true);
          this.errorMessageSubject.next(this.constants.noResultados);
          this.loadingSubject.next(false);
        }
      );
  }


}
