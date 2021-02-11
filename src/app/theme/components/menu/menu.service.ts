import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

import { Menu } from './menu.model';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { BehaviorSubject } from 'rxjs';

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({
  providedIn: 'root'
})
export class MenuService {

  /** Variable encargada de gestionar el behavior del componente */
  private menuSubject = new BehaviorSubject([]);
  /** Variable encargada de gestionar el evento observable del menú */
  public menu$ = this.menuSubject.asObservable();
  /** Variable de tipo menú para gestionar el modelo */
  menu: any;

  /**
   * Método encargado de gestionar la actuaización del menú
   */
  public updateMenu() {
    this.getVerticalMenuItems();
  }


  /**
  * Método encargado de construir una instancia
  *
  * @param location Ubicación del menú sobre la que se inicializará
  * @param tokenStore Token de usuario relacionado con la seguridad
  */
  constructor(private location: Location,
    private tokenStore: TokenStorageService
  ) { }

  /** Método encargado de obtener los items del menú seleccionado */
  public getVerticalMenuItems(): void {
    const menuData = this.tokenStore.getStorage(this.tokenStore.MENU);

    this.menu = (menuData.filter((menu: any) => menu.activo));
    this.menuSubject.next(this.menu);
    this.tokenStore.saveMenus(this.menu);
  }

  /**
   * Método encargado de activar el menú indicado
   *
   * @param menú del cual se va a presentar los submenús
  */
  public expandActiveSubMenu(menu: Array<Menu>) {
    const url = this.location.path();
    const routerLink = url;
    const activeMenuItem = menu.filter(item => item.routerLink === routerLink);
    if (activeMenuItem[0]) {
      let menuItem = activeMenuItem[0];
      while (menuItem.parentId !== 0) {
        const parentMenuItem = menu.filter(item => item.id === menuItem.parentId)[0];
        menuItem = parentMenuItem;
        this.toggleMenuItem(menuItem.id);
      }
    }
  }

  /**
   * Intercambio de evento al presionar el menu indicado.
   *
   * @param menuId Id del menú que se presionó
   */
  public toggleMenuItem(menuId) {
    const menuItem = document.getElementById('menu-item-' + menuId);
    const subMenu = document.getElementById('sub-menu-' + menuId);
    window.sessionStorage.removeItem('mainMenuSelected');
    window.sessionStorage.setItem('mainMenuSelected',  menuId);
    if (subMenu) {
      if (subMenu.classList.contains('show')) {
        subMenu.classList.remove('show');
        menuItem.classList.remove('expanded');
      } else {
        subMenu.classList.add('show');
        menuItem.classList.add('expanded');
      }
    }
  }

  /**
   * Método encargado de remover todos los links activos del menú indicado
   *
   * @param menu Listado de menús que se les removerá la selección
  */
  public removeAllActiveLinks(menu: Array<Menu>) {
    menu.forEach(item => {
      const menuItem = document.getElementById('menu-item-' + item.id);
      if (menuItem !== null) {
        menuItem.classList.remove('active-link');
      }
    });
  }

  /**
   * Método encargado de cerrar todos los otros menús diferentes al seleccionado
   * @param menu Menú padre sobre el que se realizará la acción
   * @param menuId ID del menú que no se ocultará
   */
  public closeOtherSubMenus(menu: Array<Menu>, menuId) {
    const currentMenuItem = menu.filter(item => item.id === menuId)[0];
    const currentMenuFixed = currentMenuItem as any;
    if (currentMenuFixed.parent.id === 0 && !currentMenuItem.target) {
      menu.forEach(item => {
        if (item.id !== menuId) {
          const subMenu = document.getElementById('sub-menu-' + item.id);
          const menuItem = document.getElementById('menu-item-' + item.id);
          if (subMenu) {
            if (subMenu.classList.contains('show')) {
              subMenu.classList.remove('show');
              menuItem.classList.remove('expanded');
            }
          }
        }
      });
    }
  }
}
