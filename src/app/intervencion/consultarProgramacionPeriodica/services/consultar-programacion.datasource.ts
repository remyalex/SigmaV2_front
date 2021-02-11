import { DataSource } from '@angular/cdk/table';
import { ConsultarProgramacionModel } from '../models/consultarProgramacion.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConsultarProgramacionService } from './consultar-programacion.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { ConsultarProgramacionCriteria } from '../models/consultarProgramacion.criteria.model';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class ConsultarProgramacionDatasource implements DataSource<ConsultarProgramacionModel> {

    public consultarPPSubject = new BehaviorSubject<ConsultarProgramacionModel[]>([]);
    public mantenimientosSubject = new BehaviorSubject<WorkflowMantenimientoModel[]>([]);
    public totalelementsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<boolean>(false);
    private errorMessageSubject = new BehaviorSubject<string>('');

    public totalElements$ = this.totalelementsSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    public error$ = this.errorSubject.asObservable();
    public errorMessage$ = this.errorMessageSubject.asObservable();
    public consultarPPData: any;

    constructor(private servicio: ConsultarProgramacionService) { }

    /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<ConsultarProgramacionModel[]> {
        return this.consultarPPSubject.asObservable();
    }

    /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
        this.consultarPPSubject.complete();
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
  loadData(criteria: ConsultarProgramacionCriteria): void {
        this.loadingSubject.next(true);
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

    }

    handlerSuccessfulResponse(data: any) {
        this.consultarPPData = data.content;
        this.consultarPPSubject.next(data.content);
        this.totalelementsSubject.next(data.totalElements);
        this.errorSubject.next(false);
        this.errorMessageSubject.next('');
        this.loadingSubject.next(false);
    }

    handlerFailedResponse() {
        this.consultarPPData = [];
        this.consultarPPSubject.next([]);
        this.totalelementsSubject.next(0);
        this.errorSubject.next(true);
        this.errorMessageSubject.next('No se encuentran resultados');
        this.loadingSubject.next(false);
    }
}