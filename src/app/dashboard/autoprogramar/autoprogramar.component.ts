import esri = __esri;
import { loadModules } from 'esri-loader';
import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef, Input, Inject, LOCALE_ID } from '@angular/core';
import { MantenimientoVial } from "../models/mantenimiento-vial";
import { ModalCargandoComponent } from "../modal-cargando/modal-cargando.component";
import { DominioItem } from "../models/dominio-item";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TokenStorageService } from "src/app/seguridad/services/token-storage.service";
import { formatDate } from "@angular/common";
import { Observable } from "rxjs";
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'events'
};
@Component({
  selector: 'app-autoprogramar',
  templateUrl: './autoprogramar.component.html',
  styleUrls: ['./autoprogramar.component.scss']
})
export class AutoprogramarComponent implements OnInit {
  private _zoom = 11;
  private _center = [-74.113, 4.667];
  private _basemap = 'aa125730846140f8985be779f68051cf';
  //private _basemap = '405f07b7707841a08460f26b839851fb'
  solMant: MantenimientoVial;
  pkAutoprogamable: boolean;
  pkFueraRango: boolean;
  mapView: esri.MapView;
  fullscreen: esri.Fullscreen;
  tiposOrigen: DominioItem[];
  tiposOrigenFiltrado: DominioItem[];
  tipoOrigenSeleccionado: number;

  idTipoProgramaAlcaldias = 579;
  idTipoEntidadAlcaldia = 1452;
  idTipoOrigenOtro = 374;

  idTipoProgramaSecMovilidad = 578;
  idTipoEntidadSecMovilidad = 1452; //mirar si hay que cambiar el valor
  idEntidadSecMovilidad = 3;


  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: any[]) {
    this._center = center;
  }

  get center(): any[] {
    return this._center;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  @Output() mapLoaded = new EventEmitter<boolean>();

  @ViewChild('mapViewNode') private mapViewEl: ElementRef;
  //@ViewChild('buscarRadicado') private buscarRadicado: BuscarRadicadoComponent;
  @ViewChild('modalCargando') private modalCargando: ModalCargandoComponent;



  constructor(private http: HttpClient, public tokenService: TokenStorageService, @Inject(LOCALE_ID) private locale: string) {
                this.tiposOrigen = [{ idTipo: 1401, valor: "1", descripcion: "PETICIONARIO"},
                  { idTipo: 1402, valor: "2", descripcion: "SEGUIMIENTO"},
                  { idTipo: 1403, valor: "3", descripcion: "MISIONAL"}
                ];
  }
  mostrarBotonOk(){
    if(this.pkAutoprogamable && this.pkFueraRango){
      return false;
    }
    if(!this.pkAutoprogamable){
      return false;
    }
    if (this.tipoOrigenSeleccionado == 371){
      return false;
    } else {
      return this.pkAutoprogamable && this.tipoOrigenSeleccionado != undefined;
    }
  }
  workPK(): void {

    let pkId = this.mapView.popup.selectedFeature;
    console.log(pkId.attributes.PK_ID_CALZADA);
    console.log("en seguimiento: " + pkId.attributes.EN_SEGUIMIENTO);
    if(pkId.attributes.EN_SEGUIMIENTO == 'SI'){
      this.tiposOrigenFiltrado = [];
      for(let o of this.tiposOrigen){
        console.log(o);
        if (o.idTipo == 372){
          this.tiposOrigenFiltrado.push(o);
          break;
        }
      }
    }else{
      this.tiposOrigenFiltrado = [];
      for(let o of this.tiposOrigen){
        console.log(o);
        if (o.idTipo != 372){
          this.tiposOrigenFiltrado.push(o);
        }
      }
    }
    let solMant: MantenimientoVial;
    let kmCI: number;
    if (pkId.attributes.TIPOMALLA == 'LO'){
      kmCI = Number(pkId.attributes.AREACALZADA) / 3000;
    } else {
      kmCI = Number(pkId.attributes.AREACALZADA) / 3500;
    }
    this.solMant = new MantenimientoVial(pkId.attributes.PK_ID_CALZADA,
              pkId.attributes.ANCHOCALZADA,
              pkId.attributes.AREACALZADA,
              pkId.attributes.LONGITUDHORIZONTAL,
              pkId.attributes.CIV,
              pkId.attributes.ID_LOCALIDAD,
              pkId.attributes.ID_ZONA,
              pkId.attributes.ID_UPLA,
              pkId.attributes.ID_BARRIO,
              pkId.attributes.ID_CUADRANTE,
              pkId.attributes.ID_TIPO_MALLA,
              pkId.attributes.ID_TIPO_SECCION_VIAL,
              pkId.attributes.ID_ZONA,
              Number(kmCI.toFixed(2)),
              pkId.attributes.EJE_VIAL,
              pkId.attributes.DESDE,
              pkId.attributes.HASTA,
              pkId.attributes.ID_TIPO_SUPERFICIE,

            );
            this.fullscreen.viewModel.exit();
            console.log('****************************');
          console.log(pkId.attributes.INTERVENCION_UMV);
          console.log('****************************');
          console.log(pkId.attributes);
          if (pkId.attributes.INTERVENCION_UMV == 0 || pkId.attributes.INTERVENCION_UMV == 2){
            this.pkAutoprogamable = true;
          }
          else{
            this.pkAutoprogamable = false;
          }
          /*
              //si es una entidad externa
          if(this.userControllerService.getIdTipoEntidad() == this.idTipoEntidadAlcaldia){
            this.tipoOrigenSeleccionado = this.idTipoOrigenOtro;
            //si el pk esta en la localidad de la entidad del usuario o si el usuario es movilidad
            if (pkId.attributes.ID_LOCALIDAD == this.userControllerService.getIdLocalidad() || this.userControllerService.getidEntidad() == 3){
              this.pkFueraRango = false;
            }
            else{
              this.pkFueraRango = true;
            }
          }*/
  }
  autoprogPK() {
    this.modalCargando.mostrarPanel();
    let idMantenimiento: Number, idGestion: Number;
    this.solMant.idTipoOrigen = this.tipoOrigenSeleccionado;
  /*
    if(this.userControllerService.getIdTipoEntidad() == this.idTipoEntidadAlcaldia){
      this.solMant.idTipoPrograma = this.userControllerService.getidEntidad() == this.idEntidadSecMovilidad?this.idTipoProgramaSecMovilidad:this.idTipoProgramaAlcaldias;
      //poner en "CERO los valores del modelo de priorización"
      /*
      this.solMant.idTipoImpactoSocial = 396;
      this.solMant.idTipoDeterminacionInterv = 131;
      this.solMant.idTipoCoordinacionInterinst = 136;
      this.solMant.idTipoAporteMetas = 146;

    }*/
// TODO: verificar el campo de radicado
    /*if(this.tipoOrigenSeleccionado == 371) {
      this.solMant.numeroRadicadoEntrada = this.buscarRadicado.radicado.radi_nume_radi;
      this.solMant.solicitudRadicadoEntrada = this.buscarRadicado.radicado.radi_nume_radi;
      this.solMant.solicitudNombre = this.buscarRadicado.radicado.radi_nomb + " " + this.buscarRadicado.radicado.radi_prim_apel + " " + this.buscarRadicado.radicado.radi_segu_apel;
      this.solMant.solicitudFecha = this.buscarRadicado.radicado.radi_fech_radi;
      this.solMant.solicitudVencimiento = this.buscarRadicado.radicado.fech_vcmto;
    } else {*/
      this.solMant.idTipoEstadoPk = 19;
      this.solMant.solicitudNombre = this.tokenService.getNombres();
      this.solMant.fecha = formatDate(Date.now(), 'yyyy-MM-dd', this.locale);
      this.solMant.solicitudFecha = formatDate(Date.now(), 'yyyy-MM-dd', this.locale);
      this.solMant.solicitudVencimiento = formatDate(Date.now(), 'yyyy-MM-dd', this.locale);
    //}
    let mvInfo = {
      usuario: this.tokenService.getUsuario(),
      mantenimientovial: this.solMant
    };
    let ret:Observable<any> = this.http.post<any>('/SIGMA-backend/api/mantenimientovial/insertar', JSON.stringify(mvInfo), httpOptions);
    ret.subscribe(
      (val) => { idMantenimiento = val.body.respuesta[0].id_mantenimiento_vial; idGestion = val.body.orden.id_mantenimiento_vial},
      error => {
        console.log('ERROR EN LA PETICION Y FINALIZO' + JSON.stringify(error));
        this.modalCargando.ocultarPanel();
      },
      () => {
        //this.userControllerService.setIdMantenivientoVialGestionSeleccionado (idGestion);
        //this.router.navigate([ 'main-dashboard/captura-diagnostico' + '', idMantenimiento ]);
        console.log('guarda mantV:', idMantenimiento);
        this.modalCargando.ocultarPanel();
      }
    );
  }
  cancelarAutoprog() {
    this.solMant = null;
  }
  public ngOnInit() {
    let scope = this;
    let timeout: boolean;
    let baseMap: any
    let request = new XMLHttpRequest();
    request.timeout = 10000;
    request.ontimeout = function () {
      console.log("Cambiando a WebMap UMV");
      scope._basemap = '38d74e82d751495b8c30a5e3841c45c0';
      scope.initializeMap();
      timeout = true;
    }
    request.onloadend = function () {
      if (!timeout) {
        if (request.status !== 200) {
            console.log("Cambiando a WebMap UMV");
            baseMap = '38d74e82d751495b8c30a5e3841c45c0';
        } else {
            let response = JSON.parse(request.response);
            if (response.error) {
                console.log("Cambiando a WebMap UMV");
                baseMap = '38d74e82d751495b8c30a5e3841c45c0';
            } else {
                //baseMap = '405f07b7707841a08460f26b839851fb';
                baseMap = 'aa125730846140f8985be779f68051cf';
            }
        }
        scope._basemap = baseMap;
        scope.initializeMap();
      }
    };
    try {
        request.open("get", "http://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/mapa_base_3857/MapServer" + "?f=json");
        request.send();
    }
    catch (error) {
        console.error(error);
    }
  }
  async initializeMap() {
    try {
       const [EsriWebMap, EsriMapView, EsriFullScreen, EsriLocate, EsriSearch, EsriLayerList, EsriLegend, EsriExp, Compass, EsriHome, EsriFL, EsriGL, EsriGraphic, EsriTL, EsriBasemap, EsriBasemapGallery] = await loadModules([
         'esri/WebMap',
         'esri/views/MapView',
         'esri/widgets/Fullscreen',
         'esri/widgets/Locate',
         'esri/widgets/Search',
         'esri/widgets/LayerList',
         'esri/widgets/Legend',
         'esri/widgets/Expand',
         'esri/widgets/Compass',
         'esri/widgets/Home',
         'esri/layers/FeatureLayer',
         'esri/layers/GraphicsLayer',
         'esri/Graphic',
         'esri/layers/TileLayer',
         'esri/Basemap',
         'esri/widgets/BasemapGallery'
       ]);
       /*const idecaBasemap = new EsriBasemap({
          baseLayers: [new EsriTL({ url: environment.urlWebMapIDECA })],
          title: "Mapa base IDECA",
          id: "ideca"
        });
        */
        let map: esri.Map = new EsriWebMap({
          portalItem: { id: this._basemap }
        });
         const mapViewProperties: esri.MapViewProperties = {
           container: this.mapViewEl.nativeElement,
           center: this._center,
           zoom: this._zoom,
           map: map
         };
         this.mapView = new EsriMapView(mapViewProperties);
         this.fullscreen = new EsriFullScreen({
           view: this.mapView
         });
         let locate = new EsriLocate({
           view: this.mapView
         });
         let search = new EsriSearch({
           view: this.mapView,
           allPlaceholder: "Buscar ubicación",
           sources: [{
             featureLayer: {
               url: 'https://arcgis2.umv.gov.co/arcgis/rest/services/UMV/Gestion_UMVT/MapServer/0'
             },
             searchFields: ["PK_ID_CALZADA", "CIV"],
             suggestionTemplate: "{PK_ID_CALZADA}",
             displayField: "PK_ID_CALZADA",
             exactMatch: false,
             outFields: ["*"],
             name: "Calzadas",
             placeholder: "Buscar PK",
           }, {
             featureLayer: {
               url: 'http://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/mapa_base_4686/MapServer/80',
               popupTemplate: {
                   title: "Localidad: {LOCNOMBRE}",
                   content: [{
                     type: "fields",
                     fieldInfos: [{
                       fieldName: "LOCCODIGO",
                       label: "Código",
                       visible: true
                     }, {
                       fieldName: "LOCAADMINI",
                       label: "Acto admin.",
                       visible: true
                     }, {
                       fieldName: "LOCAREA",
                       label: "Área",
                       visible: true
                     }]
                   }]
               }
             },
             searchFields: ["LOCNOMBRE", "LOCCODIGO"],
             suggestionTemplate: "{LOCCODIGO}: {LOCNOMBRE}",
             displayField: "LOCNOMBRE",
             exactMatch: false,
             outFields: ["*"],
             name: "Localidades",
             placeholder: "Buscar Localidad",
           }, {
             featureLayer: {
               url: 'http://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/mapa_base_4686/MapServer/77',
               popupTemplate: {
                   title: "Sector: {SCANOMBRE}",
                   content: [{
                     type: "fields",
                     fieldInfos: [{
                       fieldName: "SCACODIGO",
                       label: "Código",
                       visible: true
                     }, {
                       fieldName: "SCATIPO",
                       label: "Tipo sector",
                       visible: true
                     }]
                   }]
               }
             },
             searchFields: ["SCANOMBRE", "SCACODIGO"],
             suggestionTemplate: "{SCANOMBRE}",
             displayField: "SCANOMBRE",
             exactMatch: false,
             outFields: ["*"],
             name: "Barrios",
             placeholder: "Buscar Barrio",
           }
         ]
         });
         this.mapView.ui.add(search, 'top-right');
         let homeView = new EsriHome({
           view: this.mapView
         });
         this.mapView.ui.add(homeView, 'top-left');
         let compass = new Compass({
           view: this.mapView
         });
         this.mapView.ui.add(compass, "top-left");
         this.mapView.ui.add(locate, 'top-left');
         this.mapView.ui.add(this.fullscreen, 'top-left');
         let bmGallery = new EsriBasemapGallery({
           view: this.mapView
         });
         //bmGallery.source.add(idecaBasemap);
         let basemapGallery = new EsriExp({
          content: bmGallery,
          view: this.mapView,
          expandIconClass: "esri-icon-basemap",
          expanded: false
        });
        this.mapView.ui.add(basemapGallery, "top-right");
         let layerList = new EsriExp({
          content: new EsriLayerList({
           view: this.mapView,
           label: "Capas"
          }),
          view: this.mapView,
          expandIconClass: "esri-icon-layers",
          expanded: false
        });
         this.mapView.ui.add(layerList, "bottom-right");
         let legend = new EsriExp({
          content: new EsriLegend({
            view: this.mapView,
            label: "Leyenda",
            style: "card"
          }),
          view: this.mapView,
          expandIconClass: "esri-icon-layer-list",
          expanded: false
        });
         this.mapView.ui.add(legend, "bottom-left");
         let scope = this;
         this.mapView.popup.on("trigger-action", function(event) {
           if (event.action.id === "work-row") {
             scope.workPK();
           }
         });
         let gestionFL, flGestionUmv, flSinGestionUmv: any;
      this.mapView.when(A => {
         gestionFL = A.map.allLayers.find(function(layer) {
         return layer.title === "Gestion";
         //return layer.title === "Gestion";
        });
        console.log('gestion:',gestionFL);
        gestionFL.allSublayers.items.forEach (
          item => {
            console.log('layers:',item);
            if (item.id == 1) {
              flSinGestionUmv = item;
            } else if (item.id == 0) {
              flGestionUmv = item;
            }
          }
        );
        let actions = [{
            title: "Trabajar",
            id: "work-row",
            className: "esri-icon-play-circled"
          }];
        flSinGestionUmv.popupTemplate.actions = actions;
        flGestionUmv.popupTemplate.actions = actions;
      });

      this.mapView.popup.watch("selectedFeature", function(e){
       scope.mapView.graphics.removeAll();
       if (e && e.geometry) {
         scope.mapView.graphics.add(
           new EsriGraphic({
             geometry: e.geometry,
             symbol: {
               type: "simple-fill",
               style: "none",
               outline: {
                 color: "#6600FF",
                 width: 2
               }
             }
           })
         );
       }
      });
      this.mapView.popup.watch("close", function(e){
         scope.mapView.graphics.removeAll();
      });
    } catch (error) {
      console.log('We have an error: ' + error);
    }
  }

}
