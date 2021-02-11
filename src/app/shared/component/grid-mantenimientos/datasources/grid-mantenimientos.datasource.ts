import { DataSource } from '@angular/cdk/table';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { CondicionService } from 'src/app/administracion/transicioncondiciones/services/transicioncondiciones.services';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { GridMantenimientoCriteria } from '../model/grid-mantenimiento.criteria.model';
import { SigmaSumatoriasComponent } from '../../sigma-sumatorias/sigma-sumatorias.component';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class GridMantenimientoDatasource implements DataSource<WorkflowMantenimientoModel> {

    private _mantenimientos: WorkflowMantenimientoModel[] = [];
    private _mantenimientosSubject = new BehaviorSubject<WorkflowMantenimientoModel[]>(this._mantenimientos);
    public mantenimientos$ = this._mantenimientosSubject.asObservable();

    private _totalElements = 0;
    private _totalelementsSubject = new BehaviorSubject<number>(this._totalElements);
    public totalElements$ = this._totalelementsSubject.asObservable();

    private _loading = false;
    private _loadingSubject = new BehaviorSubject<boolean>(this._loading);
    public loading$ = this._loadingSubject.asObservable();

    private _error = false;
    private _errorSubject = new BehaviorSubject<boolean>(this._error);
    public error$ = this._errorSubject.asObservable();

    private _errorMessage = '';
    private _errorMessageSubject = new BehaviorSubject<string>(this._errorMessage);
    public errorMessage$ = this._errorMessageSubject.asObservable();


    constructor(private servicio: CondicionService) { }

    /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
    connect(collectionViewer: CollectionViewer): Observable<WorkflowMantenimientoModel[]> {
        return this._mantenimientosSubject.asObservable();
    }

    /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
    disconnect(collectionViewer: CollectionViewer): void {
        this._mantenimientosSubject.complete();
        this._totalelementsSubject.complete();
        this._loadingSubject.complete();
        this._errorSubject.complete();
        this._errorMessageSubject.complete();
    }

    /**
    * Método encargado de cargar los datos según el criterio enviado como parámetro
    *
    * @param criteria Objeto de tipo Criteria con los filtros de la consulta a realizar
    */
    loadData(criteria: GridMantenimientoCriteria): void {
        this.setLoading(true);

        this.servicio.mantenimientosByCondicion(criteria).subscribe(_data => {
            let posicion = (_data.pageable.pageNumber * _data.pageable.pageSize);
            _data.content.map(async (mantenimiento) => {
                mantenimiento.posicion = ++posicion;
                return {
                    ...mantenimiento
                };
            });
            this.setMantenimientos(_data.content);
            this.setTotalElements(_data.totalElements);
            this.setError(false);
            this.setErrorMessage('');
            this.setLoading(false);

            if (criteria.sortBy === 'duracionPlaneada') {
                this._mantenimientos.sort(function (a, b) {
                    if (criteria.sortOrder === 'asc') {
                        return a.duracionPlaneada - b.duracionPlaneada;
                    } else if (criteria.sortOrder === 'desc') {
                        return b.duracionPlaneada - a.duracionPlaneada;
                    }
                });
            }
        },
            error => {
                this.setMantenimientos([]);
                this.setTotalElements(0);
                this.setError(true);
                this.setErrorMessage('No se encuentran resultados');
                this.setLoading(false);
            }
        );
    }

    public getMantenimientos(): WorkflowMantenimientoModel[] {
        return this._mantenimientos;
    }

    public setMantenimientos(_mantenimientos: WorkflowMantenimientoModel[]): void {
        this._mantenimientos = _mantenimientos;
        this._mantenimientosSubject.next(this._mantenimientos);
    }

    public getTotalElements(): number {
        return this._totalElements;
    }

    public setTotalElements(_totalElements: number): void {
        this._totalElements = _totalElements;
        this._totalelementsSubject.next(this._totalElements);
    }

    public isLoading(): boolean {
        return this._loading;
    }

    public setLoading(_loading: boolean): void {
        this._loading = _loading;
        this._loadingSubject.next(this._loading);
    }

    public isError(): boolean {
        return this._error;
    }

    public setError(_error: boolean): void {
        this._error = _error;
        this._errorSubject.next(this._error);
    }

    public getErrorMessage(): string {
        return this._errorMessage;
    }

    public setErrorMessage(_errorMessage: string): void {
        this._errorMessage = _errorMessage;
        this._errorMessageSubject.next(this._errorMessage);
    }

}
