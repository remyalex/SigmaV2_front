import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MenuService } from '../menu/menu.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { Router, Event, NavigationEnd } from '@angular/router';

/** Componente encargado de gestionar el proceso de menús */
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MenuService]
})
export class SidenavComponent implements OnInit {
  @ViewChild('sidenavPS') sidenavPS: PerfectScrollbarComponent;
  public userImage = '../assets/img/users/user.jpg';
  public items: Array<any>;
  public menuItems: any;
  public settings: Settings;
  nombreUsuario: string;
  usuario: string;
  subMenu: any;

  /**
  * Método encargado de construir una instancia del componente
  * @param appSettings Opciones de construcción del protocolo http para envio de petición al servidor
  * @param menuService Servicio de menú con el cual interviene el menú
  * @param tokenService Componente usado para obtener información del token del usuario
  * @param router Componente usado para redireccionar entre componentes
  */
  constructor(
    public appSettings: AppSettings,
    public menuService: MenuService,
    public tokenService: TokenStorageService,
    public router: Router
  ) {

    this.settings = this.appSettings.settings;

    /*router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        // this.removeAllActiveLinks();
        // this.closeSubMenus();
        if (event.url.includes('workflow')) {
          if (event.url.substr(event.url.length - 4, 4) === 'work') {
            //if (event.url.includes('work')) {
            const posicionWordWorkflow = event.url.search('workflow/') + 10;
            const posicionWordSubmodulo = event.url.indexOf('/', posicionWordWorkflow);
            const posicionWordFuncinalidad = event.url.indexOf('/', posicionWordSubmodulo + 1);
            event.url = event.url.substr(0, posicionWordFuncinalidad);
          }
          this.activarMenuHijo(event);
        }
        if (!event.url.includes('/admin', event.url.length - 6)) {
          this.activarMenuHijo(event);
        }
        if (!event.url.includes('/personadisponibilidad', event.url.length - 6)) {
          event.url = event.url.replace('personadisponibilidad', 'recurso');
          this.activarMenuHijo(event);
        }
        if (!event.url.includes('/equipodisponibilidad', event.url.length - 6)) {
          event.url = event.url.replace('equipodisponibilidad', 'recurso');
          this.activarMenuHijo(event);
        }
        if (!event.url.includes('/lugardisponibilidad', event.url.length - 6)) {
          event.url = event.url.replace('lugardisponibilidad', 'recurso');
          this.activarMenuHijo(event);
        }
      }
    });*/

  }

  /** Método encargado de construir el menú hijo
   * @param event objeto que contiene ruta de menú hijo
   */
  activarMenuHijo(event: NavigationEnd) {
    const menuData = this.menuItems;
    let menuPadre = (menuData.filter((menu: any) => {
      const baseUrl = event.url.substring(0, event.url.length - 6);
      if (menu.activo && menu.routerLink === baseUrl + 'admin') {
        return menu;
      }
    }));
    if (menuPadre.length === 0 && event.url.includes('/workflow/')) {
      menuPadre = (menuData.filter((menu: any) => {
        const baseUrl = event.url.substring(0, event.url.length - 6);
        if (menu.activo && menu.routerLink === event.url) {
          return menu;
        }
      }));
    }
    if (menuPadre.length > 0) {
      const menuId = menuPadre[0].id;
      this.removeAllActiveLinks();
      setTimeout(function () {
        document.getElementById('sub-menu-' + menuPadre[0].parent.id).classList.add('show');
        document.getElementById('menu-item-' + menuPadre[0].id).classList.add('active-link');
      }, 300, menuPadre);
    }
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.menuItems = this.menuService.getMenuItems();
    this.consultarMenu();
    this.nombreUsuario = this.tokenService.getNombres();
    this.usuario = this.tokenService.getUsuario();
  }

  getMenuItems = ( items: Array<any> ) => {
          return items.map( itm => {
              const obj = {
                  label: itm.nombre
              };

              if ( itm.url && (!itm.tabMenuList || !itm.tabMenuList.length ) ) {
                  if(itm.url.indexOf('http') != -1){
                      obj['url'] = [itm.url];
                      obj['target'] = '_blank';
                  }else{
                      obj['routerLink'] = [itm.url];
                  }

                  obj['icon'] = 'pi pi-fw pi-file';
                  obj['rolMenu'] = itm.tabRolMenuList;
                  //obj['command'] = (event) => { this.clickItem(event); }
              }

              if ( !itm.url && (!itm.tabMenuList || !itm.tabMenuList.length ) ) {
                  obj['icon'] = 'pi pi-fw pi-ban';
              }

              if ( itm.tabMenuList && itm.tabMenuList.length ) {
                  obj['items'] = this.getMenuItems( itm.tabMenuList );
              }

              return obj;
          } );
      }

      private consultarMenu() {
          const menu = JSON.parse(this.menuItems);
          console.log("menus:", menu);
          if ( menu.menulist && menu.menulist.length ) {
              const menusource = menu.menulist[0].tabMenuList;
              const menuItems = this.getMenuItems( menusource );
              console.log("menuitems:", menuItems);
              this.items = menuItems;

              /*this.items.push(
                  {
                      label: 'Cerrar sesion',
                      icon: 'pi pi-fw pi-sign-out',
                      command: () => {
                          this.cerrarSesion();
                          // this.router.navigate(['/login']);
                      }
                  }
              );*/


          }
      }

  /** Método encargado de eliminar todos los links activos */
  public removeAllActiveLinks() {
    const menuId = JSON.parse(window.sessionStorage.getItem('mainMenuSelected'));
    this.menuItems.forEach(item => {
      const menuItem = document.getElementById('menu-item-' + item.id);
      if (menuItem !== null) {
        menuItem.classList.remove('active-link');
        menuItem.classList.remove('show');
      }
    });
  }

  /** Método encargado de mostrar recorrer lista de los menús
   * y se muestran los menús padres
   * @param data objeto que contiene lista de menús
  */
  public mostrarMenuPadre(data: any) {
    const menuId = JSON.parse(window.sessionStorage.getItem('mainMenuSelected'));
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === menuId) {
        if (data[i].parent.id > 0) {
          document.getElementById('sub-menu-' + data[i].parent.id).classList.add('show');
          const menuItem = document.getElementById('menu-item-' + data[i].id);
          // if (menuItem !== null) {
          //   menuItem.classList.add('active-link');
          // }
          return;
        }
      }
    }
  }

  /** Método encargado de cerrar los menús hijos */
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

  /** Método encargado de actualizar el componente
   * scrollbar
   * @param e objeto sin usar
   */
  public updatePS(e) {
    this.sidenavPS.directiveRef.update();
  }

}
