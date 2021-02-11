import { Injectable } from '@angular/core';
import { GridMantenimientosComponent } from '../component/grid-mantenimientos/grid-mantenimientos.component';
import { VisorMapaComponent } from '../visor-mapa/visor-mapa.component';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonService } from './common.service';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { RutaEstimada } from '../models/ruta-estimada.model';
import { loadModules } from 'esri-loader';
import esri = __esri;
import { environment } from 'src/environments/environment';
import { CapaGeograficaExterna } from '../models/capa-geografica.model';
import { CONST_VISOR_MAPA } from '../visor-mapa/visor-mapa.constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
import { CAPAS } from '../visor-mapa/visor-mapa-capas';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({
  providedIn: 'root'
})
export class MapService {

  public layerPrincipal: any;

  public activarCruceSigEntidades = false;

  private actividad: BaseComponent;

  private _grid: GridMantenimientosComponent;
  private gridMantenimientosSeleccionadosSubscribe: any;
  private gridMantenimientoLocalizadoSubscribe: any;
  private gridMapQuerySubscribe: any;
  private gridLimpiarSubscribe: any;

  private _visor: VisorMapaComponent;
  private visorSeleccionadosSubscribe: any;
  private visorSeleccionadoSubscribe: any;
  private visorRutaSubscribe: any;


  protected _mantenimientoSeleccionado: WorkflowMantenimientoModel;
  protected _mantenimientoSeleccionadoSubject = new BehaviorSubject<WorkflowMantenimientoModel>(this._mantenimientoSeleccionado);
  public mantenimientoSeleccionado$ = this._mantenimientoSeleccionadoSubject.asObservable();


  protected _interseccionGeografica: any;
  protected _interseccionGeograficaSubject = new BehaviorSubject<any>(this._interseccionGeografica);
  public interseccionGeografica$ = this._interseccionGeograficaSubject.asObservable();

  protected _cantidadMaxPks = false;
  protected _cantidadMaxPksSubject = new BehaviorSubject<boolean>(this._cantidadMaxPks);
  public cantidadMaxPks$ = this._cantidadMaxPksSubject.asObservable();

  protected _nombresCapasTableroControl: any[];
  protected _nombresCapasTableroControlSubject = new BehaviorSubject<any[]>(this._nombresCapasTableroControl);
  public nombresCapasTableroControl$ = this._nombresCapasTableroControlSubject.asObservable();


  private forceShowMapOnRedirectUrl = false;
  public cantidadCruces = 0;
  public capasSinElementosCruce = 0;
  public pkConCruces = [];
  public pkInicialesCruces = [];

  private constants = CONST_VISOR_MAPA;
  private resoruceUrl: string;

  /** Variable de nombre de otras capas*/
   public nomOtrasCapas = [];

  // public responsableId = '';
  /**
  * Método encargado de construir una instancia
  */
  constructor(private commonService: CommonService, private _http: HttpClient, private appSettings: AppSettings) {
    this.resoruceUrl = appSettings.settings.hostApi;
  }

  connectActividad(actividad: BaseComponent) {
    this.actividad = actividad;
  }

  forceShowMap() {
    this.getVisor().visible = true;
    this.forceShowMapOnRedirectUrl = true;
  }

  connectToGrid(_grid: GridMantenimientosComponent) {
    if (_grid) {
      this._grid = _grid;

      if (this.actividad.accion
      ) {
        if (this.forceShowMapOnRedirectUrl === false) {
          this._visor.visible = false;
        }

      } else {
        this._visor.visible = true;
      }

      if (this._visor) {
        this._visor.limpiar();
        if (this._grid) {
          this._visor.seleccionarMantenimientos(this._grid.getMantenimientosSelected());
          this._visor.setMapFilter(this._grid.getMapFilter());
        }
      }

      if (this._grid) {
        this.subscribeGrid();
        this._grid.loadData();
        if (this._grid.esMasiva()) {
          this._visor.mostrarControlesSeleccionMultiple();
          this._visor.seleccionMasiva = true;
        } else {
          this._visor.ocultarControlesSeleccionMultiple();
          this._visor.seleccionMasiva = false;
        }
      }
    } else {
      this.unsubscribeGrid();
    }
  }

  unsubscribeGrid() {
    if (this.gridMantenimientosSeleccionadosSubscribe) {
      this.gridMantenimientosSeleccionadosSubscribe.unsubscribe();
    }
    if (this.gridMapQuerySubscribe) {
      this.gridMapQuerySubscribe.unsubscribe();
    }
    if (this.gridMantenimientoLocalizadoSubscribe) {
      this.gridMantenimientoLocalizadoSubscribe.unsubscribe();
    }
    if (this.gridLimpiarSubscribe) {
      this.gridLimpiarSubscribe.unsubscribe();
    }
  }

  subscribeGrid() {

    this.unsubscribeGrid();

    this.gridMantenimientosSeleccionadosSubscribe = this._grid.mantenimientosSeleccionados$.subscribe(_mantenimientos => {
      if (this._visor) {
        this._visor.seleccionarMantenimientos(_mantenimientos);
      }
      if (_mantenimientos && this.activarCruceSigEntidades === true) {
        this._interseccionGeografica = [];
        let capas: CapaGeograficaExterna[] = [];
        capas = CAPAS.capas_externas;

        if (_mantenimientos.length <= 200) {
          capas.map(capa => {
            this._interseccionGeografica[capa.nombre] = [];
          });
          this.getInterseccionesCapasExternas(_mantenimientos);
        } else {
          this._interseccionGeografica['length'] = _mantenimientos.length;
          this._interseccionGeograficaSubject.next(this._interseccionGeografica);
        }
      }
    });

    this.gridMapQuerySubscribe = this._grid.mapQuery$.subscribe(_mapQuery => {
      if (this._visor) {
        this._visor.setMapFilter(_mapQuery);
      }
    });

    this.gridMantenimientoLocalizadoSubscribe = this._grid.mantenimientoLocalizado$.subscribe(mantenimiento => {
      if (this._visor) {
        this._visor.localizar(mantenimiento);
      }
    });

    this.gridLimpiarSubscribe = this._grid.clear$.subscribe(clear => {
      if (this._visor) {
        this._visor.limpiar();
      }
    });
  }

  disconectGrid() {
    this._visor.visible = false;
    this.unsubscribeGrid();
    this._grid = null;
  }

  connectToMap(_visor: VisorMapaComponent) {
    if (_visor) {
      this._visor = _visor;
      this.subscribeMap();
    }
  }

  subscribeMap() {

    this.unsubscribeMap();

    this._visor.mapaInicializado$.subscribe(inicializado => {
      if (inicializado && this._grid) {
        this.connectToGrid(this._grid);
      }
    });

    this.visorSeleccionadosSubscribe = this._visor.PKSeleccionados$.subscribe((pks: string[]) => {
      if (this._grid) {
        this._grid.setPksSeleccionados(pks);
      }
    });

    this.visorSeleccionadoSubscribe = this._visor.PKSeleccionado$.subscribe((pk: string) => {
      if (this._grid) {
        this._grid.setPksSeleccionado(pk);
      }
      this.commonService.getMantenimientoPorPK(pk).subscribe(_mantenimiento => {
        this._mantenimientoSeleccionadoSubject.next(_mantenimiento);
      });
    });

    this.visorSeleccionadoSubscribe = this._visor.filtrarPk$.subscribe((pkFiltro: string) => {
      if (this._grid) {
        this._grid.setPkFiltro(pkFiltro);
      }
    });

    this.visorRutaSubscribe = this._visor.rutaEstimada$.subscribe((ruta: RutaEstimada) => {
    });

    this._visor.filtrarUbicaciones$.subscribe(ubicacion => {
      if (this._grid) {
        this._grid.filtrarMedianteMapa(ubicacion);
      }
    });
  }

  unsubscribeMap() {
    if (this.visorSeleccionadosSubscribe) {
      this.visorSeleccionadosSubscribe.unsubscribe();
    }

    if (this.visorSeleccionadoSubscribe) {
      this.visorSeleccionadoSubscribe.unsubscribe();
    }

  }

  public getVisor(): VisorMapaComponent {
    return this._visor;
  }

  public getGrid(): GridMantenimientosComponent {
    return this._grid;
  }

  public setNobresCapasTableroControl(nombresCapasTableroControl: any[]) {
    this._nombresCapasTableroControl = nombresCapasTableroControl;
    this._nombresCapasTableroControlSubject.next(this._nombresCapasTableroControl);
  }

  public limpiarNobresCapasTableroControl() {
    this._nombresCapasTableroControl = [];
    this._nombresCapasTableroControlSubject.next(this._nombresCapasTableroControl);
  }

  public limpiarMantenimientoIndividual() {
    this._mantenimientoSeleccionado = undefined;
    this._mantenimientoSeleccionadoSubject.next(this._mantenimientoSeleccionado);
  }

  public mostrarMensajeCantidadMaxPks() {
    this._cantidadMaxPks = true;
    this._cantidadMaxPksSubject.next(this._cantidadMaxPks);
  }

  public limpiarCantidadMaxPks() {
    this._cantidadMaxPks = false;
    this._cantidadMaxPksSubject.next(this._cantidadMaxPks);
  }

  public async getInterseccionesCapasExternas(mantenimientoSelect) {
    this._interseccionGeograficaSubject.next({});
    this.cantidadCruces = 0;
    this.capasSinElementosCruce = 0;
    this.pkConCruces = [];
    mantenimientoSelect.forEach((mantenimiento: WorkflowMantenimientoModel) => {
      this.pkInicialesCruces.push(mantenimiento.pk);
      this.layerPrincipal = this._visor.getLayerPrincipal();
      const sql = 'PK_ID_CALZADA IN (' + mantenimiento.pk + ')';
      const query = this.layerPrincipal.createQuery();

      query.where = sql;
      this.layerPrincipal.queryFeatures(query).then(results => {
        const scope = this;
        let capas: CapaGeograficaExterna[] = [];
        capas = CAPAS.capas_externas;
        capas.forEach(capa => {
          scope.cruzarCapa(capa, results.features[0]);
        });
      });
    });
  }

  private async cruzarCapa(capa: CapaGeograficaExterna, graphicPk): Promise<any> {
    const [FeatureLayer] = await loadModules([
      'esri/layers/FeatureLayer'
    ]);
    const pk = graphicPk.attributes['PK_ID_CALZADA'];
    const layerCapa = new FeatureLayer({
      url: capa.url,
      outFields: ['*'],
      title: capa.nombre,
    });

    const query = layerCapa.createQuery();
    query.geometry = graphicPk.geometry;
    query.spatialRelationship = 'overlaps'; // inter
    let dataAttributes = [];
    layerCapa.queryFeatures(query).then((results) => {
      results.features.map(features => {
        const rowAttributes = features.attributes;
        rowAttributes['Pk'] = pk;
        this.pkConCruces.push(pk);
        dataAttributes.push(features.attributes);
      });
      const headers = Object.getOwnPropertyNames(dataAttributes[0]);
      const headersJson = {};
      for (let k = 0; k < headers.length; k++) {
        headersJson[headers[k]] = headers[k];
      }
      if (this._interseccionGeografica[capa.nombre]['attributes']) {
        this._interseccionGeografica[capa.nombre]['attributes'] =
          [...this._interseccionGeografica[capa.nombre]['attributes'], ...dataAttributes];
        this._interseccionGeografica[capa.nombre]['order'].push(headersJson);
        this._interseccionGeografica[capa.nombre]['headers'].push(headers);
      } else {
        this._interseccionGeografica[capa.nombre]['attributes'] = dataAttributes;
        this._interseccionGeografica[capa.nombre]['order'] = headersJson;
        this._interseccionGeografica[capa.nombre]['headers'] = headers;
      }

      this._interseccionGeograficaSubject.next(this._interseccionGeografica);
      this.cantidadCruces = dataAttributes.length;
      dataAttributes = [];
    }).catch(error => {
        if (this.cantidadCruces === 0) {
            if (this.capasSinElementosCruce < 4 ) {
              this.capasSinElementosCruce++;
            } else {
              console.log('No hay cruce');
              this._interseccionGeograficaSubject.next({});
            }
        }
    });
  }

  public inicializarVarCruceGeografico() {
    this.pkConCruces = [];
    this.pkInicialesCruces = [];
  }

  public extraerPosicionesBoxImagenMapa(posicionesActuales: string, url: string) {
    if (url !== null && url !== '' && ! (typeof url === 'undefined')) {
      url = url.replace('bbox=', '');
      url = url.replace('&bboxSR=4326&size=560,300&format=jpg&f=image', '');
      url = url.replace('&bboxSR=102100&size=560,300&format=jpg&f=image', '');
    } else {
      return posicionesActuales;
    }
    return url;
  }

  public async solicitarRespuestaServidorEsriUrl(capaURL: any, capaNombre): Promise<any> {
    const [Request] = await loadModules([
      'esri/request',
    ]);
    if (capaURL) {
      const options = { query: {f: 'json'}, responseType: 'json'};
      if (!this.nomOtrasCapas.includes(capaNombre)) {
        Request(capaURL, options)
        .then((response) => {
          console.log('OK Capa ', capaNombre);
        })
        .catch((err) => {
          console.log('Error encountered', err);
          this.nomOtrasCapas.push(capaNombre);
        });
      }
    }
  }

  public getCapas(): Observable<any> {
    return this._http.get(`${this.resoruceUrl}/api/mapa/capas`);
  }

}

