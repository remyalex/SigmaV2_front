import { Observable, BehaviorSubject } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { HistorialMantenimientoService } from './historial-mantenimiento.service';
import { HistorialMantenimientoCriteria } from '../models/historialMantenimiento.criteria.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { MantenimientoDocumentoModel } from 'src/app/workflow/models/mantenimientoDocumento.model';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class MantenimientoDocumentoDatasource implements DataSource<MantenimientoDocumentoModel> {

    public MantenimientoDocumentoSubject = new BehaviorSubject<MantenimientoDocumentoModel[]>([]);
    public mantenimientosSubject = new BehaviorSubject<WorkflowMantenimientoModel[]>([]);
    public totalelementsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<boolean>(false);
    private errorMessageSubject = new BehaviorSubject<string>('');

    public totalElements$ = this.totalelementsSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    public error$ = this.errorSubject.asObservable();
    public errorMessage$ = this.errorMessageSubject.asObservable();
    public diagnosticosmantenimientoDocumentoData: any;
    public totalkmsItem = 0;
    public mantenimientoDocumentoData: any;

    constructor(private servicio: HistorialMantenimientoService) { }

    /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<MantenimientoDocumentoModel[]> {
        return this.MantenimientoDocumentoSubject.asObservable();
    }

    /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
        this.MantenimientoDocumentoSubject.complete();
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
  loadData(criteria: HistorialMantenimientoCriteria, busquedaAvanzada: boolean): void {
        this.loadingSubject.next(true);
        if (!busquedaAvanzada) {
            this.servicio.search(criteria).subscribe(data => { // consulta por filtros
                data.content.map(async (mantenimiento) => {
                    return {
                        ...mantenimiento,
                    };
                });
                this.handlerSuccessfulResponse(data);
            }, error => {
                this.handlerFailedResponse();
            });
        } else { //Consulta por query
            this.servicio.searchByQuery(criteria).subscribe(data => {
                this.handlerSuccessfulResponse(data);
            }, error => {
                this.handlerFailedResponse();
            });
        }
    }

    handlerSuccessfulResponse(data: any) {
        this.mantenimientoDocumentoData = data.content;
        this.MantenimientoDocumentoSubject.next(data.content);
        this.totalelementsSubject.next(data.totalElements);
        this.errorSubject.next(false);
        this.errorMessageSubject.next('');
        this.loadingSubject.next(false);
    }

    handlerFailedResponse() {
        this.mantenimientoDocumentoData = [];
        this.MantenimientoDocumentoSubject.next([]);
        this.totalelementsSubject.next(0);
        this.errorSubject.next(true);
        this.errorMessageSubject.next('No se encuentran resultados');
        this.loadingSubject.next(false);
    }
}
