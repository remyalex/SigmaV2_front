import { DataSource } from "@angular/cdk/table";
import { Menu } from '../models/menu.model';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { MenuadminService } from './menuadmin.service';
import { MenuCriteria } from '../models/menu-criteria.model';

import { debug } from 'util';
import { PermisosService } from '../../permisos/services/permisos.service';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class MenuDatasource implements DataSource<Menu>{

    private menuSubject = new BehaviorSubject<Menu[]>([]);
    public totalelementsSubject = new BehaviorSubject<number>(0);

    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<boolean>(false);
    private errorMessageSubject = new BehaviorSubject<string>("");

    public totalElements$ = this.totalelementsSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    public error$ = this.errorSubject.asObservable();
    public errorMessage$ = this.errorMessageSubject.asObservable();
    public menuData: any;
    menus: any;
    menus_padre: any;
    // private listaMenu: Menu[];

    constructor(private servicio: MenuadminService,
        private servicioPermiso: PermisosService,
    ) { }

    /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<Menu[]> {
        this.cargarListas();
        return this.menuSubject.asObservable();
    }

    cargarListas(): void {
        this.servicio.list()
            .subscribe((data: any) => {
                this.menus = data;
            });
    }

    /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
        this.menuSubject.complete();
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
  loadData(criteria: MenuCriteria): void {
        this.loadingSubject.next(true);
        combineLatest(
            this.servicio.search(criteria),
            this.servicio.list(),
            this.servicioPermiso.list(),
            (one: any, two, permisosItem) => {
                one.content = one.content.map((data) => {
                    let padre = two.filter((menu) => (menu.id == data.parentId))[0];

                    let permiso = permisosItem.filter((permiso) => (permiso.id == data.permisoId))[0];
                    if (typeof padre !== 'undefined') {
                        data = { ...data, ...{ padre: padre.titulo }, ... { estadoNombre: data.activo ? 'Si' : 'No' }, ...{ permiso: permiso != null ? permiso.nombre : '' } };
                    } else {
                        data = { ...data, ... { estadoNombre: data.activo ? 'Si' : 'No' } };
                    }
                    
                    this.servicio.refreshMenu();
                    return data;
                });
                return one;
            })
            .subscribe(data => {
                this.menus_padre = data.content;
                this.menuData = data.content;
                this.menuSubject.next(data.content);
                this.totalelementsSubject.next(data.totalElements);
                this.errorSubject.next(false);
                this.errorMessageSubject.next("");
                this.loadingSubject.next(false);
            },
                error => {

                    this.menuSubject.next([]);
                    this.totalelementsSubject.next(0);
                    this.errorSubject.next(true);
                    this.errorMessageSubject.next("No se encontraron resultados.");
                    this.loadingSubject.next(false);
                }
            );
    }
}
