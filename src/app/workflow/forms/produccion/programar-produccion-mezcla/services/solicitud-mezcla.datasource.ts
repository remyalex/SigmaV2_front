import { DataSource } from '@angular/cdk/table';
import { SolicitudMezcla } from '../models/solicitud-mezcla.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { SolicitudMezclaService } from './solicitud-mezcla.service';
import { SolicitudMezclaCriteria } from '../models/solicitud-mezcla.criteria';
import { CONST_PRODUCCION_MEZCLA } from '../produccion-mezcla.constants';


export class SolicitudMezclaDataSource implements DataSource<SolicitudMezcla> {

    constants = CONST_PRODUCCION_MEZCLA;

    private solicitudSubject = new BehaviorSubject<SolicitudMezcla[]>([]);
    private totalElementsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<boolean>(false);
    private errorMessageSubject = new BehaviorSubject<string>('');

    public totalElements$ = this.totalElementsSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    public error$ = this.errorSubject.asObservable();
    public errorMessage$ = this.errorMessageSubject.asObservable();
    public petition = null;

     constructor(
         private servicio: SolicitudMezclaService
     ) {}


    connect(collectionViewer: CollectionViewer): Observable<SolicitudMezcla[]> {
        return this.solicitudSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.solicitudSubject.complete();
        this.totalElementsSubject.complete();
        this.loadingSubject.complete();
        this.errorSubject.complete();
        this.errorMessageSubject.complete();
    }

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
        }, error => {
            this.solicitudSubject.next([]);
            this.totalElementsSubject.next(0);
            this.errorSubject.next(true);
            this.errorMessageSubject.next(this.constants.noResultados);
            this.loadingSubject.next(false);
        });
    }

}
