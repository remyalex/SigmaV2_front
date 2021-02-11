import { DataSource } from '@angular/cdk/table';
import { Formatoseccioncampo } from '../models/formatoseccioncampo.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { FormatoseccioncampoService } from './formatoseccioncampo.service';
import { FormatoseccioncampoCriteria } from '../models/formatoseccioncampo-criteria.model';
import { CONST_ADMINISTRACION_FORMATOSECCIONCAMPO } from '../formatoseccioncampo.constant';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class FormatoseccioncampoDatasource
  implements DataSource<Formatoseccioncampo> {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_FORMATOSECCIONCAMPO;
  private formatoseccioncampoSubject = new BehaviorSubject<Formatoseccioncampo[]>([]);
  public  totalelementsSubject = new BehaviorSubject<number>(0);
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
  public formatoseccioncampoData: any;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio del componente al cual se va a realizar la petición de información
  */
  constructor (private servicio: FormatoseccioncampoService) {}

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Formatoseccioncampo[]> {
    return this.formatoseccioncampoSubject.asObservable();
  }

  /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.formatoseccioncampoSubject.complete();
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
  loadData(criteria: FormatoseccioncampoCriteria): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.search(criteria).subscribe(
      async (data: any) => {
        const datosNuevos = data.content.map(async formatoseccioncampo => {
          const formatoseccioncampo_formatoSeccion = await this.servicio.searchByList(
            this.constants
              .path_administracion_formatoseccioncampo_formatoSeccionId,
            formatoseccioncampo.formatoSeccionId
          );
          const formatoseccioncampo_lista = await this.servicio.searchByList(
            this.constants.path_administracion_formatoseccioncampo_listaId,
            formatoseccioncampo.listaId
          );
          const formatoseccioncampo_tipoCampoFormato = await this.servicio.searchByList(
            this.constants
              .path_administracion_formatoseccioncampo_tipoCampoFormatoId,
            formatoseccioncampo.tipoCampoFormatoId
          );
          return {
            ...formatoseccioncampo,
            ...{
              formatoSeccionValor:
                typeof formatoseccioncampo_formatoSeccion != 'undefined'
                  ? formatoseccioncampo_formatoSeccion.nombre
                  : this.constants.noEncontrado,
              listaValor:
                typeof formatoseccioncampo_lista != 'undefined'
                  ? formatoseccioncampo_lista.nombre
                  : this.constants.noEncontrado,
              tipoCampoFormatoValor:
                typeof formatoseccioncampo_tipoCampoFormato != 'undefined'
                  ? formatoseccioncampo_tipoCampoFormato.valor
                  : this.constants.noEncontrado
            }
          };
        });
        Promise.all(datosNuevos).then(completed => {
          data.content = completed;
          this.formatoseccioncampoData = completed;
          this.formatoseccioncampoSubject.next(data.content);

          this.totalelementsSubject.next(data.totalElements);
          this.errorSubject.next(false);
          this.errorMessageSubject.next('');
          this.loadingSubject.next(false);
        });
      },
      error => {
        this.formatoseccioncampoSubject.next([]);
        this.totalelementsSubject.next(0);
        this.errorSubject.next(true);
        this.errorMessageSubject.next(
          this.constants.noResultados
        );
        this.loadingSubject.next(false);
      }
    );
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (formatoCodigo: string): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.listbyCodigoformato(formatoCodigo)
    .subscribe(async(data: any) => {
        const datosNuevos = data.map(async formatoseccioncampo => {
          const formatoseccioncampo_formatoSeccion = await this.servicio.searchByList(
            this.constants
              .path_administracion_formatoseccioncampo_formatoSeccionId,
            formatoseccioncampo.formatoSeccionId
          );
          const formatoseccioncampo_lista = await this.servicio.searchByList(
            this.constants.path_administracion_formatoseccioncampo_listaId,
            formatoseccioncampo.listaId
          );
          const formatoseccioncampo_tipoCampoFormato = await this.servicio.searchByList(
            this.constants
              .path_administracion_formatoseccioncampo_tipoCampoFormatoId,
            formatoseccioncampo.tipoCampoFormatoId
          );
          return {
            ...formatoseccioncampo,
            ...{
              formatoSeccionValor:
                typeof formatoseccioncampo_formatoSeccion != 'undefined'
                  ? formatoseccioncampo_formatoSeccion.nombre
                  : this.constants.noEncontrado,
              listaValor:
                typeof formatoseccioncampo_lista != 'undefined'
                  ? formatoseccioncampo_lista.nombre
                  : this.constants.noEncontrado,
              tipoCampoFormatoValor:
                typeof formatoseccioncampo_tipoCampoFormato != 'undefined'
                  ? formatoseccioncampo_tipoCampoFormato.valor
                  : this.constants.noEncontrado
            }
          };
        });
        Promise.all(datosNuevos).then(completed => {
          data.content = completed;
          this.formatoseccioncampoData = completed;
          this.formatoseccioncampoSubject.next(data.content);

          this.totalelementsSubject.next(data.totalElements);
          this.errorSubject.next(false);
          this.errorMessageSubject.next('');
          this.loadingSubject.next(false);
        });
      },
      error => {
        this.formatoseccioncampoSubject.next([]);
        this.totalelementsSubject.next(0);
        this.errorSubject.next(true);
        this.errorMessageSubject.next(
          this.constants.noResultados
        );
        this.loadingSubject.next(false);
      }
    );
  }
}
