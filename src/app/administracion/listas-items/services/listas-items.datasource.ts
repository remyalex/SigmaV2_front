import { ListasService } from '../../listas/services/listas.service';
import { DataSource } from "@angular/cdk/table";
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { ListaItem } from '../models/listas-items.model';
import { ListaItemsService } from './listas-items.service';
import { ListaItemCriteria } from '../models/listas-items-criteria.model';
import { combineLatest } from 'rxjs';



export class ListasItemsDatasource implements DataSource<ListaItem>{
    
    private listasSubject = new BehaviorSubject<ListaItem[]>([]);
    private totalelementsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<boolean>(false);
    private errorMessageSubject = new BehaviorSubject<string>("");

    public totalElements$ = this.totalelementsSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    public error$ = this.errorSubject.asObservable();
    public errorMessage$ = this.errorMessageSubject.asObservable();

    constructor (private servicio: ListaItemsService, private servicioLista: ListasService){}

    listas: any;
    lista_padre: any;
    /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<ListaItem[]> {
        this.cargarListas();
        return this.listasSubject.asObservable();
    }

    cargarListas(): void {
        this.servicioLista.list()
        .subscribe((data: any) => {
            this.listas = data;
        });
    }

    /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
        this.listasSubject.complete ();
        this.loadingSubject.complete();
        this.totalelementsSubject.complete ();
        this.errorSubject.complete ();
        this.errorMessageSubject.complete ();
    }

    loadData (criteria: ListaItemCriteria ): void {
        this.loadingSubject.next(true);
        combineLatest(
            this.servicio.search(criteria),
            this.servicioLista.list(),
            (one: any, two: any) => {
                one.content = one.content.map((data)=> {
                let itemPadre = two.filter((listaItem)=>(listaItem.id == data.listaId))[0];
                data = {...data, ...{padre: itemPadre.nombre}, ... {estadoNombre: data.activo? 'Si': 'No' }};
            return data;
            });
            return one;
            })
            .subscribe(data => {
                this.lista_padre = data.content;
                this.listasSubject.next(data.content);
                this.totalelementsSubject.next(data.totalElements);
                this.errorSubject.next(false);
                this.errorMessageSubject.next("");
                this.loadingSubject.next(false);
            },
            error => {
                this.listasSubject.next([]);
                this.totalelementsSubject.next(0);
                this.errorSubject.next(true);
                this.errorMessageSubject.next("No se ha logrado obtener datos para la consulta.");
                this.loadingSubject.next(false);
            }
        );
    }

    // loadData (criteria: ListaItemCriteria ): void {
    //     this.loadingSubject.next(true);
    //     this.servicio.search(criteria)
    //         .subscribe(data => {                
    //             this.listasSubject.next(data.content)
    //             this.totalelementsSubject.next(data.totalElements);
    //             this.errorSubject.next(false);
    //             this.errorMessageSubject.next("");
    //             this.loadingSubject.next(false);
    //         },
    //         error => {
    //             this.listasSubject.next([]);
    //             this.totalelementsSubject.next(0);
    //             this.errorSubject.next(true);
    //             this.errorMessageSubject.next("No se ha logrado obtener datos para la consulta.");
    //             this.loadingSubject.next(false);
    //         }
    //     );
    // }
}