import { DataSource } from '@angular/cdk/table';
import { Equipocalendario } from '../models/equipocalendario.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { EquipocalendarioService } from './equipocalendario.service';
import { EquipocalendarioCriteria, EquipocalendarioCalendarsCriteria } from '../models/equipocalendario-criteria.model';
import { CONST_ADMINISTRACION_EQUIPOCALENDARIO } from './../equipocalendario.constant';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class EquipocalendarioDatasource implements DataSource<Equipocalendario> {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPOCALENDARIO;
  public equipocalendarioSubject = new BehaviorSubject<Equipocalendario[]>([]);
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
  public equipocalendarioData: any;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio del componente al cual se va a realizar la petición de información
  */
  constructor (private servicio: EquipocalendarioService) { }

  /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<Equipocalendario[]> {
    return this.equipocalendarioSubject.asObservable();
  }

  /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.equipocalendarioSubject.complete();
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
  loadData(criteria: EquipocalendarioCriteria, path = ''): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.search(criteria, path)
      .subscribe(async (data: any) => {
        let info = data;
        if (typeof data.content != 'undefined') {
          info = data.content;
        }
        const datosNuevos = info.map(async (equipocalendario) => {
          return {
            ...equipocalendario
          };
        });
        Promise.all(datosNuevos)
          .then((completed) => {
            data.content = completed;
            this.equipocalendarioData = completed;

            this.equipocalendarioSubject.next(data.content);
            this.totalelementsSubject.next(data.totalElements);
            this.errorSubject.next(false);
            this.errorMessageSubject.next('');
            this.loadingSubject.next(false);
          });
      },
        error => {
          this.equipocalendarioSubject.next([]);
          this.totalelementsSubject.next(0);
          this.errorSubject.next(true);
          this.errorMessageSubject.next(this.constants.noResultados);
          this.loadingSubject.next(false);
        }
      );
  }

  loadDataCalendars(criteria: EquipocalendarioCalendarsCriteria): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.searchCalendars(criteria).subscribe(async (data: any) => {
      let info = data;
      if (typeof data.content != 'undefined') {
        info = data.content;
      }
      const datosNuevos = info.map(async (equipocalendario) => {
        return {
          ...equipocalendario
        };
      });
      Promise.all(datosNuevos)
        .then((completed) => {
          data.content = completed;
          this.equipocalendarioData = completed;

          this.equipocalendarioSubject.next(data.content);
          this.totalelementsSubject.next(data.totalElements);
          this.errorSubject.next(false);
          this.errorMessageSubject.next('');
          this.loadingSubject.next(false);
        });
    }, error => {
      this.equipocalendarioSubject.next([]);
      this.totalelementsSubject.next(0);
      this.errorSubject.next(true);
      this.errorMessageSubject.next(this.constants.noResultados);
      this.loadingSubject.next(false);
    });
  }

  loadDataCalendarsVisitasAsignacion(criteria: EquipocalendarioCalendarsCriteria): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.searchCalendarsVisitaAsignacion(criteria).subscribe(async (data: any) => {
      let info = data;
      if (typeof data.content != 'undefined') {
        info = data.content;
      }
      const datosNuevos = info.map(async (equipocalendario) => {
        return {
          ...equipocalendario
        };
      });
      Promise.all(datosNuevos)
        .then((completed) => {
          data.content = completed;
          this.equipocalendarioData = completed;

          this.equipocalendarioSubject.next(data.content);
          this.totalelementsSubject.next(data.totalElements);
          this.errorSubject.next(false);
          this.errorMessageSubject.next('');
          this.loadingSubject.next(false);
        });
    }, error => {
      this.equipocalendarioSubject.next([]);
      this.totalelementsSubject.next(0);
      this.errorSubject.next(true);
      this.errorMessageSubject.next(this.constants.noResultados);
      this.loadingSubject.next(false);
    });
  }
}
