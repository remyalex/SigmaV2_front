import { DataSource } from "@angular/cdk/table";
import { ActaVolanteResidenteModel } from '../models/acta-volante-residente.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { ActaVolanteResidenteService } from './acta-volante-residente.service';
import { ActaVolanteResidenteCriteria } from '../models/acta-volante-residente-criteria.model';
import { CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE } from '../registrar-acta-vecindad-volante.constant';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class ActaVolanteResidenteDatasource implements DataSource<ActaVolanteResidenteModel>{
 /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE;
  private actaVolanteResidenteSubject = new BehaviorSubject<ActaVolanteResidenteModel[]>([]);
  public totalelementsSubject = new BehaviorSubject<number>(0);
  /** Variable usada para notificación a otros componentes de cambios */
  private loadingSubject = new BehaviorSubject<boolean>(false);
  /** Variable usada para notificación a otros componentes de cambios */
  private errorSubject = new BehaviorSubject<boolean>(false);
  private errorMessageSubject = new BehaviorSubject<string>("");

  /** Variable usada para notificación a otros componentes de cambios */
  public totalElements$ = this.totalelementsSubject.asObservable();
  /** Variable usada para notificación a otros componentes de cambios */
  public loading$ = this.loadingSubject.asObservable();
  /** Variable usada para notificación a otros componentes de cambios */
  public error$ = this.errorSubject.asObservable();
  /** Variable usada para notificación a otros componentes de cambios */
  public errorMessage$ = this.errorMessageSubject.asObservable();
  /** Variable con url de peticion a realizar */
  public petitionList = null;
  /** Variable con datos obtenidos de la petición al servidor */
  public infoData: any;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio del componente al cual se va a realizar la petición de información
  */
  constructor (private servicio: ActaVolanteResidenteService) { }

  /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<ActaVolanteResidenteModel[]> {
    return this.actaVolanteResidenteSubject.asObservable();
  }

  /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.actaVolanteResidenteSubject.complete();
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
  loadData(criteria: ActaVolanteResidenteCriteria): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.search(criteria)
      .subscribe(async (data: any) => {
        const datosNuevos = data.content.map(async (acta) => {
          return {
            ...acta,
            ...{
            }
          };
        });
        Promise.all(datosNuevos)
          .then((completed) => {
            data.content = completed;
            this.infoData = completed;
            this.actaVolanteResidenteSubject.next(data.content);
          });
        this.infoData = data.content;
        this.actaVolanteResidenteSubject.next(data.content);
        this.totalelementsSubject.next(data.totalElements);
        this.errorSubject.next(false);
        this.errorMessageSubject.next('');
        this.loadingSubject.next(false);
      },
        error => {
          this.actaVolanteResidenteSubject.next([]);
          this.totalelementsSubject.next(0);
          this.errorSubject.next(true);
          this.errorMessageSubject.next('No se ha logrado obtener datos para la consulta.');
          this.loadingSubject.next(false);
        }
      );
  }
}