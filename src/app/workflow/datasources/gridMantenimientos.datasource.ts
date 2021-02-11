import { DataSource } from '@angular/cdk/table';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { CondicionService } from '../../administracion/transicioncondiciones/services/transicioncondiciones.services';
import { GridMantenimientoCriteria } from 'src/app/shared/component/grid-mantenimientos/model/grid-mantenimiento.criteria.model';
import { WorkflowMantenimientoModel } from '../models/workflow-mantenimiento.model';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class GridMantenimientoDatasource implements DataSource<WorkflowMantenimientoModel> {


    public mantenimientosSubject = new BehaviorSubject<WorkflowMantenimientoModel[]>([]);
    public totalelementsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<boolean>(false);
    private errorMessageSubject = new BehaviorSubject<string>('');

    public totalElements$ = this.totalelementsSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    public error$ = this.errorSubject.asObservable();
    public errorMessage$ = this.errorMessageSubject.asObservable();
    public mantenimientosData: any;
    totalkmsItem = 0;

    constructor(private servicio: CondicionService) { }

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
  loadData(criteria: GridMantenimientoCriteria): void {

        this.loadingSubject.next(true);
        this.servicio.mantenimientosByCondicion(criteria).subscribe(data => {
            this.mantenimientosData = data.content;
            data.content.map(async (mantenimiento) => {
                if (mantenimiento.tipoMalla != null) {
                    if ((mantenimiento.tipoMalla != null && mantenimiento.tipoMalla.valor === 'AR')
                        || (mantenimiento.tipoMalla != null && mantenimiento.tipoMalla.valor === 'UR')) {
                        this.totalkmsItem = mantenimiento.area / 3500;
                    } else {
                        this.totalkmsItem = mantenimiento.area / 3000;
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
