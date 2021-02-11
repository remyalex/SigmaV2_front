import { DataSource } from '@angular/cdk/table';
import { Eventorol } from '../models/eventorol.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { EventorolService } from './eventorol.service';
import { EventorolCriteria } from '../models/eventorol-criteria.model';
import { CONST_ADMINISTRACION_EVENTOROL } from '../eventorol.constant';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class EventorolDatasource implements DataSource<Eventorol> {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EVENTOROL;
  private eventorolSubject = new BehaviorSubject<Eventorol[]>([]);
  public  totalelementsSubject = new BehaviorSubject<number>(0);
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
  public eventorolData: any;

  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio del componente al cual se va a realizar la petición de información
  */
  constructor (private servicio: EventorolService){}

  /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<Eventorol[]> {
    return this.eventorolSubject.asObservable();
  }

  /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.eventorolSubject.complete ();
    this.loadingSubject.complete();
    this.totalelementsSubject.complete ();
    this.errorSubject.complete ();
    this.errorMessageSubject.complete ();
  }

  /**
   * Método encargado de cargar los datos según el criterio enviado como parámetro
   *
   * @param criteria Objeto de tipo Criteria con los filtros de la consulta a realizar
   */
  loadData(criteria: EventorolCriteria ): void {
      this.loadingSubject.next(true);
      if (this.petitionList) {
        this.petitionList.unsubscribe();
      }
      this.petitionList = this.servicio.search(criteria)
          .subscribe(async(data: any) => {
            const datosNuevos = data.content.map(async (eventorol) => {
              const eventorol_rol = await this.servicio.searchByList(
              this.constants.path_administracion_eventorol_rolId, eventorol.rolId);
              const eventorol_valorpermitido = await this.servicio.searchByList(
                this.constants.path_administracion_eventorol_valorPermitidoId, eventorol.valorPermitidoId);
              return {...eventorol,
              ...{
                rolValor: (typeof eventorol_rol !== 'undefined') ? eventorol_rol.nombre : this.constants.noEncontrado,
                // tslint:disable-next-line:max-line-length
                valorPermitidoValor: (typeof eventorol_valorpermitido !== 'undefined') ? eventorol_valorpermitido.valor : '',
              }};
            });
            Promise.all(datosNuevos)
            .then((completed) => {
              data.content = completed;
              this.eventorolData = completed;
              this.eventorolSubject.next(data.content);
              this.totalelementsSubject.next(data.totalElements);
              this.errorSubject.next(false);
              this.errorMessageSubject.next('');
              this.loadingSubject.next(false);
            });
          },
          error => {
            this.eventorolSubject.next([]);
            this.totalelementsSubject.next(0);
            this.errorSubject.next(true);
            this.errorMessageSubject.next(this.constants.noResultados);
            this.loadingSubject.next(false);
          }
      );
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (nombreEvento: string): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.listbyEvent(nombreEvento)
        .subscribe(async(data: any) => {
          const datosNuevos = data.map(async (eventorol) => {
            const eventorol_rol = await this.servicio.searchByList(
            this.constants.path_administracion_eventorol_rolId, eventorol.rolId);
            const eventorol_valorpermitido = await this.servicio.searchByList(
              this.constants.path_administracion_eventorol_valorPermitidoId, eventorol.valorPermitidoId);
            return {...eventorol,
            ...{
              rolValor: (typeof eventorol_rol !== 'undefined') ? eventorol_rol.nombre : this.constants.noEncontrado,
              // tslint:disable-next-line:max-line-length
              valorPermitidoValor: (typeof eventorol_valorpermitido !== 'undefined') ? eventorol_valorpermitido.valor : '',
            }};
          });
          Promise.all(datosNuevos)
          .then((completed) => {
            data.content = completed;
            this.eventorolData = completed;
            this.eventorolSubject.next(data.content);
            this.totalelementsSubject.next(data.totalElements);
            this.errorSubject.next(false);
            this.errorMessageSubject.next('');
            this.loadingSubject.next(false);
          });
        },
        error => {
          this.eventorolSubject.next([]);
          this.totalelementsSubject.next(0);
          this.errorSubject.next(true);
          this.errorMessageSubject.next(this.constants.noResultados);
          this.loadingSubject.next(false);
        }
    );
}

}
