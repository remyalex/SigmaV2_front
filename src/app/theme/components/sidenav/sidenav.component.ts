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


  /** Método encargado de actualizar el componente
   * scrollbar
   * @param e objeto sin usar
   */
  public updatePS(e) {
    this.sidenavPS.directiveRef.update();
  }

}
