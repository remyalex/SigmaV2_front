import { Injectable } from '@angular/core';
import { Menu } from '../../theme/components/menu/menu.model';
const TOKEN_KEY = 'token';
const PK_KEY = 'id';
const ID_KEY = 'identificacion';
const USERNAME_KEY = 'usuario';
const NAME_KEY = 'nombres';
const LAST_NAME_KEY = "apellidos"
const PHONE_KEY = "telefono";
const MENU_KEY = "menus";

const PAYLOAD1 = 'payload1';
const PAYLOAD2 = 'payload2';

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  public PERFIL = 'payload1';
  public PERMISOS = 'payload2';
  public MENU = 'payload3';

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  public savePayload(key: string, data: string) {
    window.sessionStorage.removeItem(key);
    window.sessionStorage.setItem(key, data);
  }

  public savePayload1(payload1: string) {
    window.sessionStorage.removeItem(PAYLOAD1);
    window.sessionStorage.setItem(PAYLOAD1, payload1);
  }

  public savePayload2(payload2: string) {
    window.sessionStorage.removeItem(PAYLOAD2);
    window.sessionStorage.setItem(PAYLOAD2, payload2);
  }

  public saveToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  getStorage(key: string) {
    const payload = window.sessionStorage.getItem(key);
    return (JSON.parse(window.atob(payload)));
  }

  getStorage1() {
    const payload = window.sessionStorage.getItem(PAYLOAD1);
    return (JSON.parse(window.atob(payload)));
  }

  getStorage2() {
    const payload = window.sessionStorage.getItem(PAYLOAD2);
    return (JSON.parse(window.atob(payload)));
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public getId(): string {
    return this.getStorage1()[PK_KEY];
  }

  public getIdentificacion(): string {
    return this.getStorage1()[ID_KEY];
  }

  public getUsuario(): string {
    return this.getStorage1()[USERNAME_KEY];
  }

  public getNombres() {
    return this.getStorage1()[NAME_KEY];
  }

  public getApellidos() {
    return this.getStorage1()[LAST_NAME_KEY];
  }

  public getTelefono() {
    return this.getStorage1()[PHONE_KEY];
  }

  saveMenus(data: Menu[]) {
    window.sessionStorage.removeItem(MENU_KEY);
    window.sessionStorage.setItem(MENU_KEY, JSON.stringify(data));
  }

  getMenus(): Menu[] {
    var stringMenu = window.sessionStorage.getItem(MENU_KEY);
    var jsonMenu = JSON.parse(stringMenu);
    return jsonMenu;
  }

  signOut() {
    window.sessionStorage.clear();
    localStorage.clear();
  }
}