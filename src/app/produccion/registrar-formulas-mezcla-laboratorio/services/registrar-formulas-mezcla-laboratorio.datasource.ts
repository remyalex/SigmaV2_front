import { DataSource } from '@angular/cdk/table';
import { Formula } from '../models/formula.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { FormulaMezclaLaboratorioService } from './registrar-formulas-mezcla-laboratorio.service';
import { FormulaCriteria } from '../models/formula-criteria.model';
import { CONST_PRODUCCION_REGISTRAR_FORMULAS_MEZCLAS } from '../registrar-formulas-mezcla-laboratorio.constant';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class FormulaMezclaDatasource implements DataSource<Formula> {
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_REGISTRAR_FORMULAS_MEZCLAS;
  private formulaSubject = new BehaviorSubject<Formula[]>([]);
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
  public formulaData: any;

  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio del componente al cual se va a realizar la petición de información
  */
  constructor (private servicio: FormulaMezclaLaboratorioService) {}

  /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<Formula[]> {
    return this.formulaSubject.asObservable();
  }

  /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.formulaSubject.complete ();
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
  loadData(criteria: FormulaCriteria ): void {
      this.loadingSubject.next(true);
      if (this.petitionList) {
        this.petitionList.unsubscribe();
      }
      this.petitionList = this.servicio.search(criteria)
          .subscribe(
            async (data: any) => {
              const datosNuevos = data.content.map(async (formula: any) => {
                return {
                  ...formula
                };
              });
              Promise.all(datosNuevos).then(completed => {
                data.content = completed;
                this.formulaData = completed;
                this.formulaSubject.next(data.content);
                this.totalelementsSubject.next(data.totalElements);
                this.errorSubject.next(false);
                this.errorMessageSubject.next('');
                this.loadingSubject.next(false);
              });
            },
          error => {
            this.formulaSubject.next([]);
            this.totalelementsSubject.next(0);
            this.errorSubject.next(true);
            this.errorMessageSubject.next(this.constants.noResultados);
            this.loadingSubject.next(false);
          }
      );
  }


}
