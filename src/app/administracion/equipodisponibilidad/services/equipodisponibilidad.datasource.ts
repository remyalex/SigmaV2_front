import { DataSource } from '@angular/cdk/table';
import { Equipodisponibilidad } from '../models/equipodisponibilidad.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { EquipodisponibilidadService } from './equipodisponibilidad.service';
import { EquipoDisponibilidadCriteria } from '../models/equipodisponibilidad-criteria.model';
import { CONST_ADMINISTRACION_EQUIPODISPONIBILIDAD } from './../equipodisponibilidad.constant';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class EquipodisponibilidadDatasource implements DataSource<Equipodisponibilidad> {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPODISPONIBILIDAD;
  public equipoDisponibilidadSubject = new BehaviorSubject<Equipodisponibilidad[]>([]);
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
  public equipodisponibilidadData: any;


  /**
  * Método encargado de construir una instancia del componente
  */
  constructor(public servicio: EquipodisponibilidadService) { }

  /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<Equipodisponibilidad[]> {
    return this.equipoDisponibilidadSubject.asObservable();
  }

  /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.equipoDisponibilidadSubject.complete();
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
  loadData(criteria: EquipoDisponibilidadCriteria): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.search(criteria)
      .subscribe(async (data: any) => {
        this.equipodisponibilidadData = data.content;
        this.equipoDisponibilidadSubject.next(data.content);
        this.totalelementsSubject.next(data.totalElements);
        this.errorSubject.next(false);
        this.errorMessageSubject.next('');
        this.loadingSubject.next(false);
      },
        error => {
          this.equipoDisponibilidadSubject.next([]);
          this.totalelementsSubject.next(0);
          this.errorSubject.next(true);
          this.errorMessageSubject.next(this.constants.noResultados);
          this.loadingSubject.next(false);
        }
      );
  }


}
