import { CONST_PRODUCCION_REGISTRO_INSUMO_EXISTENCIA } from './../insumoExistencia.constant';
import { DataSource } from '@angular/cdk/table';
import { InsumoExistencia } from '../models/insumo-existencia.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { InsumoExistenciaService } from './insumo-existencia.service';
import { InsumoExistenciaCriteria } from '../models/insumo-existencia-criteria.model';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class InsumoExistenciaDatasource implements DataSource<InsumoExistencia> {
  /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_REGISTRO_INSUMO_EXISTENCIA;
  private registroValePlantaSubject = new BehaviorSubject<InsumoExistencia[]>([]);
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
  public registroData: any;
  public totalEntrada: any;
  public totalSalida: any;
  public inventarioFinal: any;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio del componente al cual se va a realizar la petición de información
  */
  constructor(private servicio: InsumoExistenciaService) { }

  /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<InsumoExistencia[]> {
    return this.registroValePlantaSubject.asObservable();
  }

  /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.registroValePlantaSubject.complete();
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
  loadData(criteria: InsumoExistenciaCriteria): void {
    this.loadingSubject.next(true);
    this.servicio.search(criteria)
      .subscribe(data => {
        this.registroData =
          data.content.map((iteem2: any) => ({ ...iteem2, ...{ estadoNombre: iteem2.activo ? 'Si' : 'No' } }));
        this.registroValePlantaSubject.next(data.content);
        this.totalelementsSubject.next(data.totalElements);
        this.errorSubject.next(false);
        this.errorMessageSubject.next("");
        this.loadingSubject.next(false);
        this.calcSumatorias(this.registroData);
      },
        error => {
          this.registroValePlantaSubject.next([]);
          this.totalelementsSubject.next(0);
          this.errorSubject.next(true);
          this.errorMessageSubject.next('No se encuentran resultados');
          this.loadingSubject.next(false);
        }
      );
  }

  calcSumatorias(registroData: any) {
    this.totalEntrada = 0;
    this.totalSalida = 0;
    this.inventarioFinal = 0;
    // tslint:disable-next-line: forin
    for (const row of registroData) {
      this.totalEntrada += row.cantidadEntrada;
      this.totalSalida += row.cantidadSalida;
      this.inventarioFinal += row.inventarioFinal;
    }
  }
}
