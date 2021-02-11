import { DataSource } from '@angular/cdk/table';
import { SolicitudMezcla } from '../models/solicitud-mezcla.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { SolicitudMezclaService } from './solicitud-mezcla.service';
import { SolicitudMezclaCriteria } from '../models/solicitud-mezcla.criteria';
import { CONST_PRODUCCION_MEZCLA } from '../produccion-mezcla.constants';


export class SolicitudMezclaDataSource implements DataSource<SolicitudMezcla> {

   /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_MEZCLA;

    public solicitudSubject = new BehaviorSubject<SolicitudMezcla[]>([]);
    private totalElementsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<boolean>(false);
    private errorMessageSubject = new BehaviorSubject<string>('');
    solicitudes: SolicitudMezcla[] = [];

    public totalElements$ = this.totalElementsSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    public error$ = this.errorSubject.asObservable();
    public errorMessage$ = this.errorMessageSubject.asObservable();
    public petition = null;

     constructor(
         private servicio: SolicitudMezclaService
     ) {}


    /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<SolicitudMezcla[]> {
        return this.solicitudSubject.asObservable();
    }

    /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
        this.solicitudSubject.complete();
        this.totalElementsSubject.complete();
        this.loadingSubject.complete();
        this.errorSubject.complete();
        this.errorMessageSubject.complete();
    }

   /**
   * Método encargado de cargar los datos según el criterio enviado como parámetro
   *
   * @param criteria Objeto de tipo Criteria con los filtros de la consulta a realizar
   */
  loadData(criteria: SolicitudMezclaCriteria) {
        this.loadingSubject.next(true);
        if (this.petition) {
            this.petition.unsubscribe();
        }
        this.petition = this.servicio.search(criteria).subscribe(async (data: any) => {
            this.solicitudSubject.next(data.content);
            this.totalElementsSubject.next(data.totalElements);
            this.errorSubject.next(false);
            this.errorMessageSubject.next('');
            this.loadingSubject.next(false);
            this.solicitudes = data.content;
        }, error => {
            this.solicitudSubject.next([]);
            this.totalElementsSubject.next(0);
            this.errorSubject.next(true);
            this.errorMessageSubject.next(this.constants.noResultados);
            this.loadingSubject.next(false);
            this.solicitudes = [];
        });
    }

}
