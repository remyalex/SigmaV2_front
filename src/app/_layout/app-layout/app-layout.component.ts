import { Component, ViewChild, HostListener, ViewChildren, QueryList, OnInit, AfterViewInit } from '@angular/core';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { Router } from '@angular/router';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { MenuService } from 'src/app/theme/components/menu/menu.service';
import { VisorMapaComponent } from 'src/app/shared/visor-mapa/visor-mapa.component';
import { MapService } from 'src/app/shared/services/map.service';
import { CapasHandler } from 'src/app/shared/visor-mapa/visor-mapa-capas';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
  providers: [MenuService]
})
export class AppLayoutComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav') sidenav: any;
  @ViewChild('backToTop') backToTop: any;
  @ViewChildren(PerfectScrollbarDirective) pss: QueryList<PerfectScrollbarDirective>;
  @ViewChild('map') mapElement: VisorMapaComponent;

  public settings: Settings;
  public menus = ['vertical', 'horizontal'];
  public menuOption: string;
  public menuTypes = ['default', 'compact', 'mini'];
  public menuTypeOption: string;
  public isStickyMenu = false;
  public lastScrollTop = 0;
  public showBackToTop = false;
  public toggleSearchBar = false;
  private defaultMenu: string;

  mapaVisible = false;


  /**
  * Método encargado de construir una instancia del componente
  */
  constructor(public appSettings: AppSettings, public router: Router, private menuService: MenuService,
    private mapService: MapService) {
    this.settings = this.appSettings.settings;
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() { 
    this.getCapas();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.settings.loadingSpinner = false;
      this.verificaVisibilidadMapa();
    }, 5000);
  }

  public chooseMenu() {
    this.settings.menu = this.menuOption;
    this.defaultMenu = this.menuOption;
    this.router.navigate(['/']);
  }

  public chooseMenuType() {
    this.settings.menuType = this.menuTypeOption;
  }

  public changeTheme(theme) {
    this.settings.theme = theme;
  }

  public toggleSidenav() {
    this.sidenav.toggle();
  }

  public onPsScrollY(event) {
    (event.target.scrollTop > 300) ?
      this.backToTop.nativeElement.style.display = 'flex' :
      this.backToTop.nativeElement.style.display = 'none';
    if (this.settings.menu === 'horizontal') {
      if (this.settings.fixedHeader) {
        const currentScrollTop = (event.target.scrollTop > 56) ? event.target.scrollTop : 0;
        if (currentScrollTop > this.lastScrollTop) {
          this.isStickyMenu = true;
        } else {
          this.isStickyMenu = false;
        }
        this.lastScrollTop = currentScrollTop;
      } else {
        (event.target.scrollTop > 56) ? this.isStickyMenu = true : this.isStickyMenu = false;
      }
    }
  }

  public scrollToTop() {
    this.pss.forEach(ps => {
      if (ps.elementRef.nativeElement.id === 'main' || ps.elementRef.nativeElement.id === 'main-content') {
        ps.scrollToTop(0, 250);
      }
    });
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    if (window.innerWidth <= 768) {
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
      this.settings.menu = 'vertical';
    } else {
      (this.defaultMenu === 'horizontal') ? this.settings.menu = 'horizontal' : this.settings.menu = 'vertical';
      this.settings.sidenavIsOpened = true;
      this.settings.sidenavIsPinned = true;
    }
  }

  public closeSubMenus() {
    const menu = document.querySelector('.sidenav-menu-outer');
    if (menu) {
      for (let i = 0; i < menu.children[0].children.length; i++) {
        const child = menu.children[0].children[i];
        if (child) {
          if (child.children[0].classList.contains('expanded')) {
            child.children[0].classList.remove('expanded');
            child.children[1].classList.remove('show');
          }
        }
      }
    }
  }

  verificaVisibilidadMapa() {
    this.mapService.getVisor().visible$.subscribe(val => {
      if (val) {
        this.mapaVisible = true;
      } else {
        this.mapaVisible = false;
      }
    });
  }

  ocultarMapa() {
    this.mapService.getVisor().ocultarMapa();
  }

  getCapas() {
    this.mapService.getCapas().subscribe(data => {
      const capasHandler = new CapasHandler();
      const capasMapa = capasHandler.setCapas(JSON.parse(data));
      //console.log('this.getCapas(); en appLayout');
      this.mapService.solicitarRespuestaServidorEsriUrl(capasMapa.visor_mapa.servicios.ideca, 'baseMapIdeca');
      this.mapService.solicitarRespuestaServidorEsriUrl(
          'https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/mapa_base_3857/MapServer/500', 'capaURLPrueba');
      /* this.mapService.solicitarRespuestaServidorEsriUrl(
          'https://arcgis.sigma-ito.com/arcgis/rest/services/UMV/PRUEBA_PRODUCCION_UMV/MapServer/1/query?where=1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson',
          'capa400URLPrueba'); */
      const claves = Object.getOwnPropertyNames(capasMapa.capas_ambientales_externas);
      claves.forEach(item => {
        this.mapService.solicitarRespuestaServidorEsriUrl(capasMapa.capas_ambientales_externas[item].url,
          capasMapa.capas_ambientales_externas[item].nombre);
      });
    }, error => {
      console.log('Aún no se han cargaron las capas del mapa');
    });
  }
}
