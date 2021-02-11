import { DataSource } from "@angular/cdk/table";
import { Rol } from '../models/rol.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { RolService } from './rol.service';
import { RolCriteria } from '../models/rol-criteria.model';
import { CONST_ADMINISTRACION_ROL } from './../rol.constant';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class RolDatasource implements DataSource<Rol>{
   /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_ROL; 
    private rolSubject = new BehaviorSubject<Rol[]>([]);
    public totalelementsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<boolean>(false);
    private errorMessageSubject = new BehaviorSubject<string>("");

    public totalElements$ = this.totalelementsSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    public error$ = this.errorSubject.asObservable();
    public errorMessage$ = this.errorMessageSubject.asObservable();
    public petitionList = null;
    public rolData: any;

    constructor (private servicio: RolService){}

    /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<Rol[]> {
        return this.rolSubject.asObservable();
    }

    /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
        this.rolSubject.complete ();
        this.loadingSubject.complete();
        this.totalelementsSubject.complete ();
        this.errorSubject.complete ();
        this.errorMessageSubject.complete ();
    }

    loadData (criteria: RolCriteria ): void {
        this.loadingSubject.next(true);
        if (this.petitionList) {
          this.petitionList.unsubscribe();
        }
        this.petitionList = this.servicio.search(criteria)
        .subscribe(async(data: any) => {
            const datosNuevos = data.content.map(async (rol) => {
                return {...rol,
                ...{
                }};
            });
            Promise.all(datosNuevos)
            .then((completed) => {
              data.content = completed;
              this.rolData = completed;
              this.rolSubject.next(data.content);
            });
              this.rolData = data.content;
              this.rolSubject.next(data.content);
              this.totalelementsSubject.next(data.totalElements);
              this.errorSubject.next(false);
              this.errorMessageSubject.next('');
              this.loadingSubject.next(false);            
          },
          error => {
            this.rolSubject.next([]);
            this.totalelementsSubject.next(0);
            this.errorSubject.next(true);
            this.errorMessageSubject.next('No se ha logrado obtener datos para la consulta.');
            this.loadingSubject.next(false);
          }
      );
    }
}
