import esri = __esri;
import { loadModules } from 'esri-loader';
import { Component, OnInit, ViewChild, ElementRef, DoCheck } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { MapService } from '../services/map.service';
import { CONST_VISOR_MAPA } from './visor-mapa.constants';
import { BehaviorSubject } from 'rxjs';
import { RutaEstimada } from '../models/ruta-estimada.model';
import { CAPAS, CapasHandler } from './visor-mapa-capas';
import { MatSnackBar } from '@angular/material';

/** Componente encargado de la gestión del visor del mapa en el apllicativo */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-visor-mapa',
  templateUrl: './visor-mapa.component.html',
  styleUrls: ['./visor-mapa.component.scss']
})
export class VisorMapaComponent implements OnInit, DoCheck {

  // constantes
 /** Constantes a usar en el componente */
  constants = CONST_VISOR_MAPA;

  // Varialbes de estructura del componente
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  // Layers
  /** Capa de mantenimientos */
  public layerMantenimientos: any;
  /** Capa de mantenimientos para consulta de popup no se gestiona muestra todos lo pks*/
  public layerConsultaMantenimientos: any;
  /** Capa de resultados de la consulta */
  private layerResultadosConsulta: any;
  /** Capa de Selección espacial de pks */
  private layerSeleccionEspacial: any;
  /** capa de censo de árboles */
  public layerCensoArbolado: any;
  /** Capa de censo de plazas del espacio público proporcionada por el IDU */
  public layerCensoPlazasEspacioPublicoIDUPlaza: any;
  /** Capa de censo de plazas del espacio público proporcionadas por IDU Pompeyano */
  public layerCensoPlazasEspacioPublicoIDUPompeyano: any;
  /** Capa de sumideros de alcantarillado de EAAB */
  public layerCensoSumiderosEAABAlcantarillado: any;
  /** Capa de sumiderros flubiales del EAAB */
  public layerCensoSumiderosEAABPluvial: any;
  /** Capa de censo espacio publico IDU */
  public layercensoPublicoIDU: any;
  /** Capa de resultados ambientales */
  public layerResultadosAmbiental: any;
  /** Capa dinamica de elementos */
  public layerDinamico: any;
  /** Capa de PKs para agrupamiento de Actividades agrupadas */
  public layerPKActividadAgrupada: any;
  /** Capa de avance de obra de intervención */
  public layerPKAvanceEjecucionIntervencion: any;
  /** Capa de tipo de programa del PK */
  public layerPKTipoPrograma: any;
  /** Capa de programación periodica del PK */
  public layerPKProgramacionPeriodica: any;
  /** Capa de estados ejecutados terminados del PK */
  public layerEjecucionTerminados: any;
  /** Capa de estado del pk y actividad agrupada */
  public layerJoinEstadoPkActividadAgrupada: any;
  /** Capa estrategia de intervencion */
  public layerEstrategiaIntervencion: any;
  /** Grupo de capas de tablero de control*/
  public groupLayerTableroControl: any;
  /** Grupo de capas de gestion ambiental*/
  public groupLayerGestionAmbiental: esri.GroupLayer;
  /** Grupo de capas de gestion umv*/
  public GroupLayerGestion: esri.GroupLayer;
  /** Pop up dinamico con información de capas dianmicas */
  public popupTemplateDinamic: any;
  /**Identificación de capas dinamicas  */
  public campoIdentificadorLayer = '';
  /** Nombre de capas activas, seleccionables y dinamicas*/
  public nombreCapaActivaSeleccionable = '';
  /** Variable que permite saber si se encuentra activa
   * la selección de elementos ambientales */
  public activarSeleccionInventarioAmbiental = false;
  /** Bandera que permite saber si se encuentra activo
   * la selección en el mapa */
  public activarSeleccion = true;
  /** Bandera que permite saber si se encuentra activo
   * el ruteo en el mapa */
  public activarRuteo = false;
  /** Bandera que permite saber si el componente se encuentra
   * en proceso de ruteo */
  public inRouting = false;
  /** Etiqueta inicial de calculo de ruta */
  public titleCalcularRuta = 'Punto Inicial';
  /** Listado de coordenadas del centroide inicial y final para el ruteo*/
  public arrayCentroidStartEnd = [];
  /** Listado de Centroides de pk seleccionados */
  public arrayCentroide = [];
  /** Ruta estimada generada por el sistema*/
  private _rutaEstimada: RutaEstimada;
  /** Subject de evento para notificar ruta estimada */
  private _rutaEstimadaSubject = new BehaviorSubject<RutaEstimada>(this._rutaEstimada);
  /** Observable para notificar evento de cambio de ruta estimada */
  public rutaEstimada$ = this._rutaEstimadaSubject.asObservable();

  /** Variable usada para gestionar la vista del mapa */
  private mapView: any;

  // Controles
  /** Control de seleccion espacial por usuario */
  private controlSpatialSelectionLeyendaExpand: any;

  // Variables de control
  /** Variable para controlar el estado de visibilidad del mapa */
  public visible = false;
  /** Variable para controlar la notificacion de evento de cambio de visibilidad del mapa */
  public _visibleSubject = new BehaviorSubject<boolean>(this.visible);
  /** Variable para controlar la notificacion de evento de cambio de visibilidad del mapa */
  public visible$ = this._visibleSubject.asObservable();
  /** Variable para saber si el mapa se encuentra oculto */
  public mapaOculto = false;
  /** Variable para saber si la selección masiva de pks en el mapa esta habilitada */
  public seleccionMasiva = false;
  /** Listado de Pks seleccionados en el mapa */
  private _PKSeleccionados: string[] = [];
  /** Notificador de evento al momento de modificarse los pks seleccionados */
  private _PKSeleccionadosSubject = new BehaviorSubject<string[]>(this._PKSeleccionados);
  /** Observable del evento de cambio de pks seleccionados */
  public PKSeleccionados$ = this._PKSeleccionadosSubject.asObservable();
  /** Pk Seleccionao individualmente */
  private _PKSeleccionado: string;
  /** Notificador de evento al momento de modificarse los pks seleccionados */
  private _PKSeleccionadoSubject = new BehaviorSubject<string>(this._PKSeleccionado);
  /** Observable del evento de cambio de pks seleccionados */
  public PKSeleccionado$ = this._PKSeleccionadoSubject.asObservable();

  /** Filtro de pks aplicado */
  private _filtrarPk: string;
  /** Notificador de evento al momento de modificarse los filtros */
  private _filtrarPkSubject = new BehaviorSubject<string>(this._filtrarPk);
  /** Observable del evento de cambio de filtros realizados */
  public filtrarPk$ = this._filtrarPkSubject.asObservable();

  /** Listado de Entidades de elementos Pks seleccionados */
  private _idElementosSeleccionadosEntidades: string[] = [];
  /** Notificador de evento al momento de selección de Entidades de elementos Pks seleccionados */
  private _idElementosSeleccionadosEntidadesSubject = new BehaviorSubject<string[]>(this._idElementosSeleccionadosEntidades);
   /** Observable del evento al momento de selección de Entidades de elementos Pks seleccionados */
  public idElementosSeleccionadosEntidades$ = this._idElementosSeleccionadosEntidadesSubject.asObservable();

  /** Listado de Entidades de elementos Pks seleccionados */
  private _elementosSeleccionadosEntidades = [];
  /** Notificador de evento al momento de selección de Entidades de elementos Pks seleccionados */
  private _elementosSeleccionadosEntidadesSubject = new BehaviorSubject<any[]>(this._elementosSeleccionadosEntidades);
   /** Observable del evento al momento de selección de Entidades de elementos Pks seleccionados */
  public elementosSeleccionadosEntidades$ = this._elementosSeleccionadosEntidadesSubject.asObservable();


  /** Bandera que permite identificar si el mapa se encuentra inicializado */
  private _mapaInicializado = false;
  /** Notificador de evento al momento de cambiar el estadod e inicialización del mapa */
  private _mapaInicializadoSubject = new BehaviorSubject<boolean>(this._mapaInicializado);
  /** Observable del evento al momento de cambiar el estadod e inicialización del mapa  */
  public mapaInicializado$ = this._mapaInicializadoSubject.asObservable();

  /** Parámetros de url de la imagen de mapa*/
  private _imageUrlParameters: string;
  /** Notificador de evento al momento de cambiar los parámetros de url de la imagen de mapa */
  private _imageUrlParametersSubject = new BehaviorSubject<string>(this._imageUrlParameters);
  /** Observable del evento al momento de cambiar los parámetros de url de la imagen de mapa  */
  public imageUrlParameters$ = this._imageUrlParametersSubject.asObservable();

  /** Notificador de evento al momento de cambiar los parámetros para filtrar desde el mapa*/
  private _filtrarUbicacionesSubject = new BehaviorSubject<Object>({});
  /** Observable del evento al momento de cambiar los parámetros para filtrar desde el mapa  */
  public filtrarUbicaciones$ = this._filtrarUbicacionesSubject.asObservable();
  /** Variable del filtro original del mapa*/
  public definitionExpressionOriginal = '';
  /** Bandera de control para saber si el botón de ruteo esta presente en el mapa */
  public ruteoVisibleBtn = true;
  /** Bandera de seleccion pk ruteo en el mapa */
  public seleccionarPkRuteo = true;
  /** Capa gráfica de ruteo del mapa */
  public routeLayer: esri.GraphicsLayer;
  /** Capa gráfica de puntos de inicio y final de la ruta en el mapa */
  public stopLayer: esri.GraphicsLayer;
  /** Capa gráfica de puntos para el control de escala en el mapa */
  public pksPuntosControlEscala: esri.GraphicsLayer;
  /** Variable de búsqueda (geoCodificador) del mapa */
  private search: any;
  /** Etiqueta usada para ocultar el mapa */
  public labelOcultarMapa = this.constants.ocultarmapa;
  /** Variable de respuesta de errores Url capas*/
  private errorRespuestasUrl = [];
  /** Capa de resultados del search*/
  private layerResultadosSearch: any;
  /** Elemento para el dibujo masivo */
  private sketchSpatialSelection: any;
  /** Elemento para leyenda */
  private controlLeyenda: any;


  /** Método encargado de construir una instancia
   *
   * @param mapService Servicio referencia del mapa que se usara para
   * la gestión del elemento del mapa
  */
  constructor(private mapService: MapService, private snackbar: MatSnackBar) {
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {

      this.inicializar();
  }

  getCapas() {
    this.mapService.getCapas().subscribe(data => {
      const capasHandler = new CapasHandler();
      capasHandler.setCapas(JSON.parse(data));
      this.inicializar();
    }, error => {
      this.snackbar.open('No se cargaron las capas del mapa', 'X', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    });
  }

  /** Método encargado de inicializar la configuración del mapa */
  inicializar() {
    this.mapService.connectToMap(this);

    const scope = this;
    this.initializeMap().then(mapView => {

      mapView.map.when(() => {

         const layerURLMantenimientos = mapView.map.allLayers.find((layer) => {

           return layer.url === scope.layerMantenimientos.url;
         });

         // Simbologia web map
         // scope.controlLeyenda.layerInfos.push({layer: layerURLMantenimientos, title: 'Gestión  UMV'});

         layerURLMantenimientos.opacity = 0.55;
         // layerURLMantenimientos.listMode = 'hide';
         layerURLMantenimientos.title = ' ';
         layerURLMantenimientos.minScale = 30000;
         mapView.map.layers.push(scope.layerSeleccionEspacial);
         mapView.map.layers.push(scope.GroupLayerGestion);
         mapView.map.layers.push(scope.groupLayerGestionAmbiental);
         mapView.map.layers.push(scope.groupLayerTableroControl);
         mapView.map.layers.push(scope.pksPuntosControlEscala);
         mapView.map.layers.push(scope.layerResultadosConsulta);
         mapView.map.layers.push(scope.routeLayer);
         mapView.map.layers.push(scope.stopLayer);
         mapView.map.load();
      });



      this._mapaInicializado = true;
      this._mapaInicializadoSubject.next(this._mapaInicializado);
      const nombreLayerTableroControl = [];
      this.groupLayerTableroControl.layers.forEach(layerTableroControl => {
        nombreLayerTableroControl.push(layerTableroControl.title);
      });
      nombreLayerTableroControl.push(this.layerMantenimientos.title);
      this.mapService.setNobresCapasTableroControl(nombreLayerTableroControl);
      // Control del evento click sobre el mapView
      mapView.on('click', (event: any) => {

          if (event.x) {
            const punto = {
              x: event.x,
              y: event.y
            };
            const puntoMapa = event.mapPoint;
            if (this.activarRuteo === true) {
              if (this.titleCalcularRuta === this.constants.puntoFinal && this.ruteoVisibleBtn === false &&
                  this.arrayCentroidStartEnd.length === 1) {
                this.arrayCentroidStartEnd.push(puntoMapa);
                this.adicionarParada(puntoMapa);
                this.seleccionarPkRuteo = false;
                if (this.arrayCentroide.length >= 1 && this.arrayCentroidStartEnd.length > 1) {
                  this.ruteoMantenimientos(this.arrayCentroide);
                }
              }
              if (this.titleCalcularRuta === this.constants.puntoInicial && this.ruteoVisibleBtn === false) {
                this.titleCalcularRuta = this.constants.puntoFinal;
                this.ruteoVisibleBtn = true;
                this.arrayCentroidStartEnd.push(puntoMapa);
                this.seleccionarPkRuteo = false;
                this.adicionarParada(puntoMapa);
              }
            }

            mapView.hitTest(punto).then((response: any) => {
              if (response.results.length && this.activarSeleccion === true) {
                if (response.results[0].graphic.layer.title !== 'Consulta Gestión UMV' &&
                    response.results[0].graphic.sourceLayer.title !== 'mantenimientos search') {
                  const pk = response.results[0].graphic.attributes['PK_ID_CALZADA'];
                  if (this.activarSeleccionInventarioAmbiental !== true) {
                    if (this.seleccionMasiva) {
                      if (this.activarRuteo === true) {
                          if (this._PKSeleccionados.includes(pk) || this._PKSeleccionados.includes(pk + '')) {
                            this.eliminarCentroidePK(pk);
                          }
                          if (scope.seleccionarPkRuteo) {
                            scope.adicionarPKSeleccionado(pk);
                          } else {
                            this.seleccionarPkRuteo = true;
                          }
                      } else {
                        scope.adicionarPKSeleccionado(pk); }
                    } else {
                      scope.seleccionarPK(pk);
                    }
                  } else {
                    if (response.results[0].graphic.layer.title === 'Censo Arbol' ||
                        response.results[0].graphic.layer.title === 'Censo Arbol') { ///
                          scope.adicionarElementoGeoSeleccionado(response.results[0].graphic);
                    }
                    if (response.results[0].graphic.layer.title === 'Sumideros Alcantarillado' ||
                        response.results[0].graphic.layer.title === 'Sumideros Alcantarillado') { /// verif
                          scope.adicionarElementoGeoSeleccionado(response.results[0].graphic);
                    }
                    if (response.results[0].graphic.layer.title === 'Sumideros Pluviales' ||
                        response.results[0].graphic.layer.title === 'Sumideros Pluviales') { ///
                          scope.adicionarElementoGeoSeleccionado(response.results[0].graphic);
                    }
                    if (response.results[0].graphic.layer.title === 'Plazas' ||
                        response.results[0].graphic.layer.title === 'Plazas') { ///
                          scope.adicionarElementoGeoSeleccionado(response.results[0].graphic);
                    }
                    if (response.results[0].graphic.layer.title === 'Pompeyano' ||
                        response.results[0].graphic.layer.title === 'Pompeyano') { ///
                          scope.adicionarElementoGeoSeleccionado(response.results[0].graphic);
                    }
                    if (response.results[0].graphic.layer.title === 'Gestión UMV - Censo' ||
                        response.results[0].graphic.layer.title === 'Gestión UMV - Censo') { ///
                          scope.adicionarElementoGeoSeleccionado(response.results[0].graphic);
                    }

                  }
                }
              }
            });
          }
      });

      // mapView.popup.visibleElements.featureNavigation = false;
      // mapView.popup.featureNavigationEnabled = false;

      mapView.popup.on('trigger-action', ((event) => {
        if (event.action.id === 'ver-registro') {
          if (this.layerMantenimientos.definitionExpression !== '') {
            this.layerMantenimientos.definitionExpression = this.definitionExpressionOriginal;
          }
          // const pkPupup = event.target.content.graphic.attributes['PK_ID_CALZADA'].toString();
          const pkPupup = mapView.popup.selectedFeature.attributes['PK_ID_CALZADA'].toString();
          this._filtrarPk = pkPupup;
          this._filtrarPkSubject.next(this._filtrarPk);
          if (this.layerMantenimientos.definitionExpression !== '') {
            this.layerMantenimientos.definitionExpression =
              this.layerMantenimientos.definitionExpression + ' AND PK_ID_CALZADA = \'' + this._filtrarPk + '\'';
          } else {
            this.layerMantenimientos.definitionExpression = 'PK_ID_CALZADA = \'' + this._filtrarPk + '\'';
          }
        }

        if (event.action.id === 'filter-pks') {
            const itemsGraphicsSearch = this.layerResultadosSearch.graphics.items[0];
            let attributesSearch = '';
            if (this.layerMantenimientos.definitionExpression !== '') {
              let sqlExpresionSearchModified = this.definitionExpressionOriginal;

              if (sqlExpresionSearchModified.indexOf('ID_LOCALIDAD') !== -1) {
                const posicion = sqlExpresionSearchModified.indexOf('ID_LOCALIDAD');
                if (posicion === 0) {
                  sqlExpresionSearchModified = sqlExpresionSearchModified.slice(23);
                } else {
                  sqlExpresionSearchModified =
                   sqlExpresionSearchModified.slice(0, posicion) + sqlExpresionSearchModified.slice(posicion + 19);
                }
                this.definitionExpressionOriginal = sqlExpresionSearchModified;
              }

              if (sqlExpresionSearchModified.indexOf('ID_BARRIO') !== -1) {
                const posicion = sqlExpresionSearchModified.indexOf('ID_BARRIO');
                if (posicion === 0) {
                  sqlExpresionSearchModified = sqlExpresionSearchModified.slice(20);
                } else {
                  sqlExpresionSearchModified =
                   sqlExpresionSearchModified.slice(0, posicion) + sqlExpresionSearchModified.slice(posicion + 16);
                }
                this.definitionExpressionOriginal = sqlExpresionSearchModified;
              }

              if (sqlExpresionSearchModified.indexOf('ID_ZONA') !== -1) {
                const posicion = sqlExpresionSearchModified.indexOf('ID_ZONA');
                if (posicion === 0) {
                  sqlExpresionSearchModified = sqlExpresionSearchModified.slice(18);
                } else {
                  sqlExpresionSearchModified =
                   sqlExpresionSearchModified.slice(0, posicion) + sqlExpresionSearchModified.slice(posicion + 14);
                }
                this.definitionExpressionOriginal = sqlExpresionSearchModified;
              }

              if (sqlExpresionSearchModified.indexOf('ID_UPLA') !== -1) {
                const posicion = sqlExpresionSearchModified.indexOf('ID_UPLA');
                if (posicion === 0) {
                  sqlExpresionSearchModified = sqlExpresionSearchModified.slice(18);
                } else {
                  sqlExpresionSearchModified =
                   sqlExpresionSearchModified.slice(0, posicion) + sqlExpresionSearchModified.slice(posicion + 14);
                }
                this.definitionExpressionOriginal = sqlExpresionSearchModified;
              }

              if (sqlExpresionSearchModified.indexOf('ID_CUADRANTE') !== -1) {
                const posicion = sqlExpresionSearchModified.indexOf('ID_CUADRANTE');
                if (posicion === 0) {
                  sqlExpresionSearchModified = sqlExpresionSearchModified.slice(22);
                } else {
                  sqlExpresionSearchModified =
                   sqlExpresionSearchModified.slice(0, posicion) + sqlExpresionSearchModified.slice(posicion + 18);
                }
                this.definitionExpressionOriginal = sqlExpresionSearchModified;
              }

              this.layerMantenimientos.definitionExpression = this.definitionExpressionOriginal;
            }
            let union = '';
            if (this.search.activeSource.name === 'Barrios') {
              if (this.layerMantenimientos.definitionExpression !== '') {
                union = ' AND';
              }
              attributesSearch = itemsGraphicsSearch.attributes['SCANOMBRE'];
              this.layerMantenimientos.definitionExpression =
               this.layerMantenimientos.definitionExpression + union + ' NOM_SECTOR = \'' + attributesSearch + '\'';
            } else if (this.search.activeSource.name === 'Localidades') {
              if (this.layerMantenimientos.definitionExpression !== '') {
                union = ' AND';
              }
              attributesSearch = itemsGraphicsSearch.attributes['LOCNOMBRE'];
              this.layerMantenimientos.definitionExpression =
               this.layerMantenimientos.definitionExpression + union + ' NOM_LOCALIDAD = \'' + attributesSearch + '\'';
            } else if (this.search.activeSource.name === 'Zonas') {
              if (this.layerMantenimientos.definitionExpression !== '') {
                union = ' AND';
              }
              attributesSearch = itemsGraphicsSearch.attributes['COD_ZONA'];
              this.layerMantenimientos.definitionExpression =
              this.layerMantenimientos.definitionExpression + union + ' NOM_ZONA = \'Zona_' + attributesSearch + '\'';
            } else if (this.search.activeSource.name === 'UPZs') {
              if (this.layerMantenimientos.definitionExpression !== '') {
                union = ' AND';
              }
              attributesSearch = itemsGraphicsSearch.attributes['UPLNOMBRE'];
              this.layerMantenimientos.definitionExpression =
              this.layerMantenimientos.definitionExpression + union + ' NOM_UPL = \'' + attributesSearch + '\'';
            }

            this.filtroUbicaciones(this.search.activeSource.name, attributesSearch);

            this.zoomQuerylocalizar(this.layerMantenimientos.definitionExpression);
            this.layerResultadosSearch.removeAll();
            this.layerMantenimientos.refresh();

        }
      }));

      this.search.on('search-complete', (event) => {
        this.layerResultadosSearch.removeAll();
        if (event.results[0].results[0].feature.layer !== null) {
          const grafic_search = event.results[0].results[0].feature;

          if (event.results[0].results[0].feature.layer.url === scope.layerMantenimientos.url) {
            grafic_search.symbol = {type: 'simple-fill', width: 3, color: [57, 255, 20, 0], outline: { style: 'none' }};
          } else {
            grafic_search.symbol = {type: 'simple-fill', width: 3, color: [57, 255, 20, 0.2],
              outline: { color: '#39FF14', width: 3 }};
          }
          this.layerResultadosSearch.add(grafic_search);
        }
      });

    });
  }


  filtroUbicaciones(ubicacion: string, nombre: string) {
    if (ubicacion === 'Zonas') {
      nombre = 'ZONA ' + nombre;
    }
    const filterBy = {
      ubicacion: ubicacion,
      nombre: nombre
    };
    this._filtrarUbicacionesSubject.next(filterBy);
  }

  /**
   * Método encargado de gestionar la selección del pk en el mapa
   *
   * @param pk PK de mantenimiento a seleccionar
   **/
  public seleccionarPK(pk: string) {
    if (pk) {
      const scope = this;
      this._PKSeleccionado = pk;
      this._PKSeleccionadoSubject.next(this._PKSeleccionado);

      const sql = 'PK_ID_CALZADA IN (' + this._PKSeleccionado + ')';
      const query = this.layerMantenimientos.createQuery();
      query.where = sql;
      scope.layerMantenimientos.queryFeatures(query).then(results => {
        scope.mostrarElementosSeleccionados(results);
      }).catch(err => console.log(err));
    }
  }

  /**
   * Inicialización del mapa
   */
  async initializeMap() {

    // Cargue de los modulos de ArcGis
    const [EsriMap, EsriMapView, FeatureLayer, Fullscreen, Search, Home,
      TileLayer, GraphicsLayer, EsriBasemap, LayerList, ExpandW,
      BasemapGallery, Legend, Sketch, Locate, GroupLayer, EsriWebMap, watchUtils] = await loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/layers/FeatureLayer',
        'esri/widgets/Fullscreen',
        'esri/widgets/Search',
        'esri/widgets/Home',
        'esri/layers/TileLayer',
        'esri/layers/GraphicsLayer',
        'esri/Basemap',
        'esri/widgets/LayerList',
        'esri/widgets/Expand',
        'esri/widgets/BasemapGallery',
        'esri/widgets/Legend',
        'esri/widgets/Sketch',
        'esri/widgets/Locate',
        'esri/layers/GroupLayer',
        'esri/WebMap',
        'esri/core/watchUtils',
      ]);


    let webMapId = '';

    if (CAPAS.visor_mapa.basemap === 'ideca') {
      if (typeof this.mapService.nomOtrasCapas.find(element => element === 'baseMapIdeca') === 'undefined') {
          // webMapId = '1b50abcfafc8498b93a5c2735bccdafd'; // WebMap UMV NO USAR
          // webMapId = 'a053957c357242a89029aa7482cc2f1c'; // Principal WebMap Ito SIGMA_ITO_PROD uaermv.maps.arcgis
          // webMapId = '9bc92d94b4fe4bc38aa77f041086d0fe'; // Principal WebMap Ito GEO_GESTION_UMV_EXT1 uaermv.maps.arcgis
          // webMapId = 'a307c01735f94699811ceae3d63047e6'; // Principal WebMap Ito GEO_GESTION_UMV_PARALELO uaermv.maps.arcgis
          // webMapId = '584735b72568472f894d9516ccb0d592'; // Principal WebMap Ito PRUEBA_PRODUCCION_UMV uaermv.maps.arcgis
          // generar nuevo PRUEBA_PRODUCCION_UMV
          // webMapId = 'f05d48263bd84c9389c6351ab381aed0'; // Principal WebMap Ito GESTION_TEST_ITO uaermv.maps.arcgis
          // webMapId = '230081311f0a4605bd097b1aa14c0064'; // Principal WebMap Ito SIGMA_ITO_DEV uaermv.maps.arcgis
          // webMapId = 'f1a4f3ef018f4e5a87f967fe13d9e86b'; // Principal WebMap Ito GESTION_UMV_JBOSS_ITO uaermv.maps.arcgis
          webMapId = CAPAS.visor_mapa.servicios.webMapIdPrincipal;

      }

    } else {

      // webMapId = '4ab4c1a529ce416b96cf01d54bffd63f'; // Alternativo WebMap Ito SIGMA_ITO_PROD uaermv.maps.arcgis
      // webMapId = '556695d4a541471591d2733779133701'; // Alternativo WebMap Ito GEO_GESTION_UMV_EXT1 uaermv.maps.arcgis
      // webMapId = '5b75677ad04345c596107c6ac43fd1f0'; // Alternativo WebMap Ito PRUEBA_PRODUCCION_UMV uaermv.maps.arcgis
      // webMapId = 'f2ab582236aa4c7d9d0de909348c546c'; // Alternativo WebMap Ito GEO_GESTION_UMV_PARALELO uaermv.maps.arcgis
      // webMapId = 'cefc6f104eae49ed9f33bc84f57075cd'; // Alternativo WebMap Ito GESTION_TEST_ITO uaermv.maps.arcgis
      // webMapId = '68190008f74c43c0928946066052033e'; // Alternativo WebMap Ito SIGMA_ITO_DEV uaermv.maps.arcgis
      // webMapId = '34bf6ffc7dc44c158281d61c41fa031f'; // Alternativo WebMap Ito GESTION_UMV_JBOSS_ITO uaermv.maps.arcgis
      webMapId = CAPAS.visor_mapa.servicios.webMapIdAlternativo;

    }

    const map: esri.Map = new EsriWebMap({
      portalItem: { id: webMapId},
    });

    // definición de las propiedades del MapView
    const mapViewProperties: esri.MapViewProperties = {
      container: this.mapViewEl.nativeElement,
      center: this.constants.mapa.center,
      zoom: this.constants.mapa.zoom,
      highlightOptions: { color: [0, 0, 0, 0], fillOpacity: 0.05 },
      map: map
    };

    // creación del objeto Mapview
    this.mapView = new EsriMapView(mapViewProperties);

    // Define acciones Pupup
    const filtrarRegistro = {
      title: 'Ver Registro',
      id: 'ver-registro',
      className: 'esri-icon-filter'
    };

    this.constants.popup_template.actions = [];
    const popup_template_dinamic =  this.constants.popup_template;
    popup_template_dinamic.actions.push(filtrarRegistro);

    // Definición de Layers
    this.layerMantenimientos = new FeatureLayer({
      url: CAPAS.visor_mapa.servicios.mantenimientos,
      outFields: ['PK_ID_CALZADA', 'CIV'],
      title: 'Gestión UMV',
      visible: true,
      popupTemplate: this.constants.popup_template,
      definitionExpression: '',
      opacity: 1,
      // renderer: this.constants.STYLE_SIG.rendererPk,
      renderer: this.constants.STYLE_SIG.rendererPk2, ////////////////////////////
      minScale: 20000,
      labelingInfo: {
        symbol: { type: 'text', color: 'black',
          font: { family: 'serif', size: 6, weight: 'bold' }
        },
        labelExpression: '.',
        maxScale: 0,
        minScale: 5000,
      },
    });

    const renderJoinEstadoPkActividadAgrupadaMod = this.constants.STYLE_SIG.renderJoinEstadoPkActividadAgrupada;

    renderJoinEstadoPkActividadAgrupadaMod.valueExpression = `
    var joinEstadoPkActividadAgrupada = $feature.ACTIVIDAD_AGRUPADA + \" \"+ $feature.DESCRIPCION_ESTADO_PK;
    return joinEstadoPkActividadAgrupada;
    `;

    this.layerJoinEstadoPkActividadAgrupada = new FeatureLayer({
      url: CAPAS.visor_mapa.servicios.mantenimientos,
      outFields: ['PK_ID_CALZADA', 'CIV'],
      title: 'Estado Pks y Actividad Agrupada',
      visible: false,
      popupTemplate: this.constants.popup_template,
      definitionExpression: '',
      opacity: 0.7,
      renderer: renderJoinEstadoPkActividadAgrupadaMod,
      minScale: 20000,
    });

    this.layerPKActividadAgrupada = new FeatureLayer({
      /// ACTIVIDAD_AGRUPADA
      url: CAPAS.visor_mapa.servicios.mantenimientos,
      outFields: ['PK_ID_CALZADA', 'CIV'],
      title: 'Actividad Agrupada - Gestion UMV',
      visible: false,
      popupTemplate: this.constants.popup_template,
      definitionExpression: '',
      opacity: 0.8,
      renderer: this.constants.STYLE_SIG.rendererPkActividadAgrupada,
      minScale: 20000,
    });

    this.layerPKAvanceEjecucionIntervencion = new FeatureLayer({
      /// PORCENTAJE_AVANCE_EJECUCION
      url: CAPAS.visor_mapa.servicios.mantenimientos,
      outFields: ['PK_ID_CALZADA', 'CIV'],
      title: 'Ejecución - Gestión UMV',
      visible: false,
      popupTemplate: this.constants.popup_template,
      definitionExpression: '',
      opacity: 0.8,
      renderer: this.constants.STYLE_SIG.rendererPkAvanceEjecucionIntervencion,
      minScale: 40000,
    });

    this.layerPKTipoPrograma = new FeatureLayer({
      /// TIPO_PROGRAMA_ID
      url: CAPAS.visor_mapa.servicios.mantenimientos,
      outFields: ['PK_ID_CALZADA', 'CIV'],
      title: 'Tipo Programa - Gestión UMV',
      visible: false,
      popupTemplate: this.constants.popup_template,
      definitionExpression: '',
      opacity: 0.8,
      renderer: this.constants.STYLE_SIG.rendererPkTipoPrograma,
      minScale: 40000,
    });

    const rendererPKProgramacionPeriodicaMod = this.constants.STYLE_SIG.rendererPKProgramacionPeriodica;

    rendererPKProgramacionPeriodicaMod.valueExpression = `
    var programacion = $feature.TIENE_PROG_PERIODICA;
    var pkProgramacion = When(IsEmpty(programacion),0,1);
    return pkProgramacion;
    `;

    this.layerPKProgramacionPeriodica = new FeatureLayer({
      /// PROGRAMACION_PERIODICA_ID
      url: CAPAS.visor_mapa.servicios.mantenimientos,
      outFields: ['PK_ID_CALZADA', 'CIV'],
      title: 'PK Programación Periodica',
      visible: false,
      popupTemplate: this.constants.popup_template,
      definitionExpression: '',
      opacity: 1,
      renderer: rendererPKProgramacionPeriodicaMod,
      minScale: 40000,
    });

    this.layerEjecucionTerminados = new FeatureLayer({
      /// VALOR_ESTADO_PK
      url: CAPAS.visor_mapa.servicios.mantenimientos,
      outFields: ['PK_ID_CALZADA', 'CIV'],
      title: 'Pks Ejecución y Terminados',
      visible: false,
      popupTemplate: this.constants.popup_template,
      definitionExpression: '',
      opacity: 1,
      renderer: this.constants.STYLE_SIG.rendererEjecucionTerminados,
      minScale: 40000,
    });

    this.layerEstrategiaIntervencion = new FeatureLayer({
      /// VALOR_TIPO_ESTRATEGIA
      url: CAPAS.visor_mapa.servicios.mantenimientos,
      outFields: ['PK_ID_CALZADA', 'CIV'],
      title: 'Estrategia Intervencion',
      visible: false,
      popupTemplate: this.constants.popup_template,
      definitionExpression: '',
      opacity: 1,
      renderer: this.constants.STYLE_SIG.rendererPkEstrategiaIntervencion,
      minScale: 40000,
    });

    this.layerConsultaMantenimientos = new FeatureLayer({
      url: CAPAS.visor_mapa.servicios.mantenimientos,
      outFields: ['*'],
      title: 'Consulta Gestión UMV',
      visible: false,
      popupTemplate: this.constants.popup_template,
      definitionExpression: '',
      opacity: 0.8,
      renderer: this.constants.STYLE_SIG.rendererPk,
      minScale: 20000,
    });

    this.layerResultadosConsulta = new GraphicsLayer({
      title: 'PKs Seleccionados',
      popupTemplate: this.constants.popup_template
    });

    this.layerResultadosSearch = new GraphicsLayer({
      title: 'Resultados Search',
      listMode: 'hide',
    });

    const labelClassLocalidad = {
      symbol: { type: 'text', color: 'black', haloColor: 'black' },
      labelExpressionInfo: { expression: '$feature.LOCNOMBRE' }
    };

    const labelClassZona = {
      symbol: { type: 'text', color: 'black', haloColor: 'black', font: {  size: 18, family: 'Josefin Slab', weight: 'bold'} },
      labelExpressionInfo: { expression: '"Zona " + $feature.COD_ZONA' }
    };

    const layerZonas = new FeatureLayer({
      url: CAPAS.visor_mapa.servicios.zonas,
      title: 'Zonas',

      labelingInfo: [labelClassZona],
      renderer: this.constants.STYLE_SIG.rendererZona,

      popupTemplate: this.constants.popup_template_Zona1,
      maxScale: 250,
      minScale: 1000000,
      opacity: 0.5,
      visible: false
    });

    const layerLocalidad = new FeatureLayer({
      url: CAPAS.visor_mapa.servicios.localidad,
      title: 'Localidades',
      labelingInfo: [labelClassLocalidad],
      renderer: this.constants.STYLE_SIG.rendererLocalidad,
      popupTemplate: this.constants.popup_template_Localidad,
      maxScale: 250,
      minScale: 100000,
      opacity: 0.2,
      visible: false
    });

    const labelClassBarrio = {
      symbol: { type: 'text', color: '#6B0058', haloColor: 'black' },
      labelExpressionInfo: { expression: '$feature.SCANOMBRE' }
    };

    const layerBarrio = new FeatureLayer({
      url: CAPAS.visor_mapa.servicios.barrio,
      title: 'Barrios',
      labelingInfo: [labelClassBarrio],
      renderer: this.constants.STYLE_SIG.rendererBarrio,
      popupTemplate: this.constants.popup_template_Barrio,
      maxScale: 250,
      minScale: 100000,
      opacity: 0.3,
      visible: false
    });

    const layerCuadrantes = new FeatureLayer({
      url: CAPAS.visor_mapa.servicios.cuadrantes,
      title: 'Cuadrantes',
      labelingInfo: [this.constants.STYLE_SIG.labelClassCuadrantes],
      renderer: this.constants.STYLE_SIG.rendererCuadrantes,
      popupTemplate: this.constants.popup_template_Cuadrantes,
      maxScale: 250,
      minScale: 100000,
      opacity: 0.4,
      visible: false
    });

    const layerUPZ = new FeatureLayer({
      url: CAPAS.visor_mapa.servicios.upla,
      title: 'UPZ',
      labelingInfo: [this.constants.STYLE_SIG.labelUPLA2],
      renderer: this.constants.STYLE_SIG.rendererUPLA2,
      popupTemplate: this.constants.popup_template_UPLA2,
      maxScale: 250,
      minScale: 400000,
      opacity: 0.6,
      visible: false
    });


    this.GroupLayerGestion = new GroupLayer({
      title: 'Gestión UMV',
      visible: true,
      visibilityMode: 'exclusive',
      layers: [this.layerMantenimientos, this.layerConsultaMantenimientos],
      opacity: 0.85
    });


    this.groupLayerTableroControl = new GroupLayer({
      title: 'Tablero Control Intervención',
      visible: false,
      listMode: 'hide',
      layers: [this.layerEstrategiaIntervencion, this.layerEjecucionTerminados, this.layerPKProgramacionPeriodica,
          this.layerJoinEstadoPkActividadAgrupada, this.layerPKActividadAgrupada, this.layerPKAvanceEjecucionIntervencion,
          this.layerPKTipoPrograma],
      opacity: 0.95
    });

    this.layerSeleccionEspacial = new GraphicsLayer({ title: 'Selección Espacial', listMode: 'hide' });
    this.routeLayer = new GraphicsLayer({
      title: 'Ruta'
    });
    this.stopLayer = new GraphicsLayer({
      listMode: 'hide',
    });

    this.pksPuntosControlEscala = new GraphicsLayer({
      listMode: 'hide',
    });

    let featuresStop = [{ geometry: { type: 'point', x: -100, y: 38 }, attributes: { ObjectID: 1, typeStartEnd: 'Inicio'}}];

    const stopFeatureLayer = new FeatureLayer({
      source: featuresStop,
      visible: true,
      objectIdField: 'ObjectID',
      listMode: 'hide',
      renderer: this.constants.STYLE_SIG.rendererStopFeatureLayer,
    });

    this.layerCensoArbolado = new FeatureLayer({
      url: CAPAS.capas_ambientales_externas.censoArbolado.url,
      outFields: ['*'],
      title: 'Censo Arbol',
      visible: false,
      popupTemplate: this.constants.popup_template_CensoArbolado,
      definitionExpression: '',
      opacity: 0.9,
      minScale: 10000,
    });

    this.layerCensoSumiderosEAABAlcantarillado = new FeatureLayer({
      url: CAPAS.capas_ambientales_externas.censoSumiderosAlcantarillado.url,
      outFields: ['*'],
      title: 'Sumideros Alcantarillado',
      visible: false,
      popupTemplate: this.constants.popup_template_CensoSumideros,
      definitionExpression: '',
      opacity: 0.9,
      minScale: 10000,
    });

    this.layerCensoSumiderosEAABPluvial = new FeatureLayer({
      url: CAPAS.capas_ambientales_externas.censoSumiderosPluvial.url,
      outFields: ['*'],
      title: 'Sumideros Pluviales',
      visible: false,
      popupTemplate: this.constants.popup_template_CensoSumiderosPluvial,
      definitionExpression: '',
      opacity: 0.9,
      minScale: 10000,
    });

    this.layerCensoPlazasEspacioPublicoIDUPlaza = new FeatureLayer({
      url: CAPAS.capas_ambientales_externas.espacioPublicoIDUPlaza.url,
      outFields: ['*'],
      title: 'Plazas',
      visible: false,
      popupTemplate: this.constants.popup_template_CensoEP_IDUPlazas,
      definitionExpression: '',
      opacity: 0.9,
      minScale: 30000,
    });

    this.layerCensoPlazasEspacioPublicoIDUPompeyano = new FeatureLayer({
      url: CAPAS.capas_ambientales_externas.espacioPublicoIDUPompeyano.url,
      outFields: ['*'],
      title: 'Pompeyano',
      visible: false,
      popupTemplate: this.constants.popup_template_CensoEP_IDUPompeyano,
      definitionExpression: '',
      opacity: 0.9,
      minScale: 30000,
      renderer: this.constants.STYLE_SIG.rendererPompeyano,
    });

    this.layercensoPublicoIDU = new FeatureLayer({
      url: CAPAS.visor_mapa.servicios.mantenimientos,
      outFields: ['PK_ID_CALZADA', 'CIV', 'DESCRIPCION_ELEMENTO'],
      title: 'Gestión UMV - Censo',
      visible: false,
      popupTemplate: this.constants.popup_template,
      definitionExpression: '',
      opacity: 0.7,
      renderer: this.constants.STYLE_SIG.rendererPk,
      minScale: 20000,
    });

    this.layerResultadosAmbiental = new GraphicsLayer({
      listMode: 'hide',
      title: 'Seleccionados Ambiental',
      visible: true
    });

    this.groupLayerGestionAmbiental = new GroupLayer({
      title: 'Inventario Ambiental',
      visible: true,
      visibilityMode: 'independent',
      listMode: 'hide',
      layers: [],
      opacity: 0.9
    });

    if (typeof this.errorRespuestasUrl.find(element =>
      element === CAPAS.capas_ambientales_externas.censoArbolado.nombre) === 'undefined') {
        this.groupLayerGestionAmbiental.layers.push(this.layerCensoArbolado); }
    if (typeof this.errorRespuestasUrl.find(element =>
      element === CAPAS.capas_ambientales_externas.censoSumiderosAlcantarillado.nombre) === 'undefined') {
        this.groupLayerGestionAmbiental.layers.push(this.layerCensoSumiderosEAABAlcantarillado); }
    if (typeof this.errorRespuestasUrl.find(element =>
      element === CAPAS.capas_ambientales_externas.censoSumiderosPluvial.nombre) === 'undefined') {
        this.groupLayerGestionAmbiental.layers.push(this.layerCensoSumiderosEAABPluvial); }
    if (typeof this.errorRespuestasUrl.find(element =>
      element === CAPAS.capas_ambientales_externas.espacioPublicoIDUPlaza.nombre) === 'undefined') {
        this.groupLayerGestionAmbiental.layers.push(this.layerCensoPlazasEspacioPublicoIDUPlaza); }
    if (typeof this.errorRespuestasUrl.find(element =>
      element === CAPAS.capas_ambientales_externas.espacioPublicoIDUPompeyano.nombre) === 'undefined') {
        this.groupLayerGestionAmbiental.layers.push(this.layerCensoPlazasEspacioPublicoIDUPompeyano); }
    if (typeof this.errorRespuestasUrl.find(element =>
      element === CAPAS.capas_ambientales_externas.censoPublicoIDU.nombre) === 'undefined') {
        this.groupLayerGestionAmbiental.layers.push(this.layercensoPublicoIDU); }
    this.groupLayerGestionAmbiental.layers.push(this.layerResultadosAmbiental);

    // Adición de layers al Map
    map.add(layerBarrio);
    map.add(layerUPZ);
    map.add(layerCuadrantes);
    map.add(layerLocalidad);
    map.add(layerZonas);
    map.add(stopFeatureLayer);

    map.add(this.layerResultadosSearch);

    const controlHomeView = new Home({
      view: this.mapView
    });

    const controlFullscreen = new Fullscreen({
      view: this.mapView
    });

    const controlBasemapGallery = new BasemapGallery({
      view: this.mapView
    });

    const controlListadoLayers = new LayerList({
      container: document.createElement('div'),
      view: this.mapView,
      // listItemCreatedFunction: defineActions
    });

    const controlListadoLayersExpand = new ExpandW({
      expandIconClass: 'esri-icon-layers',
      view: this.mapView,
      content: controlListadoLayers.domNode,
      expandTooltip: 'Expandir Listado de Capas',
    });

    const controlBaseMapExpand = new ExpandW({
      expandIconClass: 'esri-icon-basemap',
      view: this.mapView,
      content: controlBasemapGallery,
      expandTooltip: 'Expandir Galeria de Mapas Base',
    });

    this.controlLeyenda = new Legend({
      view: this.mapView,
      container: document.createElement('div'),
      layerInfos: [
        {
          layer: this.layerPKTipoPrograma, title: 'Tipo Programa - Gestión UMV'
        }, {
          layer: this.layerPKAvanceEjecucionIntervencion, title: 'Ejecución - Gestión UMV'
        }, {
          layer: this.layerPKActividadAgrupada, title: 'Actividad Agrupada - Gestión UMV'
        }, {
          layer: this.layerPKProgramacionPeriodica, title: 'PK Programacion Periódica'
        }, {
          layer: this.layerEjecucionTerminados, title: 'Estado de Ejecución'
        }, {
          layer: this.layerEstrategiaIntervencion, title: 'Estrategia de Intervención',
        }, {
          layer: this.layerMantenimientos, title: 'Gestión UMV'
        }, {
          layer: this.layerConsultaMantenimientos, title: 'Consulta Gestión UMV'
        }, {
          layer: this.layerJoinEstadoPkActividadAgrupada, title: 'Estado Pks y Actividad Agrupada'
        }, {
          layer: stopFeatureLayer, title: 'Paradas Ruta'
        }
      ]
    });

    const controlLeyendaExpand = new ExpandW({
      content: this.controlLeyenda.domNode,
      view: this.mapView,
      expandIconClass: 'esri-icon-layer-list',
      expandTooltip: 'Expandir Leyenda',
    });

    const controlPosicionActual = new Locate({
      view: this.mapView
    });

    this.sketchSpatialSelection = new Sketch({
      layer: this.layerSeleccionEspacial,
      view: this.mapView,
    });

    this.sketchSpatialSelection.on('create', ((event) => {
      if (event.state === 'complete') {
        this.seleccionarEspacialmente(event.graphic.geometry);
      }
    }));

    this.controlSpatialSelectionLeyendaExpand = new ExpandW({
      content: this.sketchSpatialSelection,
      view: this.mapView,
      expandIconClass: 'esri-icon-expand',
      expandTooltip: 'Expandir Selección Espacial Masiva',
    });

    const filterActions = [{
      title: 'Filtrar PKs',
      id: 'filter-pks',
      className: 'esri-icon-filter'
    }];

    this.search = new Search({
      view: this.mapView,
      allPlaceholder: 'Buscar ubicación',
      sources: [{
        layer: new FeatureLayer ({
          url: CAPAS.visor_mapa.servicios.mantenimientos,
          title: 'mantenimientos search',
          popupTemplate: this.constants.popup_template,
        }),
        resultGraphicEnabled: false,
        searchFields: ['PK_ID_CALZADA', 'CIV'],
        suggestionTemplate: '{PK_ID_CALZADA}',
        displayField: 'PK_ID_CALZADA',
        exactMatch: false,
        outFields: ['*'],
        name: 'Calzadas',
        placeholder: 'Buscar PK',
      }, {
        layer: new FeatureLayer ({
          url: CAPAS.visor_mapa.servicios.localidad,
          popupTemplate: { title: 'Localidad: {LOCNOMBRE}',
            actions: filterActions,
            content: [this.constants.content_popup_template_Localidad],
          }
        }),
        searchFields: ['LOCNOMBRE', 'LOCCODIGO'],
        suggestionTemplate: '{LOCCODIGO}: {LOCNOMBRE}',
        displayField: 'LOCNOMBRE',
        exactMatch: false,
        outFields: ['*'],
        name: 'Localidades',
        placeholder: 'Buscar Localidad',
      }, {
        layer: new FeatureLayer ({
          url: CAPAS.visor_mapa.servicios.barrio,
          popupTemplate: {
            title: 'Sector: {nombre}',
            actions: filterActions,
            content: [this.constants.content_popup_template_Barrio]
          }
        }),

        searchFields: ['SCANOMBRE', 'SCACODIGO'],
        suggestionTemplate: '{SCANOMBRE}',
        displayField: 'SCANOMBRE',
        exactMatch: false,
        outFields: ['*'],
        name: 'Barrios',
        placeholder: 'Buscar Barrio',
      }, {
        layer: new FeatureLayer ({
          url: CAPAS.visor_mapa.servicios.zonas,
          popupTemplate: {
            title: 'Zona: {COD_ZONA}',
            actions: filterActions,
            content: this.constants.popup_template_Zona1.content,
          }
        }),
        searchFields: ['COD_ZONA'],
        suggestionTemplate: 'Zona: {COD_ZONA}',
        displayField: 'COD_ZONA',
        exactMatch: false,
        outFields: ['*'],
        name: 'Zonas',
        placeholder: 'Buscar Zona',
      }, {
        layer: new FeatureLayer ({
          url: CAPAS.visor_mapa.servicios.upla,
          popupTemplate: {
            title: 'UPZ: {UPLCODIGO}',
            actions: filterActions,
            content: this.constants.popup_template_UPLA2.content,
          }
        }),
        searchFields: ['UPLNOMBRE', 'UPLCODIGO'],
        suggestionTemplate: '{UPLCODIGO}: {UPLNOMBRE}',
        displayField: 'UPLNOMBRE',
        exactMatch: false,
        outFields: ['*'],
        name: 'UPZs',
        placeholder: 'Buscar UPZ',
      }
      ]
    });

    // Adición de controles al MapView
    this.mapView.ui.add(this.search, 'top-right');
    this.mapView.ui.add(controlHomeView, 'top-left');
    this.mapView.ui.add(controlFullscreen, 'bottom-left');
    this.mapView.ui.add(controlListadoLayersExpand, 'bottom-right');
    this.mapView.ui.add(controlBaseMapExpand, 'top-right');
    this.mapView.ui.add(controlLeyendaExpand, 'bottom-left');
    this.mapView.ui.add(controlPosicionActual, 'top-left');

    watchUtils.whenTrue(this.mapView, 'stationary', async () => {
      if (this.mapView && this.mapView.extent && this.layerMantenimientos) {
        if (this.mapView.zoom < 15) {
          this.layerMantenimientos.renderer = this.constants.STYLE_SIG.rendererPk3;
          this.layerMantenimientos.refresh();
          this.pksPuntosControlEscala.visible = true;
        } else {
          this.layerMantenimientos.renderer = this.constants.STYLE_SIG.rendererPk2;
          await this.layerMantenimientos.refresh();
          this.pksPuntosControlEscala.visible = false;
        }
      }
    });

    return this.mapView;
  }

  /**
   * Método encargado de devolver la capa principal del mapa
   * Gestion UMV
   */
  public getLayerPrincipal(): any {
    return this.layerMantenimientos;
  }

  /** Método encargado de elimimar del centroide de los pk
   * para el calculo del ruteo
   * @param pk PK Seleccionado a eliminar
   */
  public eliminarCentroidePK(pk: any) {
    if (typeof pk === 'number' || typeof pk === 'string') {
      const scope = this;
      let sql: string;
      sql = 'PK_ID_CALZADA = ' + pk.toString();
      const query = this.layerMantenimientos.createQuery();
      query.where = sql;
      scope.layerMantenimientos.queryFeatures(query).then(async results => {
          for (let index = 0; index < results.features.length; index++) {
            const graphic = results.features[index];
            let indexCentroid = [];
            await scope.arrayCentroide.forEach((centroide, indexC) => {
              if (centroide.x === graphic.geometry.centroid.x && centroide.y === graphic.geometry.centroid.y) {
                  indexCentroid.push(indexC);
              }
            });
            indexCentroid.sort((a, b) => b - a);
            await indexCentroid.forEach(indexCentros => {
              scope.arrayCentroide.splice(indexCentros, 1);
            });
            indexCentroid = [];
          }
          if (scope.arrayCentroide.length >= 1 && scope.arrayCentroidStartEnd.length === 2) {
            scope.ruteoMantenimientos(scope.arrayCentroide);
          } else if (this.arrayCentroide.length === 0) {
            scope.ruteoLimpiar();
            this._rutaEstimada = new RutaEstimada();
            this._rutaEstimada.recorrido = undefined;
            this._rutaEstimada.tiempo = undefined;
            this._rutaEstimadaSubject.next(this._rutaEstimada);
          }
      }).catch(err => console.log(err));
    }
  }

  /**
   * Método encargado de adicionar un pk seleccionado por el usuario al mapa
   * @param Adicionar Pk Seleccionado a adicionar en los que se muestran en el mapa
   **/
  public adicionarPKSeleccionado(pk: any) {
    const scope = this;
    if (this.inRouting === false || (this.inRouting === true && this.activarRuteo === true)) {
      if (!scope._PKSeleccionados.includes(pk) && !scope._PKSeleccionados.includes(pk + '')) {
        scope._PKSeleccionados.push(pk);
      } else {
        scope._PKSeleccionados.splice(scope._PKSeleccionados.indexOf(pk), 1);
      }
      scope._PKSeleccionadosSubject.next(scope._PKSeleccionados);
      let sql: string;
      if (scope._PKSeleccionados.length > 0) {
        sql = 'PK_ID_CALZADA IN (' + scope._PKSeleccionados.join(',') + ')';
      } else {
        sql = 'PK_ID_CALZADA IS NULL';
      }
      const query = this.layerMantenimientos.createQuery();
      query.where = sql;
      scope.layerMantenimientos.queryFeatures(query).then(results => {
        scope.mostrarElementosSeleccionados(results);
      }).catch(err => console.log(err));
    }
  }

  /**
   * Método encargado de adicionar elementos espaciales por el usuaria
   *
   * @param graficElemento Elemento Grafico seleccionado
   * tiene geometría, un símbolo y atributos
   */
  public async adicionarElementoGeoSeleccionado(graficElemento: esri.Graphic) {
    const scope = this;

    let sql: string;
    await this.configurarPreviaQueryAmbiental(this.nombreCapaActivaSeleccionable);

    sql = this.campoIdentificadorLayer;
    const valorIdentificadorId = graficElemento.attributes[this.campoIdentificadorLayer];
    const elementoEntidad = graficElemento.attributes;

    if (!this._idElementosSeleccionadosEntidades.includes(valorIdentificadorId)) {
      this._idElementosSeleccionadosEntidades.push(valorIdentificadorId);
      this._elementosSeleccionadosEntidades.push(elementoEntidad);
    } else {
      this._idElementosSeleccionadosEntidades.splice(this._idElementosSeleccionadosEntidades.indexOf(valorIdentificadorId), 1);
      this._elementosSeleccionadosEntidades.splice(this._elementosSeleccionadosEntidades.indexOf(elementoEntidad), 1);  // verificar
    }
    this._idElementosSeleccionadosEntidadesSubject.next(this._idElementosSeleccionadosEntidades);
    this._elementosSeleccionadosEntidadesSubject.next(this._elementosSeleccionadosEntidades);

    if (this._idElementosSeleccionadosEntidades.length > 0) {
      sql = sql + ' IN (\'' + this._idElementosSeleccionadosEntidades.join('\',\'') + '\')';
    } else {
      sql = sql + ' IS NULL';
    }
    const query = this.layerDinamico.createQuery();
    query.where = sql;
    scope.layerDinamico.queryFeatures(query).then(results => {
      scope.mostrarElementosGeoSeleccionados(results);
    }).catch(err => console.log(err));
  }

  /**
   * Método encargado de asignar los elementos geograficos selecionados al mapa
   *
   * @param idElementosSeleccionadosEntidades Id de elemento a adicionar
   **/
  public async setElementoGeoSeleccionados(idElementosSeleccionadosEntidades: string[]) {
    const scope = this;
    this._idElementosSeleccionadosEntidades = idElementosSeleccionadosEntidades;
    let sql: string;
    await this.configurarPreviaQueryAmbiental(this.nombreCapaActivaSeleccionable);

    sql = this.campoIdentificadorLayer;

    if (this._idElementosSeleccionadosEntidades.length > 0) {
      sql = sql + ' IN (\'' + this._idElementosSeleccionadosEntidades.join('\',\'') + '\')';
    } else {
      sql = sql + ' IS NULL';
    }
    const query = this.layerDinamico.createQuery();
    query.where = sql;
    scope.layerDinamico.queryFeatures(query).then(results => {
      scope.mostrarElementosGeoSeleccionados(results);
      results.features.forEach(feature => {
        const elementoEntidad = feature.attributes;
        if (elementoEntidad) {
          scope._elementosSeleccionadosEntidades.push(elementoEntidad);
          scope._elementosSeleccionadosEntidadesSubject.next(scope._elementosSeleccionadosEntidades);
        }
      });
    }).catch(err => console.log(err));
  }

  /** Método encargado de obtener el listado de pks seleccionados en el mapa */
  public getPKSeleccionados() {
    return this._PKSeleccionados;
  }
  /**
   * Método encargado de asignar los pks seleccionados al mapa
   *
   * @param pks Listado de pks que se van a actualizar
   */
  public setPKSeleccionados(pks: string[]) {
    const scope = this;
    this._PKSeleccionados = pks;
    let sql: string;
    if (this._PKSeleccionados.length > 0) {
      sql = 'PK_ID_CALZADA IN (' + this._PKSeleccionados.join(',') + ')';
    } else {
      sql = 'PK_ID_CALZADA IS NULL';
    }
    const query = this.layerMantenimientos.createQuery();
    query.where = sql;
    scope.layerMantenimientos.queryFeatures(query).then(results => {
      scope.mostrarElementosSeleccionados(results);
    }).catch(err => console.log(err));
  }

  /**
   * Método encargado de mostrar controles de selección multiple en el mapa
   */
  public mostrarControlesSeleccionMultiple() {
    if (this.mapView) {
      this.mapView.graphics.removeAll();
      this.mapView.ui.add(this.controlSpatialSelectionLeyendaExpand, 'top-right');
    }
  }

  /**
   * Método encargado de agregar controles de selección multiple al mapa
   */
  public agregarControlesSeleccionMultiple() {
    if (this.mapView) {
      // this.mapView.graphics.removeAll();
      this.mapView.ui.add(this.controlSpatialSelectionLeyendaExpand, 'top-right');
    }
  }

  /**
   * Método encargado de ocultar controles de selección multiple en el mapa
   */
  public ocultarControlesSeleccionMultiple() {
    if (this.mapView) {
      this.mapView.graphics.removeAll();
      this.mapView.ui.remove(this.controlSpatialSelectionLeyendaExpand, 'top-right');
    }
  }

  /**
   * Método encargado definir escala para visualización
   * de la capa Gestion UMV
   * @param minScale Escala minima de visualización
   */
  public definirEscalasVisualizacion(minScale: number) {
    if (this.layerMantenimientos) {
      this.layerMantenimientos.minScale = minScale;
      this.layerConsultaMantenimientos.minScale = minScale;
      this.layerMantenimientos.refresh();
    }
  }

  /**
   * Método encargado de mostrar el ruteo
   * y los botones para crealo en el mapa
   */
  public mostrarRuteo() {
      if (this.mapView) {
        this.mapView.graphics.removeAll();
        this.activarRuteo = true;
        this.layerMantenimientos.renderer = this.constants.STYLE_SIG.rendererOrigen;
        this.inRouting = true;
      } else {
        if (this.mapView === undefined) {
          const _this = this;
          setTimeout(function() {
            _this.mostrarRuteo();
          }, 1000 );
        }
      }
  }

  /**
   * Método encargado de ocultar el ruteo en el mapa
   */
  public ocultarRuteo() {
    if (this.mapView) {
      this.mapView.graphics.removeAll();
      this.layerMantenimientos.renderer = this.constants.STYLE_SIG.rendererPk2;
    }
    this.activarRuteo = false;
  }

  /**
   * Método encargado visualizar pk seleccionados en el mapa o en la grilla
   * @param results Resultados de la consulta a la capa Gestion UMV
   */
  public mostrarElementosSeleccionados(results: any) {
    if (this.layerResultadosConsulta) {
      this.layerResultadosConsulta.removeAll();
      this.search.activeSourceIndex = 1;
      this.search.searchTerm = '';
    }
    if (this.layerSeleccionEspacial) {
      this.layerSeleccionEspacial.removeAll();
    }
    let newExtent = null;

    for (let index = 0; index < results.features.length; index++) {

      const graphic = results.features[index];
      if (this.activarRuteo === true) {
        this.arrayCentroide.push(graphic.geometry.centroid);
      }

      graphic.symbol = {
        type: 'simple-fill', width: 2.5, color: [0, 0 , 0 , 0],
        outline: { color: '#2B65EC', width: 2.5 }
      };

      graphic.popupTemplate = {
        title: 'Calzada PK: {PK_ID_CALZADA} (Asignación)',
        content: [this.constants.popup_template.content[0]],
        actions: []
      };

      this.layerResultadosConsulta.add(graphic);
      if (newExtent == null) {
        newExtent = graphic.geometry.extent;
      } else {
        newExtent = newExtent.union(graphic.geometry.extent);
      }
    }

    if (this.arrayCentroide.length >= 1 && this.arrayCentroidStartEnd.length === 2) {
      this.ruteoMantenimientos(this.arrayCentroide);
    }
    if (newExtent && results.features.length === 1) {
      const extentClone = newExtent.clone();
      this.mapView.goTo(extentClone.expand(3));
    } else if (newExtent) {
      this.mapView.goTo(newExtent);
    }

  }

  /**
   * Método encargado visualizar elementos geograficos
   * seleccionados en el mapa
   * @param results Resultados de la consulta a la capa dinamica
   */
  public mostrarElementosGeoSeleccionados(results: any) {
    if (this.layerResultadosAmbiental) {
      this.layerResultadosAmbiental.removeAll();
    }
    let newExtent = null;

    for (let index = 0; index < results.features.length; index++) {
      const graphic = results.features[index];

      if (graphic.geometry.type === 'point') {
          graphic.symbol = {type: 'simple-marker', style: 'square', color: '#2B65EC', size: '8px',
          outline: { color: [ 255, 255, 0 ], width: 3 }};
      } else if (graphic.geometry.type === 'polyline') {
          graphic.symbol = { type: 'simple-line', color: '#2B65EC', width: '3px', style: 'short-dot' };
      } else if (graphic.geometry.type === 'polygon') {
          graphic.symbol = { type: 'simple-fill', width: 2.5, color: [0, 0 , 0 , 0],
          outline: { color: '#2B65EC', width: 2.5 }
        };
      }

      graphic.popupTemplate = {
        title: 'Identificador: {' + this.campoIdentificadorLayer + '}',
        content: [{
          type: 'fields',
          fieldInfos: this.popupTemplateDinamic.content[0].fieldInfos
        }],
        actions: []
      };

      this.layerResultadosAmbiental.add(graphic);
      if (newExtent == null) {
        newExtent = graphic.geometry.extent;
      } else {
        newExtent = newExtent.union(graphic.geometry.extent);
      }
    }

    if (newExtent && results.features.length === 1) {
      const extentClone = newExtent.clone();
      this.mapView.goTo(extentClone.expand(4));
    } else if (newExtent) {
      const extentClone = newExtent.clone();
      this.mapView.goTo(extentClone.expand(3));
    }

  }

  /**
   * Método encargado mostrar la ubicación
   * de pk localidados en el mapa
   * @param results Resultados de la consulta a la capa Gestion UMV
   */
  public mostrarElementosLocalizados(results: any) {

    if (results) {
      if (results.features.length > 0) {
        if (this.seleccionMasiva === false) {
          this.layerResultadosConsulta.removeAll();
        }
        let newExtent = null;
        for (let index = 0; index < results.features.length; index++) {
          const graphic = results.features[index];

          if (this.seleccionMasiva === false) {
            graphic.symbol = {
              type: 'simple-fill', width: 2.5, color: [0, 0 , 0 , 0],
              outline: { color: '#2B65EC', width: 2.5 }
            };

            graphic.popupTemplate = {
              title: 'Calzada PK: {PK_ID_CALZADA} (Asignación)',
              content: [this.constants.popup_template.content[0]],
              actions: []
            };

            this.layerResultadosConsulta.add(graphic);
          }

          this.search.activeSourceIndex = 1;
          this.search.searchTerm = graphic.attributes['PK_ID_CALZADA'].toString();
          this.search.search();

          if (newExtent == null) {
            newExtent = graphic.geometry.extent;
          } else {
            newExtent = newExtent.union(graphic.geometry.extent);
          }
        }
        const extentClone = newExtent.clone();
        this.mapView.goTo(extentClone.expand(2));
      }
    }
  }

  /**
   * Método encargado acercar
   * en el mapa los pk localizados
   * @param results Resultados de la consulta a la capa dinamica
   */
  public async mostrarQuerylocalizar(results: any) {

    if (results) {
      if (results.features.length > 0) {
        const [Graphic] = await loadModules([
          'esri/Graphic',
        ]);
        if (!this.seleccionMasiva) {
          this.limpiar();
        }

        this.pksPuntosControlEscala.removeAll();
        let newExtent = null;
        for (let index = 0; index < results.features.length; index++) {
          const graphic = results.features[index];
          if (results.features.length < 1000) {
              const stopSymbol11 = this.constants.STYLE_SIG.pkPointSymbol;

            const graphicPkPuntos2 = new Graphic({
                geometry: graphic.geometry,
                symbol: stopSymbol11
            });
            this.pksPuntosControlEscala.add(graphicPkPuntos2);

            if (this.mapView.zoom < 15) {
              this.pksPuntosControlEscala.visible = true;
            } else {
              this.pksPuntosControlEscala.visible = false;
            }
          }

          if (newExtent == null) {
            newExtent = graphic.geometry.extent;
          } else {
            newExtent = newExtent.union(graphic.geometry.extent);
          }
        }
        if (newExtent.ymax > 4.8228 && newExtent.ymin < 4.4854) {
            this.mapView.goTo({center: [-74.1014, 4.6455],
              zoom: 10
            });
        } else {
             this.mapView.goTo(newExtent);
             this.layerMantenimientos.refresh();
        }
      }
      this.layerMantenimientos.refresh();
    }
  }

  /**
   * Método encargado de localizados pk
   */
  localizar(mantenimiento: WorkflowMantenimientoModel) {
    if (mantenimiento) {
      const sql = 'PK_ID_CALZADA IN (' + mantenimiento.pk + ')';
      const query = this.layerMantenimientos.createQuery();
      query.where = sql;
      this.layerMantenimientos.queryFeatures(query).then(results => {
        this.mostrarElementosLocalizados(results);
      });
    }
  }

  /**
   * Método encargado de hacer zoom
   * a los elementos filtrados
   * @param sql Consulta para la capa Gestion UMV,
   * de los elemento a localizar
   */
  zoomQuerylocalizar(sql: string) {
    if (sql && sql !== '') {
      const query = this.layerMantenimientos.createQuery();
      query.where = sql;
      this.layerMantenimientos.queryFeatures(query).then(results => {
          this.mostrarQuerylocalizar(results);
      });
      if (this.seleccionMasiva !== false) {
          this.limpiar();
      }
    }
  }

  /**
   * Método encargado de definir filtros en la capa Gestion UMV
   * @param expression Expresion del filtro
   */
  public setMapFilter(expression: string) {
    const scope = this;
    if (this.layerMantenimientos) {
      // this.layerMantenimientos.definitionExpression = expression;
      if (this.layerMantenimientos.definitionExpression !== expression) {
        this.zoomQuerylocalizar(expression);
      }
      this.layerMantenimientos.definitionExpression = expression;
      this.definitionExpressionOriginal = expression;
    }
  }

  /**
   * Método encargado de definir filtros en la capa
   * @param expression Expresion del filtro
   */
  public setMapFilterForce(expression: string) {
    const scope = this;
    if (this.layerMantenimientos) {
      this.layerMantenimientos.definitionExpression = expression;
      this.zoomQuerylocalizar(expression);
      this.definitionExpressionOriginal = expression;
    } else {
      const _this = this;
      setTimeout(function() {
        _this.setMapFilterForce(expression);
      }
      , 100);
    }
  }

  /**
   * Método seleccionar pk por medio de matenimientos
   * @param mantenimientos Mantenimientos
   */
  seleccionarMantenimientos(mantenimientos: WorkflowMantenimientoModel[]) {

    if (mantenimientos) {
      if (mantenimientos.length > 0) {
        let sql = 'PK_ID_CALZADA IN (';
        let i = 0;
        mantenimientos.forEach(mantenimiento => {
          if (i > 0) {
            sql += ',';
          }
          i++;
          sql += mantenimiento.pk;
          if (this._PKSeleccionados.includes(mantenimiento.pk + '')) {
            this._PKSeleccionados.push(mantenimiento.pk + '');
          }
        });
        sql += ')';
        const query = this.layerMantenimientos.createQuery();
        query.where = sql;
        this.layerMantenimientos.queryFeatures(query).then(results => {
          this.mostrarElementosSeleccionados(results);
        });
      } else {
        this.limpiar();
      }
    }
  }

  /**
   * Método seleccionar pk por medio de geometrias
   * @param geometry Geomeria esri
   */
  seleccionarEspacialmente(geometry) {
    const scope = this;
    if (this.layerMantenimientos && this.mapView) {
      this.mapView.graphics.removeAll();
      const query = {
        geometry: geometry,
        outFields: ['*'],
        returnGeometry: true,
        where: this.layerMantenimientos.definitionExpression
      };
      this.layerMantenimientos.queryFeatures(query).then(results => {
        this._PKSeleccionados = [];
        if (this.mapService.activarCruceSigEntidades === true) {
          if (results.features.length > 200) {
            console.log(results.features.length);
            this.mapService.mostrarMensajeCantidadMaxPks();
          }
        }
        results.features.forEach(graphic => {
          this._PKSeleccionados.push(graphic.attributes['PK_ID_CALZADA']);
        });
        this._PKSeleccionadosSubject.next(this._PKSeleccionados);

        this.mostrarElementosSeleccionados(results);
      });
    }
  }

  /**
   * Método limpiar elemento seleccionados en el mapa
   */
  async limpiar() {
    if (this.mapView) {
      this.search.activeSourceIndex = 1;
      this.search.searchTerm = '';
      this.mapView.graphics.removeAll();
      this.sketchSpatialSelection.cancel();
      if (this.layerResultadosConsulta) {
        this.layerResultadosConsulta.removeAll();
      }
      if (this.layerSeleccionEspacial) {
        this.layerSeleccionEspacial.removeAll();
      }
      if (this.routeLayer) {
        this.routeLayer.removeAll();
        this.stopLayer.removeAll();
      }
      if (this.activarSeleccionInventarioAmbiental === true && this.layerResultadosAmbiental) {
        this.layerResultadosAmbiental.removeAll();
        this._idElementosSeleccionadosEntidades = [];
        this._idElementosSeleccionadosEntidadesSubject.next(this._idElementosSeleccionadosEntidades);
        this._elementosSeleccionadosEntidades = [];
        this._elementosSeleccionadosEntidadesSubject.next(this._elementosSeleccionadosEntidades);
      }
      if (this.layerResultadosSearch) {
        this.layerResultadosSearch.removeAll();
      }
      if (this.controlSpatialSelectionLeyendaExpand.expanded === true) {
        this.controlSpatialSelectionLeyendaExpand.toggle();
      }
      this.mapView.popup.close();
      this.mapService.inicializarVarCruceGeografico();
      this._PKSeleccionados = [];
      if (this.layerMantenimientos) {
        await this.layerMantenimientos.refresh();
      }
    }
  }

  /**
   * Método que muestra los botones del ruteo
   */
  ruteoInicioFinal() {
    if (this.arrayCentroidStartEnd.length === 0 && this.titleCalcularRuta === this.constants.puntoInicial) {
      this.ruteoVisibleBtn = !this.ruteoVisibleBtn;
    }

    if (this.arrayCentroidStartEnd.length === 1 && this.titleCalcularRuta === this.constants.puntoFinal) {
      this.ruteoVisibleBtn = !this.ruteoVisibleBtn;
    }
  }

  /**
   * Método que limpia los elementos del ruteo
   */
  ruteoLimpiar() {
    this.titleCalcularRuta = this.constants.puntoInicial;
    this.ruteoVisibleBtn = true;
    this.arrayCentroide = [];
    this.arrayCentroidStartEnd = [];
    this.limpiar();
    this.seleccionarPkRuteo = true;
    const this_ = this;
    if (this.routeLayer !== undefined) {
      this.routeLayer.removeAll();
    }
    if (this.stopLayer !== undefined) {
      this.stopLayer.removeAll();
    }
    this._PKSeleccionados = [];
    this._PKSeleccionadosSubject.next(this._PKSeleccionados);
  }

  /**
   * Método que limpia los centroides del ruteo
   */
  ruteoLimpiarCentroides() {
    this.arrayCentroide = [];
  }

  /**
   * Método adiciona y dibuja parada
   * inicial y final del ruteo del mapa
   * @param puntoMapa geometria con el punto de parada
   * inicial o final
   */
  async adicionarParada(puntoMapa) {
    const [Graphic] = await loadModules([
      'esri/Graphic',
    ]);
    let stopSymbol = this.constants.STYLE_SIG.stopStartSymbol;
    if (this.arrayCentroidStartEnd.length > 1) {
      stopSymbol = this.constants.STYLE_SIG.stopEndSymbol;
    }
    const stop = new Graphic({
      geometry: puntoMapa,
      symbol: stopSymbol
    });
    this.stopLayer.add(stop);
  }

  /**
   * Método adiciona y dibuja el ruteo del mapa
   * @param centroides array de puntos centroides (geometria)
   */
  async ruteoMantenimientos(centroides) {
    const [Graphic, RouteTask, RouteParameters, FeatureSet, geometryEngine] = await loadModules([
      'esri/Graphic',
      'esri/tasks/RouteTask',
      'esri/tasks/support/RouteParameters',
      'esri/tasks/support/FeatureSet',
      'esri/geometry/geometryEngine'
    ]);

    const centroidesTodos = [];
    const centroideInicial = this.arrayCentroidStartEnd[0];
    centroidesTodos.push(centroideInicial);
    centroides.map(centroPk => {
      centroidesTodos.push(centroPk);
    });
    centroidesTodos.push(this.arrayCentroidStartEnd[1]);

    const routeTask = new RouteTask({ url: CAPAS.visor_mapa.servicios.ruteo });

    const routeParams = new RouteParameters({
      stops: new FeatureSet(),
      outSpatialReference: { wkid: 102100, returnstops: true }
    });

    const stopSymbol = this.constants.STYLE_SIG.stopStartSymbol;

    const routeSymbol = {
      type: 'simple-line', color: '#FCFF4B', width: 5
    };

    const stops = centroidesTodos.map((centroide: any) => {
      return new Graphic({
        symbol: stopSymbol,
        geometry: centroide
      });
    });

    routeParams.stops.features = stops;

    if (routeParams.stops.features.length >= 2) {
      routeTask.solve(routeParams)
        .then((data: any) => {
          if (typeof data !== 'undefined') {
            const routeResult = data.routeResults[0].route;
            routeResult.symbol = routeSymbol;
            this.routeLayer.removeAll();
            this.routeLayer.add(routeResult);
            const routeGeometry = data.routeResults[0].route.geometry;
            const pksRuteo = this._PKSeleccionados.filter((valor, indiceActual, arreglo) =>
              arreglo.indexOf(valor) === indiceActual && valor !== '0');
            routeGeometry['pKs'] = pksRuteo;
            let routeGeometryString = JSON.stringify(routeGeometry);
            const stringPksRuteo = pksRuteo.join(',');
            const stringStartStop = JSON.stringify(this.arrayCentroidStartEnd[0]);
            const stringEndStop = JSON.stringify(this.arrayCentroidStartEnd[1]);
            routeGeometryString = routeGeometryString.replace(']]]}', ']]],\"pKs\":[' + stringPksRuteo
             + '],\"startStop\":' + stringStartStop + ',\"endStop\":' + stringEndStop +  '}');
            const longitudRuta = geometryEngine.planarLength(data.routeResults[0].route.geometry, 'kilometers');
            const tiempoEstimadoRuta = longitudRuta / this.constants.calculos.velocidad_promedio_para_ruteo;
            if (typeof stringStartStop !== 'undefined') {
              this._rutaEstimada = new RutaEstimada();
              this._rutaEstimada.recorrido = routeGeometryString;
              this._rutaEstimada.tiempo = tiempoEstimadoRuta;
              this._rutaEstimadaSubject.next(this._rutaEstimada);
            } else {
              this.routeLayer.removeAll();
            }
          }
        });
    }
  }

  /**
   * Método dibuja la ruta a partir
   * de un String de un Json de un Geometry
   * @param routeGeometryJsonString ruta en un string
   */
  async dibujarRutaJson(routeGeometryJsonString) {
    const [Graphic, Geometry, geometryJsonUtils] = await loadModules([
      'esri/Graphic',
      'esri/geometry/Geometry',
      'esri/geometry/support/jsonUtils',
    ]);
    if (routeGeometryJsonString !== '') {
      const scope = this;
      let geometryRuta = new Geometry;
      let newExtent = null;
      const rutaObj = JSON.parse(routeGeometryJsonString);
      geometryRuta = geometryJsonUtils.fromJSON(JSON.parse(routeGeometryJsonString));
      const routeSymbol = {
        type: 'simple-line', color: [255, 0, 255, 0.5], width: 5
      };
      const pKsRuta = rutaObj.pKs;
      const endStop = rutaObj.endStop;
      endStop['type'] = 'point';
      const startStop = rutaObj.startStop;
      startStop['type'] = 'point';
      const stopSymbol = this.constants.STYLE_SIG.stopStartSymbol;
      const stop = new Graphic({geometry: startStop, symbol: stopSymbol });
      this.stopLayer.add(stop);
      const stopEndSymbol = this.constants.STYLE_SIG.stopEndSymbol;
      const stopEnd = new Graphic({geometry: endStop, symbol: stopEndSymbol });
      this.stopLayer.add(stopEnd);

      const stringPksRuteo = pKsRuta.join(',');
      if (stringPksRuteo !== '') {
        const sql = 'PK_ID_CALZADA IN (' + stringPksRuteo + ')';
        const query = this.layerMantenimientos.createQuery();
        query.where = sql;
        scope.layerMantenimientos.queryFeatures(query).then(results => {
          scope.mostrarElementosSeleccionados(results);
        }).catch(err => console.log(err));
      }
      const graphicRoute = new Graphic({
        geometry: geometryRuta, symbol: routeSymbol
      });
      this.routeLayer.removeAll();
      this.routeLayer.add(graphicRoute);
      newExtent = graphicRoute.geometry.extent;
      if (newExtent && typeof this.mapView !== 'undefined') {
        this.mapView.goTo(newExtent);
      }
    }
  }

  /**
   * Método que genera parte de la URL de la imagen del mapa
   * @param pkId pk
   */
  public updateImageUrlParameters(pkId: number) {

    const scope = this;

    const sql = 'PK_ID_CALZADA IN (' + pkId + ')';
    const query = this.layerMantenimientos.createQuery();
    query.where = sql;
    this.layerMantenimientos.queryFeatures(query).then(results => {
      const graphic = results.features[0];
      const extend = graphic.geometry.extent.clone().expand(1.7);
      this._imageUrlParameters = encodeURI('bbox=' + extend.xmin.toString() + ',' + extend.ymin.toString() + ','
        + extend.xmax.toString() + ',' + extend.ymax.toString() + '&bboxSR=' + extend.spatialReference.wkid.toString()
        + '&size=560,300&format=jpg&f=image');
        this._imageUrlParametersSubject.next(this._imageUrlParameters);
    });
  }

  /**
   * Método configura el mapa para cada paso el inventario ambiental
   * @param nombreCapaActivaSeleccionable nombre de la capa dinamica activa
   * de la que se puede seleccionar
   */
  public configurarPreviaQueryAmbiental(nombreCapaActivaSeleccionable: string) {

    this.layerCensoArbolado.visible = false;
    this.layerCensoSumiderosEAABAlcantarillado.visible = false;
    this.layerCensoSumiderosEAABPluvial.visible = false;
    this.layerCensoPlazasEspacioPublicoIDUPompeyano.visible = false;
    this.layerCensoPlazasEspacioPublicoIDUPlaza.visible = false;
    this.layercensoPublicoIDU.visible = false;

    switch (nombreCapaActivaSeleccionable) {
      case CAPAS.capas_ambientales_externas.censoArbolado.nombre:
        this.layerDinamico = this.layerCensoArbolado;
        this.popupTemplateDinamic = this.constants.popup_template_CensoArbolado;
        this.campoIdentificadorLayer = CAPAS.capas_ambientales_externas.censoArbolado.campoIdentificador;
        this.layercensoPublicoIDU.visible = false;
        this.layerDinamico.visible = true;
        break;
      case CAPAS.capas_ambientales_externas.censoSumiderosAlcantarillado.nombre:
        this.layerDinamico = this.layerCensoSumiderosEAABAlcantarillado;
        this.popupTemplateDinamic = this.constants.popup_template_CensoSumideros;
        this.campoIdentificadorLayer = CAPAS.capas_ambientales_externas.censoSumiderosAlcantarillado.campoIdentificador;
        this.layerCensoArbolado.visible = false;
        this.layerDinamico.visible = true;
        break;
      case CAPAS.capas_ambientales_externas.censoSumiderosPluvial.nombre:
          this.layerDinamico = this.layerCensoSumiderosEAABPluvial;
          this.popupTemplateDinamic = this.constants.popup_template_CensoSumiderosPluvial;
          this.campoIdentificadorLayer = CAPAS.capas_ambientales_externas.censoSumiderosPluvial.campoIdentificador;
          this.layerCensoSumiderosEAABAlcantarillado.visible = false;
          this.layerDinamico.visible = true;
          break;
      case CAPAS.capas_ambientales_externas.espacioPublicoIDUPompeyano.nombre:
          this.layerDinamico = this.layerCensoPlazasEspacioPublicoIDUPompeyano;
          this.popupTemplateDinamic = this.constants.popup_template_CensoEP_IDUPompeyano;
          this.campoIdentificadorLayer = CAPAS.capas_ambientales_externas.espacioPublicoIDUPompeyano.campoIdentificador;
          this.layerCensoSumiderosEAABPluvial.visible = false;
          this.layerDinamico.visible = true;
          break;
      case CAPAS.capas_ambientales_externas.espacioPublicoIDUPlaza.nombre:
        this.layerDinamico = this.layerCensoPlazasEspacioPublicoIDUPlaza;
        this.popupTemplateDinamic = this.constants.popup_template_CensoEP_IDUPlazas;
        this.campoIdentificadorLayer = CAPAS.capas_ambientales_externas.espacioPublicoIDUPlaza.campoIdentificador;
        this.layerCensoPlazasEspacioPublicoIDUPompeyano.visible = false;
        this.layerDinamico.visible = true;
        break;
        //
      case CAPAS.capas_ambientales_externas.censoPublicoIDU.nombre:
          this.layerDinamico = this.layercensoPublicoIDU;
          this.popupTemplateDinamic = this.constants.popup_template;
          this.campoIdentificadorLayer = CAPAS.capas_ambientales_externas.censoPublicoIDU.campoIdentificador;
          this.layerCensoPlazasEspacioPublicoIDUPlaza.visible = false;
          this.layerDinamico.visible = true;
          break;
      default:
        console.log('Error: No se selecciono ninguna capa');
        break;
    }
  }

  /**
   * Método para activar capa dinamica de la que se puede seleccionar
   * @param nombreCapaActivaSeleccionable nombre de la capa activa
   * de la que se puede seleccionar
   */
  public activarSeleccionCapaInventarioAmbiental(nombreCapaActivaSeleccionable: string) {
    this.activarSeleccionInventarioAmbiental = true;
    this.configurarPreviaQueryAmbiental(nombreCapaActivaSeleccionable);
  }

  /**
   * Método para desactivar capa dinamica de la que se puede seleccionar
   */
  public desactivarSeleccionCapaInventarioAmbiental() {
    this.activarSeleccionInventarioAmbiental = false;
    this.layerDinamico.visible = false;
  }

  /**
   * Método para ocultar mapa
   */
  public ocultarMapa() {
    this.mapaOculto = !this.mapaOculto;
    this.labelOcultarMapa = this.mapaOculto === true ? this.constants.mostrarMapa : this.constants.ocultarmapa;
  }

  /**
   * Método para ocultar mapa
   */
  public mostrarMapa() {
    this.ocultarMapa();
  }

  /**
   * Método para activar visualización del listado de capas del tablero de control
   */
  public activarListadoCapasTableroControl() {
    this.groupLayerTableroControl.listMode = 'show';
  }

  /**
   * Método para desactivar visualización del listado de capas del tablero de control
   */
  public desactivarListadoCapasTableroControl() {
    this.groupLayerTableroControl.listMode = 'hide';
    this.layerEstrategiaIntervencion.visible = false;
    this.layerEjecucionTerminados.visible = false;
    this.layerPKProgramacionPeriodica.visible = false;
    this.layercensoPublicoIDU.visible = false;
    this.layerPKActividadAgrupada.visible = false;
    this.layerPKAvanceEjecucionIntervencion.visible = false;
    this.layerPKTipoPrograma.visible = false;
  }

  /**
   * Método para activar visualización del listado de capas del tablero de control
   */
  public activarListadoCapasGestionAmbiental() {
    this.groupLayerGestionAmbiental.listMode = 'show';
  }

  /**
   * Método para desactivar visualización del listado de capas del tablero de control
   */
  public desactivarListadoCapasGestionAmbiental() {
    this.groupLayerGestionAmbiental.listMode = 'hide';
    this.layerCensoArbolado.visible = false;
    this.layerCensoSumiderosEAABAlcantarillado.visible = false;
    this.layerCensoSumiderosEAABPluvial.visible = false;
    this.layerCensoPlazasEspacioPublicoIDUPlaza.visible = false;
    this.layerCensoPlazasEspacioPublicoIDUPompeyano.visible = false;
    this.layercensoPublicoIDU.visible = false;
  }

  /**
   * Método para activar visualización de capa del tablero de control
   */
  public visibilidadCapaTableroControl(nombreCapaActivar: string) {

    this.layerEstrategiaIntervencion.visible = false;
    this.layerEjecucionTerminados.visible = false;
    this.layerPKProgramacionPeriodica.visible = false;
    this.layerJoinEstadoPkActividadAgrupada.visible = false;
    this.layerPKActividadAgrupada.visible = false;
    this.layerPKAvanceEjecucionIntervencion.visible = false;
    this.layerPKTipoPrograma.visible = false;
    this.layerMantenimientos.visible = false;

    switch (nombreCapaActivar) {
      case this.layerEstrategiaIntervencion.title:
        this.layerEstrategiaIntervencion.visible = true;
        break;
      case this.layerEjecucionTerminados.title:
        this.layerEjecucionTerminados.visible = true;
        break;
      case this.layerPKProgramacionPeriodica.title:
        this.layerPKProgramacionPeriodica.visible = true;
        break;
      case this.layerJoinEstadoPkActividadAgrupada.title:
        this.layercensoPublicoIDU.visible = true;
        break;
      case this.layerPKActividadAgrupada.title:
        this.layerPKActividadAgrupada.visible = true;
        break;
      case this.layerPKAvanceEjecucionIntervencion.title:
          this.layerPKAvanceEjecucionIntervencion.visible = true;
          break;
      case this.layerPKTipoPrograma.title:
          this.layerPKTipoPrograma.visible = true;
          break;
      case this.layerMantenimientos.title:
            this.layerMantenimientos.visible = true;
            break;
      default:
        console.log('Error: No se selecciono ninguna capa del tablero de control');
        break;
    }
  }
  /**
   * Método para borrar puntos de pks relacionados con el control de escala
   */

  pksRemoverPuntosControlEscala() {
    this.pksPuntosControlEscala.removeAll();
  }

  /**
   * Método para detectar y actuar sobre cambios del componente
   */
  ngDoCheck() {
      if (this.visible) {
        if (!this.mapaOculto) {
          document.documentElement.style.setProperty('--mapa-oculto', '1');
        } else {
          document.documentElement.style.setProperty('--mapa-oculto', '10');
        }
        this._visibleSubject.next(this.visible);
      } else {
        document.documentElement.style.setProperty('--mapa-oculto', '10');
        this._visibleSubject.next(this.visible);
      }
  }

}
