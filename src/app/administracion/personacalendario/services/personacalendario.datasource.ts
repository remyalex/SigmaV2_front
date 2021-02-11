import { DataSource } from '@angular/cdk/table';
import { Personacalendario } from '../models/personacalendario.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { PersonacalendarioService } from './personacalendario.service';
import { PersonacalendarioCriteria, PersonacalendarioCalendarsCriteria } from '../models/personacalendario-criteria.model';
import { CONST_ADMINISTRACION_PERSONACALENDARIO } from './../personacalendario.constant';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class PersonacalendarioDatasource implements DataSource<Personacalendario> {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONACALENDARIO;

  private _personasCalendario: Personacalendario[] = []; 
  public personacalendarioSubject = new BehaviorSubject<Personacalendario[]>(this._personasCalendario);
  public totalelementsSubject = new BehaviorSubject<number>(0);
  /** Variable usada para notificación a otros componentes de cambios */
  private loadingSubject = new BehaviorSubject<boolean>(false);
  /** Variable usada para notificación a otros componentes de cambios */
  private errorSubject = new BehaviorSubject<boolean>(false);
  /** Variable usada para notificación a otros componentes de cambios */
  private errorMessageSubject = new BehaviorSubject<string>('');

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
  public personacalendarioData: any;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio del componente al cual se va a realizar la petición de información
  */
  constructor (private servicio: PersonacalendarioService) { }

  /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<Personacalendario[]> {
    return this.personacalendarioSubject.asObservable();
  }

  /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.personacalendarioSubject.complete();
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
  loadData(criteria: PersonacalendarioCriteria, path = ''): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    // if (path.indexOf(' ') > 0) {
    //   path = path.replace(' ', '');
    //   path = path.replace(' ', '');
    // }
    this.petitionList = this.servicio.search(criteria, path)
      .subscribe(async (data: any) => {
        let info = data;
        if (typeof data.content != 'undefined') {
          info = data.content;
        }
        const datosNuevos = info.map(async (personacalendario) => {
          if (path) {
            return personacalendario;
          }
          return { ...personacalendario };
        });
        Promise.all(datosNuevos)
          .then((completed) => {
            data.content = completed;
            this.personacalendarioData = completed;

            this.personacalendarioSubject.next(data.content);
            this.totalelementsSubject.next(data.totalElements);
            this.errorSubject.next(false);
            this.errorMessageSubject.next('');
            this.loadingSubject.next(false);
          });
      },
        error => {
          this.personacalendarioSubject.next([]);
          this.totalelementsSubject.next(0);
          this.errorSubject.next(true);
          this.errorMessageSubject.next(this.constants.noResultados);
          this.loadingSubject.next(false);
        }
      );
  }

  loadDataCalendars(path = ''): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.listCalendars(path).subscribe((data: any) => {
      this._personasCalendario = data;
      this.personacalendarioSubject.next(data);
      this.totalelementsSubject.next(data.length);
      this.errorSubject.next(false);
      this.errorMessageSubject.next('');
      this.loadingSubject.next(false);

        // let info = data;
        // if (typeof data.content !== 'undefined') {
        //   info = data.content;
        // }
        // const datosNuevos = info.map(async (personacalendario) => {
        //   return { ...personacalendario };
        // });
        // Promise.all(datosNuevos)
        //   .then((completed) => {
        //     data.content = completed;
        //     this.personacalendarioData = completed;

        //     this.personacalendarioSubject.next(data.content);
        //     this.totalelementsSubject.next(data.totalElements);
        //     this.errorSubject.next(false);
        //     this.errorMessageSubject.next('');
        //     this.loadingSubject.next(false);
        //   });
      }, error => {
        this.personacalendarioSubject.next([]);
        this.totalelementsSubject.next(0);
        this.errorSubject.next(true);
        this.errorMessageSubject.next(this.constants.noResultados);
        this.loadingSubject.next(false);
      }
      );
  }

  public getPersonasCalendario(): Personacalendario[] {
    return this._personasCalendario;
  }
}
