import { DataSource } from "@angular/cdk/table";
import { UsuarioActividades } from '../models/usuario-actividades.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { UsuarioActividadesService } from './usuario-actividades.service';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class UsuarioActividadesDatasource implements DataSource<UsuarioActividades>{

    private actividadesSubject = new BehaviorSubject<UsuarioActividades[]>([]);
    public totalelementsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<boolean>(false);
    private errorMessageSubject = new BehaviorSubject<string>("");

    public totalElements$ = this.totalelementsSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    public error$ = this.errorSubject.asObservable();
    public errorMessage$ = this.errorMessageSubject.asObservable();
    public petitionList = null;
    public actividadesData: any;

    constructor(private servicio: UsuarioActividadesService) { }

    /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<UsuarioActividades[]> {
        return this.actividadesSubject.asObservable();
    }

    /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
        this.actividadesSubject.complete();
        this.loadingSubject.complete();
        this.totalelementsSubject.complete();
        this.errorSubject.complete();
        this.errorMessageSubject.complete();
    }

    loadData(): void {
        this.loadingSubject.next(true);
        if (this.petitionList) {
            this.petitionList.unsubscribe();
        }
        this.petitionList = this.servicio.search().subscribe(async (data: any) => {
            const datosNuevos = data;
            Promise.all(datosNuevos)
                .then((completed) => {
                    data.content = completed;
                    this.actividadesData = completed;
                    this.actividadesSubject.next(data.content);
                });

            this.actividadesData = data.content;
            this.actividadesSubject.next(data.content)
            this.totalelementsSubject.next(data.totalElements);
            this.errorSubject.next(false);
            this.errorMessageSubject.next("");
            this.loadingSubject.next(false);
        },
            error => {
                this.actividadesSubject.next([]);
                this.totalelementsSubject.next(0);
                this.errorSubject.next(true);
                this.errorMessageSubject.next('No se encuentran resultados');
                this.loadingSubject.next(false);
            }
        );
    }
}