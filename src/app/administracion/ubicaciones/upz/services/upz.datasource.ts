import {CONST_ADMINISTRACION_UPZ} from '../models/upz.constants';
import { DataSource } from '@angular/cdk/table';
import { Upz } from '../models/upz.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { UpzService } from './upz.service';
import { UpzCriteria } from '../models/Upz.criteria.model';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class UpzDatasource implements DataSource<Upz> {

   /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_UPZ;

    private upzSubject = new BehaviorSubject<Upz[]>([]);
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
  connect(collectionViewer: CollectionViewer): Observable<Upz[]> {
        return this.upzSubject.asObservable();
    }

    /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
        this.upzSubject.complete();
        this.totalElementsSubject.complete();
        this.loadingSubject.complete();
        this.errorSubject.complete();
        this.errorMessageSubject.complete();
    }

    constructor(private servicio: UpzService) {}

   /**
   * Método encargado de cargar los datos según el criterio enviado como parámetro
   *
   * @param criteria Objeto de tipo Criteria con los filtros de la consulta a realizar
   */
  loadData(criteria: UpzCriteria) {
        this.loadingSubject.next(true);
        if (this.petition) {
            this.petition.unsubscribe();
        }
        this.petition = this.servicio.search(criteria).subscribe(async (data: any) => {
            this.upzSubject.next(data.content);
            this.totalElementsSubject.next(data.totalElements);
            this.errorSubject.next(false);
            this.errorMessageSubject.next('');
            this.loadingSubject.next(false);
        }, error => {
            this.upzSubject.next([]);
            this.totalElementsSubject.next(0);
            this.errorSubject.next(true);
            this.errorMessageSubject.next(this.constants.noResultados);
            this.loadingSubject.next(false);
        });
    }

}
