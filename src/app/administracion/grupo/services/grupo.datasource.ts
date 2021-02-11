import { DataSource } from "@angular/cdk/table";
import { GrupoModel } from '../models/grupo.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { GrupoCriteria } from '../models/grupo-criteria.model';
import { GrupoService } from './grupo.service';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class GrupoDatasource implements DataSource<GrupoModel>{

    public gruposSubject = new BehaviorSubject<GrupoModel[]>([]);
    public totalelementsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<boolean>(false);
    private errorMessageSubject = new BehaviorSubject<string>("");

    public totalElements$ = this.totalelementsSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    public error$ = this.errorSubject.asObservable();
    public errorMessage$ = this.errorMessageSubject.asObservable();
    public gruposData: any;
    constructor (private servicio: GrupoService){}

    /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<GrupoModel[]> {
        return this.gruposSubject.asObservable();
    }

    /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
        this.gruposSubject.complete ();
        this.loadingSubject.complete();
        this.totalelementsSubject.complete ();
        this.errorSubject.complete ();
        this.errorMessageSubject.complete ();
    }

    loadData (criteria: GrupoCriteria ): void {
        this.loadingSubject.next(true);
        this.servicio.search(criteria)
            .subscribe(data => {
                data.content = data.content.map((iteem2: any) => ({
                    ...iteem2,
                    ...{estadoNombre: iteem2.activo ? 'Si' : 'No'},
                    ...{calzadas: iteem2.mantenimientos.length },
                    ...{kilometroCarril: iteem2.mantenimientos.reduce((sum, current) => sum + current.kmCarrilImpacto, 0)},
                }));
                this.gruposData = data.content;
                this.gruposSubject.next(data.content);
                this.totalelementsSubject.next(data.totalElements);
                this.errorSubject.next(false);
                this.errorMessageSubject.next('');
                this.loadingSubject.next(false);
            },
            error => {
                this.gruposSubject.next([]);
                this.totalelementsSubject.next(0);
                this.errorSubject.next(true);
                this.errorMessageSubject.next('No se encuentran resultados');
                this.loadingSubject.next(false);
            }
        );
    }
}