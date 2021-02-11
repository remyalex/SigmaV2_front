import {CONST_ADMINISTRACION_LOCALIDAD} from '../models/localidad.constants';
import { DataSource } from '@angular/cdk/table';
import { Localidad } from '../models/localidad.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { LocalidadService } from './localidad.service';
import { LocalidadCriteria } from '../models/localidad.criteria.model';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class LocalidadDatasource implements DataSource<Localidad> {

   /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LOCALIDAD;

    private localidadSubject = new BehaviorSubject<Localidad[]>([]);
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
  connect(collectionViewer: CollectionViewer): Observable<Localidad[]> {
        return this.localidadSubject.asObservable();
    }

    /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
        this.localidadSubject.complete();
        this.totalElementsSubject.complete();
        this.loadingSubject.complete();
        this.errorSubject.complete();
        this.errorMessageSubject.complete();
    }

    constructor(private servicio: LocalidadService) {}

   /**
   * Método encargado de cargar los datos según el criterio enviado como parámetro
   *
   * @param criteria Objeto de tipo Criteria con los filtros de la consulta a realizar
   */
  loadData(criteria: LocalidadCriteria) {
        this.loadingSubject.next(true);
        if (this.petition) {
            this.petition.unsubscribe();
        }
        this.petition = this.servicio.search(criteria).subscribe(async (data: any) => {
            this.localidadSubject.next(data.content);
            this.totalElementsSubject.next(data.totalElements);
            this.errorSubject.next(false);
            this.errorMessageSubject.next('');
            this.loadingSubject.next(false);
        }, error => {
            this.localidadSubject.next([]);
            this.totalElementsSubject.next(0);
            this.errorSubject.next(true);
            this.errorMessageSubject.next(this.constants.noResultados);
            this.loadingSubject.next(false);
        });
    }

}
