import { DataSource } from '@angular/cdk/table';
import { Formato } from '../models/formato.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { FormatoService } from './formato.service';
import { FormatoCriteria } from '../models/formato-criteria.model';
import { CONST_ADMINISTRACION_FORMATO } from './../formato.constant';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class FormatoDatasource implements DataSource<Formato> {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_FORMATO;
  private formatoSubject = new BehaviorSubject<Formato[]>([]);
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
  public formatoData: any;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio del componente al cual se va a realizar la petición de información
  */
  constructor (private servicio: FormatoService) {}

  /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<Formato[]> {
    return this.formatoSubject.asObservable();
  }

  /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.formatoSubject.complete();
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
  loadData(criteria: FormatoCriteria): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.search(criteria).subscribe(
      async (data: any) => {
        const datosNuevos = data.content.map(async formato => {
          const formato_tipoDocumento = await this.servicio.searchByList(
            this.constants.path_administracion_formato_tipoDocumentoId,
            formato.tipoDocumentoId
          );
          return {
            ...formato,
            ...{
              tipoDocumentoValor:
                typeof formato_tipoDocumento != 'undefined'
                  ? formato_tipoDocumento.valor
                  : this.constants.noEncontrado
            }
          };
        });
        Promise.all(datosNuevos).then(completed => {
          data.content = completed;
          this.formatoData = completed;
          this.formatoSubject.next(data.content);

          this.totalelementsSubject.next(data.totalElements);
          this.errorSubject.next(false);
          this.errorMessageSubject.next('');
          this.loadingSubject.next(false);
        });
      },
      error => {
        this.formatoSubject.next([]);
        this.totalelementsSubject.next(0);
        this.errorSubject.next(true);
        this.errorMessageSubject.next(
          this.constants.noResultados
        );
        this.loadingSubject.next(false);
      }
    );
  }
}
