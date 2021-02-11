import { DataSource } from '@angular/cdk/table';
import { TarjetaOperacion } from '../models/tarjeta-operacion.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { TarjetaOperacionService } from './tarjeta-operacion.service';
import { TarjetaOperacionCriteria } from '../models/tarjeta-operacion-criteria.model';
import { CONST_PRODUCCION_TARJETA_OPERACION } from './../tarjeta-operacion.constant';
import { log } from 'util';

/**
 * Componente encargado de gestionar las peticiones de conexión,
 * desconexión y carga de datos para el componente de servicio
 **/
export class TarjetaOperacionDatasource implements DataSource<TarjetaOperacion> {
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_TARJETA_OPERACION;
  private equipoSubject = new BehaviorSubject<TarjetaOperacion[]>([]);
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
  public equipoData: any;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param servicio Servicio del componente al cual se va a realizar la petición de información
  */
  constructor (private servicio: TarjetaOperacionService) { }

  /**
   * Método usado para establecer conexión con el servidor
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  connect(collectionViewer: CollectionViewer): Observable<TarjetaOperacion[]> {
    return this.equipoSubject.asObservable();
  }

  /**
   * Método usado para finalizar la petición de conexión con el servidor.
   *
   * @param collectionViewer Visor de la colección que devolverá el observable con información
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.equipoSubject.complete();
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
  loadData(criteria: TarjetaOperacionCriteria): void {
    this.loadingSubject.next(true);
    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.petitionList = this.servicio.search(criteria)
      .subscribe(
        async (data: any) => {
          this.equipoData = data;
          this.equipoSubject.next(data.content);
          this.totalelementsSubject.next(data.totalElements);
          this.errorSubject.next(false);
          this.errorMessageSubject.next('');
          this.loadingSubject.next(false);
        },
        error => {
          this.equipoSubject.next([]);
          this.totalelementsSubject.next(0);
          this.errorSubject.next(true);
          this.errorMessageSubject.next(this.constants.noResultados);
          this.loadingSubject.next(false);
        }
        // async (data: any) => {
        //   const datosNuevos = data.content.map(async (equipo) => {
        //     const clase_equipo = await this.servicio.searchByList(
        //       CONST_ADMINISTRACION_EQUIPO.path_administracion_equipo_claseEquipoId, equipo.claseEquipo.id);
        //     const tipo_equipo = await this.servicio.searchByList(
        //       CONST_ADMINISTRACION_EQUIPO.path_administracion_equipo_tipoEquipoId, equipo.tipoEquipo.id);
        //     const origen_equipo = await this.servicio.searchByList(
        //       CONST_ADMINISTRACION_EQUIPO.path_administracion_equipo_origenEquipoId, equipo.origenEquipo.id);
        //     const tipo_combustible_equipo = await this.servicio.searchByList(
        //       CONST_ADMINISTRACION_EQUIPO.path_administracion_equipo_tipoCombustibleId, equipo.tipoCombustible.id);
        //     const anio_modelo_equipo = await this.servicio.searchByList(
        //       CONST_ADMINISTRACION_EQUIPO.path_administracion_equipo_anioModeloId, equipo.anioModelo.id);
        //     const areaUmvId_equipo = await this.servicio.searchByList(
        //       CONST_ADMINISTRACION_EQUIPO.path_administracion_equipo_areaUmvId, equipo.area.id);
        //     const estado_equipo = await this.servicio.searchByList(
        //       CONST_ADMINISTRACION_EQUIPO.path_administracion_equipo_estadoEquipoId, equipo.estadoEquipo.id);
        //     const lugar_umv_equipo = await this.servicio.searchByList(
        //       CONST_ADMINISTRACION_EQUIPO.path_administracion_equipo_lugarUmvId, equipo.lugar.id);
        //     const marca_equipo = await this.servicio.searchByList(
        //       CONST_ADMINISTRACION_EQUIPO.path_administracion_equipo_marcaEquipoId, equipo.marcaEquipo.id);
        //     return {
        //       ...equipo,
        //       ...{ claseEquipoValor: (typeof clase_equipo !== 'undefined') ? clase_equipo.valor : this.constants.noEncontrado },
        //       ...{ tipoEquipoValor: (typeof tipo_equipo !== 'undefined') ? tipo_equipo.valor : this.constants.noEncontrado },
        //       ...{ origenEquipoValor: (typeof origen_equipo !== 'undefined') ? origen_equipo.valor : this.constants.noEncontrado },
        //       ...{ tipoCombustibleValor: (typeof tipo_combustible_equipo !== 'undefined') ? tipo_combustible_equipo.valor : this.constants.noEncontrado },
        //       ...{ anioModeloValor: (typeof anio_modelo_equipo !== 'undefined') ? anio_modelo_equipo.valor : this.constants.noEncontrado },
        //       ...{ areaUmvValor: (typeof areaUmvId_equipo !== 'undefined') ? areaUmvId_equipo.valor : this.constants.noEncontrado },
        //       ...{ estadoEquipoValor: (typeof estado_equipo !== 'undefined') ? estado_equipo.valor : this.constants.noEncontrado },
        //       ...{ lugarUmvValor: (typeof lugar_umv_equipo !== 'undefined') ? lugar_umv_equipo.nombre : this.constants.noEncontrado },
        //       ...{ marcaEquipoValor: (typeof marca_equipo !== 'undefined') ? marca_equipo.valor : this.constants.noEncontrado }
        //     };
        //   });
        //   Promise.all(datosNuevos)
        //     .then((completed) => {
        //       data.content = completed;
        //       this.equipoData = completed;
        //       this.equipoSubject.next(data.content);
        //       this.totalelementsSubject.next(data.totalElements);
        //       this.errorSubject.next(false);
        //       this.errorMessageSubject.next('');
        //       this.loadingSubject.next(false);
        //     });

        // },
        // error => {
        //   this.equipoSubject.next([]);
        //   this.totalelementsSubject.next(0);
        //   this.errorSubject.next(true);
        //   this.errorMessageSubject.next(this.constants.noResultados);
        //   this.loadingSubject.next(false);
        // }
      );
  }

}
