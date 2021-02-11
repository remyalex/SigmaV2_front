import { GestionSocialAdelantadaModel } from './../models/gestion-social-adelantada.model';
import { DataSource } from "@angular/cdk/table";
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA } from './../gestion-social-adelantada.constant';
import { GestionSocialAdelantadaService } from './gestion-social-adelantada.service';
import { GestionSocialAdelantadaCriteria } from '../models/gestion-social-adelantada-criteria.model';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class GestionSocialAdelantadaDatasource implements DataSource<GestionSocialAdelantadaModel>{
 /** Constantes a usar en el componente */
  constants = CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA;
  private encuestaSubject = new BehaviorSubject<GestionSocialAdelantadaModel[]>([]);
  public totalelementsSubject = new BehaviorSubject<number>(0);
  /** Variable usada para notificación a otros componentes de cambios */
  private loadingSubject = new BehaviorSubject<boolean>(false);
  /** Variable usada para notificación a otros componentes de cambios */
  private errorSubject = new BehaviorSubject<boolean>(false);
  private errorMessageSubject = new BehaviorSubject<string>("");

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
  public encuestaData: any;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio del componente al cual se va a realizar la petición de información
  */
  constructor (private servicio: GestionSocialAdelantadaService) { }

  /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<GestionSocialAdelantadaModel[]> {
    return this.encuestaSubject.asObservable();
  }

  /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.encuestaSubject.complete();
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
  loadData(criteria: GestionSocialAdelantadaCriteria): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.search(criteria)
      .subscribe(async (data: any) => {
        const datosNuevos = data.content.map(async (rol) => {
          return {
            ...rol,
            ...{
            }
          };
        });
        Promise.all(datosNuevos)
          .then((completed) => {
            data.content = completed;
            this.encuestaData = completed;
            this.encuestaSubject.next(data.content);
          });
        this.encuestaData = data.content;
        this.encuestaSubject.next(data.content);
        this.totalelementsSubject.next(data.totalElements);
        this.errorSubject.next(false);
        this.errorMessageSubject.next('');
        this.loadingSubject.next(false);
      },
        error => {
          this.encuestaSubject.next([]);
          this.totalelementsSubject.next(0);
          this.errorSubject.next(true);
          this.errorMessageSubject.next('No se ha logrado obtener datos para la consulta.');
          this.loadingSubject.next(false);
        }
      );
  }
}