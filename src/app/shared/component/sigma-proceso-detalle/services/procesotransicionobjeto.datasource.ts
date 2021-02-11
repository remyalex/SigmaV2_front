import { DataSource } from '@angular/cdk/table';
import { Procesotransicionobjeto } from '../models/procesotransicionobjeto.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { ProcesotransicionobjetoService } from './procesotransicionobjeto.service';
import { ProcesotransicionobjetoCriteria } from '../models/procesotransicionobjeto-criteria.model';
import { CONST_ADMINISTRACION_PROCESOTRANSICIONOBJETO } from './../sigma-proceso-detalle.constant';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class ProcesotransicionobjetoDatasource implements DataSource<Procesotransicionobjeto> {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PROCESOTRANSICIONOBJETO;
  private procesotransicionobjetoSubject = new BehaviorSubject<Procesotransicionobjeto[]>([]);
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
  public procesotransicionobjetoData: any;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio del componente al cual se va a realizar la petición de información
  */
  constructor (private servicio: ProcesotransicionobjetoService) { }

  /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<Procesotransicionobjeto[]> {
    return this.procesotransicionobjetoSubject.asObservable();
  }

  /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.procesotransicionobjetoSubject.complete();
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
  loadData(procesoNombre, objetoId): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.getDataView(procesoNombre, objetoId)
      .subscribe(async (data: any) => {
        const datosNuevos = data.map(async (procesotransicionobjeto) => {
          return {
            ...procesotransicionobjeto,
            ...{
              asignadoValor: procesotransicionobjeto.nomAsignado !== '' ? `${procesotransicionobjeto.nomAsignado}`
                : this.constants.noEncontrado,
              usuarioValor: procesotransicionobjeto.nomUsuario !== ''  ? `${procesotransicionobjeto.nomUsuario}`
                : this.constants.noEncontrado,
              actividadFinal : procesotransicionobjeto.descripcionActividad !== '' ? procesotransicionobjeto.descripcionActividad 
                : this.constants.noEncontrado,
            }
          };
        });
        Promise.all(datosNuevos)
          .then((completed) => {
            data = completed;
            this.procesotransicionobjetoData = completed;
            this.procesotransicionobjetoSubject.next(data);
            this.totalelementsSubject.next(data.length);
            this.errorSubject.next(false);
            this.errorMessageSubject.next('');
            this.loadingSubject.next(false);
          });
      },
        error => {
          this.procesotransicionobjetoSubject.next([]);
          this.totalelementsSubject.next(0);
          this.errorSubject.next(true);
          this.errorMessageSubject.next(this.constants.noResultados);
          this.loadingSubject.next(false);
        }
      );
  }
}
