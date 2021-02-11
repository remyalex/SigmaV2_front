import { DataSource } from '@angular/cdk/table';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { MantenimientoService } from '../services/mantenimiento.service';
import { MantenimientoCriteria } from '../criterials/mantenimiento-criteria.model';
import { WorkflowMantenimientoModel } from '../models/workflow-mantenimiento.model';

export class MantenimientoDatasource implements DataSource<WorkflowMantenimientoModel> {

    public mantenimientosSubject = new BehaviorSubject<WorkflowMantenimientoModel[]>([]);
    public totalelementsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<boolean>(false);
    private errorMessageSubject = new BehaviorSubject<string>('');

    public totalElements$ = this.totalelementsSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    public error$ = this.errorSubject.asObservable();
    public errorMessage$ = this.errorMessageSubject.asObservable();
    public matenimientosDataContent$ = this.mantenimientosSubject.asObservable();
    public mantenimientosData: any;
    totalkmsItem = 0;
    public petitionList = null;

    constructor(private servicio: MantenimientoService) { }

    /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<WorkflowMantenimientoModel[]> {
        return this.mantenimientosSubject.asObservable();
    }

    /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
        this.mantenimientosSubject.complete();
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
  loadData(criteria: MantenimientoCriteria): void {
        this.loadingSubject.next(true);
        if (this.petitionList) {
            this.petitionList.unsubscribe();
        }

        this.petitionList = this.servicio.search(criteria)
            .subscribe(data => {
                this.mantenimientosData = data.content;
                data.content.map(async (mantenimiento) => {

                    if (mantenimiento.tipoMalla === undefined) {
                        mantenimiento.tipoMalla = null;
                    }

                    if (mantenimiento.tipoMalla !== null) {
                        if ((mantenimiento.tipoMalla.valor === 'AR') || (mantenimiento.tipoMalla.valor === 'RU')) {
                            this.totalkmsItem = (mantenimiento.area / 3500);
                        } else {
                            this.totalkmsItem = + (mantenimiento.area / 3000);
                        }
                    }

                    mantenimiento.kmCarrilImpacto = this.totalkmsItem;
                    return {
                        ...mantenimiento,
                        ...{ kmCarrilItem: this.totalkmsItem }
                    };
                });

                this.mantenimientosSubject.next(data.content);
                this.totalelementsSubject.next(data.totalElements);
                this.errorSubject.next(false);
                this.errorMessageSubject.next('');
                this.loadingSubject.next(false);
            },
                error => {
                    this.mantenimientosSubject.next([]);
                    this.totalelementsSubject.next(0);
                    this.errorSubject.next(true);
                    this.errorMessageSubject.next('No se encuentran resultados');
                    this.loadingSubject.next(false);
                }
            );
    }

    loadDataProgram(criteria: MantenimientoCriteria): void {
        this.loadingSubject.next(true);
        if (this.petitionList) {
            this.petitionList.unsubscribe();
        }

        this.petitionList = this.servicio.searchProgram(criteria)
            .subscribe(data => {
                this.mantenimientosData = data.content;
                data.content.map(async (mantenimiento) => {

                    if (mantenimiento.tipoMalla === undefined) {
                        mantenimiento.tipoMalla = null;
                    }

                    if (mantenimiento.tipoMalla !== null) {
                        if ((mantenimiento.tipoMalla.valor === 'AR') || (mantenimiento.tipoMalla.valor === 'RU')) {
                            this.totalkmsItem = (mantenimiento.area / 3500);
                        } else {
                            this.totalkmsItem = + (mantenimiento.area / 3000);
                        }
                    }

                    mantenimiento.kmCarrilImpacto = this.totalkmsItem;
                    return {
                        ...mantenimiento,
                        ...{ kmCarrilItem: this.totalkmsItem }
                    };
                });

                this.mantenimientosSubject.next(data.content);
                this.totalelementsSubject.next(data.totalElements);
                this.errorSubject.next(false);
                this.errorMessageSubject.next('');
                this.loadingSubject.next(false);
            },
                error => {
                    this.mantenimientosSubject.next([]);
                    this.totalelementsSubject.next(0);
                    this.errorSubject.next(true);
                    this.errorMessageSubject.next('No se encuentran resultados');
                    this.loadingSubject.next(false);
                }
            );
    }
}