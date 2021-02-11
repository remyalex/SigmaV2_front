import { DataSource } from '@angular/cdk/table';
import { Eventousuario } from '../models/eventousuario.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { EventousuarioService } from './eventousuario.service';
import { EventousuarioCriteria } from '../models/eventousuario-criteria.model';
import { CONST_ADMINISTRACION_EVENTOUSUARIO } from '../eventousuario.constant';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class EventousuarioDatasource implements DataSource<Eventousuario> {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EVENTOUSUARIO;
  private eventousuarioSubject = new BehaviorSubject<Eventousuario[]>([]);
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
  public eventousuarioData: any;

  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio del componente al cual se va a realizar la petición de información
  */
  constructor (private servicio: EventousuarioService){
  }

  /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<Eventousuario[]> {
    return this.eventousuarioSubject.asObservable();
  }

  /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.eventousuarioSubject.complete ();
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
  loadData(criteria: EventousuarioCriteria ): void {
      this.loadingSubject.next(true);
      if (this.petitionList) {
        this.petitionList.unsubscribe();
      }
      this.petitionList = this.servicio.search(criteria)
          .subscribe(async(data: any) => {
            const datosNuevos = data.content.map(async (eventousuario) => {
              const eventousuario_usuario = await this.servicio.searchByList(
              this.constants.path_administracion_eventousuario_usuarioId, eventousuario.usuarioId);
              const eventorol_valorpermitido = await this.servicio.searchByList(
                this.constants.path_administracion_eventousuario_valorPermitidoId, eventousuario.valorPermitidoId);
              return {...eventousuario,
              ...{
                usuarioValor: (typeof eventousuario_usuario !== 'undefined') ? eventousuario_usuario.usuario : this.constants.noEncontrado,
                // tslint:disable-next-line:max-line-length
                valorPermitidoValor: (typeof eventorol_valorpermitido !== 'undefined') ? eventorol_valorpermitido.valor : '',
              }};
            });
            Promise.all(datosNuevos)
            .then((completed) => {
              data.content = completed;
              this.eventousuarioData = completed;
              this.eventousuarioSubject.next(data.content);
              this.totalelementsSubject.next(data.totalElements);
              this.errorSubject.next(false);
              this.errorMessageSubject.next('');
              this.loadingSubject.next(false);
            });
          },
          error => {
            this.eventousuarioSubject.next([]);
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
  list ( nombreEvento: string): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.listbyEvent(nombreEvento)
        .subscribe(async(data: any) => {
          const datosNuevos = data.map(async (eventousuario) => {
            const eventousuario_usuario = await this.servicio.searchByList(
            this.constants.path_administracion_eventousuario_usuarioId, eventousuario.usuarioId);
            const eventorol_valorpermitido = await this.servicio.searchByList(
              this.constants.path_administracion_eventousuario_valorPermitidoId, eventousuario.valorPermitidoId);
            return {...eventousuario,
            ...{
              usuarioValor: (typeof eventousuario_usuario !== 'undefined') ? eventousuario_usuario.usuario : this.constants.noEncontrado,
              // tslint:disable-next-line:max-line-length
              valorPermitidoValor: (typeof eventorol_valorpermitido !== 'undefined') ? eventorol_valorpermitido.valor : '',
            }};
          });
          Promise.all(datosNuevos)
          .then((completed) => {
            data.content = completed;
            this.eventousuarioData = completed;
            this.eventousuarioSubject.next(data.content);
            this.totalelementsSubject.next(data.totalElements);
            this.errorSubject.next(false);
            this.errorMessageSubject.next('');
            this.loadingSubject.next(false);
          });
        },
        error => {
          this.eventousuarioSubject.next([]);
          this.totalelementsSubject.next(0);
          this.errorSubject.next(true);
          this.errorMessageSubject.next(this.constants.noResultados);
          this.loadingSubject.next(false);
        }
    );
}


}
