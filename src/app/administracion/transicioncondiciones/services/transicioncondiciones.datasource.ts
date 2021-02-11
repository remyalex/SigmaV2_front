import { DataSource } from "@angular/cdk/table";
import { Condiciones } from '../models/condiciones.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { CondicionService } from './transicioncondiciones.services';
import { TransicionCondicionesCriteria } from '../models/transicioncondiciones-criteria.model';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class TransicionCondicionesDatasource implements DataSource<Condiciones> {

    private transicioncondicionesSubject = new BehaviorSubject<Condiciones[]>([]);
    public totalelementsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<boolean>(false);
    private errorMessageSubject = new BehaviorSubject<string>('');

    public totalElements$ = this.totalelementsSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    public error$ = this.errorSubject.asObservable();
    public errorMessage$ = this.errorMessageSubject.asObservable();
    public transicioncondicionesData: any;
    constructor (private servicio: CondicionService){}

    /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<Condiciones[]> {
        return this.transicioncondicionesSubject.asObservable();
    }

    /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
        this.transicioncondicionesSubject.complete ();
        this.loadingSubject.complete();
        this.totalelementsSubject.complete ();
        this.errorSubject.complete ();
        this.errorMessageSubject.complete ();
    }

    loadData (criteria: TransicionCondicionesCriteria ): void {
        this.loadingSubject.next(true);
        this.servicio.search(criteria)
            .subscribe(data => {
                data.content = data.content.map((iteem2: any) => ({...iteem2, ...{estadoNombre: iteem2.activo ? 'Si' : 'No'}}));
                this.transicioncondicionesData =
                    data.content.map((iteem2: any) => ({...iteem2, ...{estadoNombre: iteem2.activo ? 'Si' : 'No'}}));
                this.transicioncondicionesSubject.next(data.content);
                this.totalelementsSubject.next(data.totalElements);
                this.errorSubject.next(false);
                this.errorMessageSubject.next('');
                this.loadingSubject.next(false);
            },
            error => {
                this.transicioncondicionesSubject.next([]);
                this.totalelementsSubject.next(0);
                this.errorSubject.next(true);
                this.errorMessageSubject.next('No se encuentran resultados');
                this.loadingSubject.next(false);
            }
        );
    }
}