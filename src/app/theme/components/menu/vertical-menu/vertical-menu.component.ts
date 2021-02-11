import { Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter, OnChanges } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { MenuService } from '../menu.service';

/** Componente encargado de gestionar las acciones del menú cuando este se encuentra
 * de forma vertical */
@Component({
  selector: 'app-vertical-menu',
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ]
})
export class VerticalMenuComponent implements OnInit, OnChanges {
  /** Listado de items del menú a presentar */
  @Input('menuItems') menuItems;
  /** Listado de items de padres del menú a presentar */
  @Input('menuParentId') menuParentId;
  /** Retorno de la acción realizada por el usuario en un evento
   * a otros componente que lo requieran */
  @Output() onClickMenuItem:EventEmitter<any> = new EventEmitter<any>();
  /** Menú padre del item actual cuando aplique el caso */
  parentMenu: Array<any>;
  /** Opciones del menú permitidas */
  public settings: Settings;
  /** Módulo de menú a presentar */
  public menuModulo: string = 'menuModulo';
  /** Opcion seleccionada del menú a gestionar*/
  public menuOption: string = 'menuOption';


  /**
  * Método encargado de construir una instancia del componente
  *
  * @param appSettings Opciones de aplicacion requeridas por el menú
  * @param menuService Servicio de menú con el cual interviene el menú
  * @param router Componente usado para redireccionar entre componentes
   */
  constructor(
    public appSettings: AppSettings,
    public menuService: MenuService,
    public router: Router ) {
    this.settings = this.appSettings.settings;
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    let menu = JSON.parse(window.sessionStorage.getItem(this.menuOption));
    if (menu) {
      setTimeout(() => {
        this.openMenu(menu);
      }, 1000);
    }
  }

  /** Método encargado de gestionar la acción de abrir el menú el momento
   * de presionar el usuario sobre este
   *
   * @param menu Menú sobre el cual realizó click el usuario
   * */
  openMenu (menu){
    if(menu.parentId){
      let menuParent = document.getElementById('menu-item-' + menu.parentId);
      let subMenu = document.getElementById('menu-item-' + menu.id);
      if (subMenu) {
        if (!subMenu.classList.contains('show')) {
          menuParent.click();
        }
      }
    }
  }

  /**
   * Método en cargado de actualizar el modelo del componente una
   * vez notificado un cambio en los campos
   *
   * @param changes Diccionario de claves que se modificaron
   */
  ngOnChanges(changes: any) {
    if (changes.menuItems !== undefined) {
      if (changes.menuItems.currentValue !== undefined) {
        this.parentMenu = this.menuItems.filter(item => item.parent.id == this.menuParentId);
      }
    }
  }

  /** Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if(this.settings.fixedHeader){
          let mainContent = document.getElementById('main-content');
          if(mainContent){
            mainContent.scrollTop = 0;
          }
        }
        else{
          document.getElementsByClassName('mat-drawer-content')[0].scrollTop = 0;
        }
      }
    });
  }

  /** Método encargado de gestionar la acción de toogle el menú el momento
   * de presionar el usuario sobre este
   *
   * @param menu Menú sobre el cual realizó click el usuario
   * */
  onClick(menu) {
    this.menuService.toggleMenuItem(menu.id);
    this.menuService.closeOtherSubMenus(this.menuItems, menu.id);
    this.menuService.removeAllActiveLinks(this.menuItems);
    this.onClickMenuItem.emit(menu.id);
  }

  /**
   * Método encargado de obtener las opciones del menú indicado
   *
   * @param menu Menú sobre el cual se obtendran las opciones que contiene
  */
  getMenuOption(menu): string {
    let menuKeys = menu.routerLink.split('/');
    let menuString = '';
    if (menuKeys.length > 1) {
      menuString = menuKeys[1];
    }
    return menuString;
  }


  /**
   * Método encargado de asiganr las opciones del menú indicado
   *
   * @param menu Menú sobre el cual se asignarán las opciones indicadas
   * @param menuString Cadena de texto con el nombre de la opción a actualizar
  */
  setMenuOption(menu, menuString = 'administracion') {
    window.sessionStorage.setItem(this.menuModulo, menuString);
    window.sessionStorage.setItem(this.menuOption, JSON.stringify(menu));
  }

}
