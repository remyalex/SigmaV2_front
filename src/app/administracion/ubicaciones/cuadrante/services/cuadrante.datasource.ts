import {CONST_ADMINISTRACION_CUADRANTE} from '../models/cuadrante.constants';
import { DataSource } from '@angular/cdk/table';
import { Cuadrante } from '../models/cuadrante.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { CuadranteService } from './cuadrante.service';
import { CuadranteCriteria } from '../models/cuadrante.criteria.model';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class CuadranteDatasource implements DataSource<Cuadrante> {

   /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_CUADRANTE;

    private cuadranteSubject = new BehaviorSubject<Cuadrante[]>([]);
    private totalElementsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<boolean>(false);
    private errorMessageSubject = new BehaviorSubject<string>('');

    public totalElements$ = this.totalElementsSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    public error$ = this.errorSubject.asObservable();
    public errorMessage$ = this.errorMessageSubject.asObservable();
    public petition = null;

    /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<Cuadrante[]> {
        return this.cuadranteSubject.asObservable();
    }

    /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
        this.cuadranteSubject.complete();
        this.totalElementsSubject.complete();
        this.loadingSubject.complete();
        this.errorSubject.complete();
        this.errorMessageSubject.complete();
    }

    constructor(private servicio: CuadranteService) {}

   /**
   * Método encargado de cargar los datos según el criterio enviado como parámetro
   *
   * @param criteria Objeto de tipo Criteria con los filtros de la consulta a realizar
   */
  loadData(criteria: CuadranteCriteria) {
        this.loadingSubject.next(true);
        if (this.petition) {
            this.petition.unsubscribe();
        }
        this.petition = this.servicio.search(criteria).subscribe(async (data: any) => {
            this.cuadranteSubject.next(data.content);
            this.totalElementsSubject.next(data.totalElements);
            this.errorSubject.next(false);
            this.errorMessageSubject.next('');
            this.loadingSubject.next(false);
        }, error => {
            this.cuadranteSubject.next([]);
            this.totalElementsSubject.next(0);
            this.errorSubject.next(true);
            this.errorMessageSubject.next(this.constants.noResultados);
            this.loadingSubject.next(false);
        });
    }

}
