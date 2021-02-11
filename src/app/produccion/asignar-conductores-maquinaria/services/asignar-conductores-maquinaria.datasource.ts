import { DataSource } from "@angular/cdk/table";
import { AsignarConductoresMaquinaria, AsignarConductoresMaquinariaDetalles,  } from '../models/asignar-conductores-maquinaria.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { AsignarConductoresMaquinariaService } from './asignar-conductores-maquinaria.service';
import { AsignarConductoresMaquinariaCriteria, AsignarConductoresMaquinariaPersonas } from '../models/asignar-conductores-maquinaria-criteria.model';
import { CONST_ASIGNAR_CONDUCTORES_MAQUINARIA } from '../asignar-conductores-maquinaria.constant';

export class AsignarConductoresMaquinariaDatasource implements DataSource<AsignarConductoresMaquinaria>{
 /** Constantes a usar en el componente */
  constants = CONST_ASIGNAR_CONDUCTORES_MAQUINARIA;
  private ensayosSubject = new BehaviorSubject<AsignarConductoresMaquinaria[]>([]);
  public totalelementsSubject = new BehaviorSubject<number>(0);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<boolean>(false);
  private errorMessageSubject = new BehaviorSubject<string>("");

  public totalElements$ = this.totalelementsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();
  public errorMessage$ = this.errorMessageSubject.asObservable();
  public petitionList = null;
  public ensayosData: any;


  /**
  * Método encargado de construir una instancia
  */
  constructor(private servicio: AsignarConductoresMaquinariaService) { }

  /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<AsignarConductoresMaquinaria[]> {
    return this.ensayosSubject.asObservable();
  }

  /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.ensayosSubject.complete();
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

  loadData(criteria: AsignarConductoresMaquinariaCriteria, payload): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.search(criteria, payload)
    .subscribe(
        async (data: any) => {
          this.ensayosData = data;
          this.ensayosSubject.next(data.content);
          this.totalelementsSubject.next(data.totalElements);
          this.errorSubject.next(false);
          this.errorMessageSubject.next('');
          this.loadingSubject.next(false);
        },
        error => {
          this.ensayosSubject.next([]);
          this.totalelementsSubject.next(0);
          this.errorSubject.next(true);
          this.errorMessageSubject.next(this.constants.noResultados);
          this.loadingSubject.next(false);
        }

      );
  }


  loadData_Maquinaria(criteria: AsignarConductoresMaquinariaCriteria, id): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.listMaquinaria(criteria, id)
    .subscribe(
        async (data: any) => {
          this.ensayosData = data;
          this.ensayosSubject.next(data.content);
          this.totalelementsSubject.next(data.totalElements);
          this.errorSubject.next(false);
          this.errorMessageSubject.next('');
          this.loadingSubject.next(false);
        },
        error => {
          this.ensayosSubject.next([]);
          this.totalelementsSubject.next(0);
          this.errorSubject.next(true);
          this.errorMessageSubject.next(this.constants.noResultados);
          this.loadingSubject.next(false);
        }

      );
  }


  loadData_Personas(criteria: AsignarConductoresMaquinariaPersonas): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.listPersonas(criteria)
    .subscribe(
        async (data: any) => {
          this.ensayosData = data;
          this.ensayosSubject.next(data.content);
          this.totalelementsSubject.next(data.totalElements);
          this.errorSubject.next(false);
          this.errorMessageSubject.next('');
          this.loadingSubject.next(false);
        },
        error => {
          this.ensayosSubject.next([]);
          this.totalelementsSubject.next(0);
          this.errorSubject.next(true);
          this.errorMessageSubject.next(this.constants.noResultados);
          this.loadingSubject.next(false);
        }

      );
  }


  loadData_All_Personas(criteria: AsignarConductoresMaquinariaPersonas): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    
    this.petitionList = this.servicio.listPersonas_All(criteria)
    .subscribe(
        async (data: any) => {
          this.ensayosData = data;
          this.ensayosSubject.next(data.content);
          this.totalelementsSubject.next(data.totalElements);
          this.errorSubject.next(false);
          this.errorMessageSubject.next('');
          this.loadingSubject.next(false);
        },
        error => {
          this.ensayosSubject.next([]);
          this.totalelementsSubject.next(0);
          this.errorSubject.next(true);
          this.errorMessageSubject.next(this.constants.noResultados);
          this.loadingSubject.next(false);
        }

      );
  }


}