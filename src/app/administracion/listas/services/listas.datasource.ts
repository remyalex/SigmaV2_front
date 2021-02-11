import { DataSource } from "@angular/cdk/table";
import { Lista } from '../models/lista.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { ListasService } from './listas.service';
import { ListaCriteria } from '../models/lista-criteria.model';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class ListaDatasource implements DataSource<Lista>{

    private listasSubject = new BehaviorSubject<Lista[]>([]);
    public totalelementsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<boolean>(false);
    private errorMessageSubject = new BehaviorSubject<string>("");

    public totalElements$ = this.totalelementsSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    public error$ = this.errorSubject.asObservable();
    public errorMessage$ = this.errorMessageSubject.asObservable();
    public listasData: any;
    constructor (private servicio: ListasService){}

    /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<Lista[]> {
        return this.listasSubject.asObservable();
    }

    /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
        this.listasSubject.complete ();
        this.loadingSubject.complete();
        this.totalelementsSubject.complete ();
        this.errorSubject.complete ();
        this.errorMessageSubject.complete ();
    }

    loadData (criteria: ListaCriteria ): void {
        this.loadingSubject.next(true);
        this.servicio.search(criteria)
            .subscribe(data => {
                data.content = data.content.map((iteem2: any) => ({...iteem2, ...{estadoNombre: iteem2.activo ? 'Si' : 'No'}}));
                this.listasData = data.content.map((iteem2: any) => ({...iteem2, ...{estadoNombre: iteem2.activo ? 'Si' : 'No'}}));
                this.listasSubject.next(data.content)
                this.totalelementsSubject.next(data.totalElements);
                this.errorSubject.next(false);
                this.errorMessageSubject.next("");
                this.loadingSubject.next(false);
            },
            error => {
                this.listasSubject.next([]);
                this.totalelementsSubject.next(0);
                this.errorSubject.next(true);
                this.errorMessageSubject.next('No se encuentran resultados');
                this.loadingSubject.next(false);
            }
        );
    }
}