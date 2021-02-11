import { Component, OnInit, SimpleChange, EventEmitter, Output, Input, IterableDiffers } from '@angular/core';
import { BasicList, compareFunction } from 'angular-dual-listbox';
import { UtilitiesService } from '../services/utilities.service';

let nextId = 0;
/** Componente encargado de gestionar listas dobles */
@Component({
  selector: 'sigma-dual-list',
  templateUrl: './dual-list.component.html',
  styleUrls: ['./dual-list.component.scss']
})
export class DualListComponent implements OnInit {


  /**
  * Método encargado de construir una instancia
  * @param differs Elemento usado para mantener la información clonada
  * @param utilitiesServices Componente de utilidades de peticiones a servicios
  */
  constructor(private differs: IterableDiffers,
    private utilitiesServices: UtilitiesService) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** variable estatica para label disponible */
  static AVAILABLE_LIST_NAME = 'available';
  /** variable estatica para label confirmación */
  static CONFIRMED_LIST_NAME = 'confirmed';
  /** variable estatica para ubicación */
  static LTR = 'left-to-right';
  /** variable estatica para ubicación */
  static RTL = 'right-to-left';
  /** lista con datos default para uso del componente */
  static DEFAULT_FORMAT = {
    add: 'Agregar',
    remove: 'Eliminar',
    all: 'Todo',
    none: 'Ninguno',
    direction: DualListComponent.LTR,
    draggable: true,
    locale: undefined
  };

  /** Variable usada para recibir ID en la invocación del componente */
  // tslint:disable-next-line: member-ordering
  @Input() id = `dual-list-${nextId++}`;
  /** Variable usada para recibir KEY en la invocación del componente */
  @Input() key = '_id';
  /** Variable usada para recibir NOMBRE en la invocación del componente */
  @Input() display: any = '_name';
  /** Variable usada para recibir lo ALTO en la invocación del componente */
  @Input() height = '400px';
  /** Variable usada para recibir sí muestra FILTROS en la invocación del componente */
  @Input() filter = false;
  /** Variable usada para recibir el FORMATO en la invocación del componente */
  @Input() format = DualListComponent.DEFAULT_FORMAT;
  /** Variable usada para recibir sí contiene ORDEN en la invocación del componente */
  @Input() sort = false;
  /** Variable usada para recibir objeto COMPARE en la invocación del componente */
  @Input() compare: compareFunction;
  /** Variable usada para recibir boolean para inactivar en la invocación del componente */
  @Input() disabled = false;
  /** Variable usada para recibir DATA en la invocación del componente */
  @Input() source: Array<any>;
  /** Variable usada para recibir lista DESTINATION en la invocación del componente */
  @Input() destination: Array<any>;
  /** destinationChange actualizado que devuelve el componente una
  * vez procesada la información **/
  @Output() destinationChange = new EventEmitter();
  /** Variable usada para recibir DATA en la invocación del componente */
  @Input('available') available: BasicList;
  /** Variable usada para recibir DATA en la invocación del componente */
  @Input('confirmed') confirmed: BasicList;
  /** variable fuente que recibe data a trabajar */
  sourceDiffer: any;
  /** variable que recibe data del objeto sourceDiffer */
  destinationDiffer: any;

  /** Método encargado de ordenar
   * @param a objeto a evaluar
   * @param b objeto a evaluar
   */
  private sorter = (a: any, b: any) => {
    return a._name < b._name ? -1 : a._name > b._name ? 1 : 0;
  };

  /** Método encargado de ejecutarse al cargar el componente
  * @param changeRecord objeto a usar
  */
  ngOnChanges(changeRecord: { [key: string]: SimpleChange }) {
    if (changeRecord['filter']) {
      if (changeRecord['filter'].currentValue == false) {
        this.clearFilter(this.available);
        this.clearFilter(this.confirmed);
      }
    }

    if (changeRecord['sort']) {
      if (changeRecord['sort'].currentValue == true && this.compare == undefined) {
        this.compare = this.sorter;
      } else if (changeRecord['sort'].currentValue == false) {
        this.compare = undefined;
      }
    }

    if (changeRecord['format']) {
      this.format = changeRecord['format'].currentValue;

      if (typeof this.format.direction == 'undefined') {
        this.format.direction = DualListComponent.LTR;
      }

      if (typeof this.format.add == 'undefined') {
        this.format.add = DualListComponent.DEFAULT_FORMAT.add;
      }

      if (typeof this.format.remove == 'undefined') {
        this.format.remove = DualListComponent.DEFAULT_FORMAT.remove;
      }

      if (typeof this.format.all == 'undefined') {
        this.format.all = DualListComponent.DEFAULT_FORMAT.all;
      }

      if (typeof this.format.none == 'undefined') {
        this.format.none = DualListComponent.DEFAULT_FORMAT.none;
      }

      if (typeof this.format.draggable == 'undefined') {
        this.format.draggable = DualListComponent.DEFAULT_FORMAT.draggable;
      }
    }

    if (changeRecord['source']) {
      this.available = new BasicList(DualListComponent.AVAILABLE_LIST_NAME);
      this.updatedSource();
      this.updatedDestination();
    }

    if (changeRecord['destination']) {
      this.confirmed = new BasicList(DualListComponent.CONFIRMED_LIST_NAME);
      this.updatedDestination();
      this.updatedSource();
    }
  }

  /** Método encargado de cargar las fuentes y retorna un boolean
   * @param source lista de fuentes
   */
  buildAvailable(source: Array<any>): boolean {
    const sourceChanges = this.sourceDiffer.diff(source);
    if (sourceChanges) {
      sourceChanges.forEachRemovedItem((r: any) => {
        const idx = this.findItemIndex(this.available.list, r.item, this.key);
        if (idx !== -1) {
          this.available.list.splice(idx, 1);
        }
      });

      sourceChanges.forEachAddedItem((r: any) => {
        // Do not add duplicates even if source has duplicates.
        if (this.findItemIndex(this.available.list, r.item, this.key) == -1) {
          this.available.list.push({ _id: this.makeId(r.item), _name: this.makeName(r.item) });
        }
      });

      if (this.compare !== undefined) {
        this.available.list.sort(this.compare);
      }

      this.available.sift = this.available.list;

      return true;
    }
    return false;
  }

  /** Método encargado de refrescar la fuente */
  updatedSource() {
    this.available.list.length = 0;
    this.available.pick.length = 0;

    if (this.source !== undefined) {
      this.sourceDiffer = this.differs.find(this.source).create(null);
    }
  }

  /** Método encargado de refrescar el objeto destinationDiffer */
  updatedDestination() {
    if (this.destination !== undefined) {
      this.destinationDiffer = this.differs.find(this.destination).create(null);
    }
  }

  /** Método encargado de retornar el formato de dirección al componente */
  direction() {
    return this.format.direction == DualListComponent.LTR;
  }

  /** Método encargado de cambiar propiedad dragStart al la lista
   * @param list objeto lista a usar
   */
  dragEnd(list: BasicList = null): boolean {
    if (list) {
      list.dragStart = false;
    } else {
      this.available.dragStart = false;
      this.confirmed.dragStart = false;
    }
    return false;
  }

  /** Método encargado de sobreescribir el dataTransfer
   * @param event objeto DragEvent a sobreescribir
   * @param item objeto item seleccionado
   * @param list objeto lista a usar
  */
  drag(event: DragEvent, item: any, list: BasicList) {
    if (!this.isItemSelected(list.pick, item)) {
      this.selectItem(list, item);
    }
    list.dragStart = true;

    // Set a custom type to be this dual-list's id.
    event.dataTransfer.setData(this.id, item['_id']);
  }

  /** Método que permite soltar
   * @param event objeto DragEvent a usar
   * @param list objeto lista a usar
   */
  allowDrop(event: DragEvent, list: BasicList): boolean {
    if (event.dataTransfer.types.length && event.dataTransfer.types[0] == this.id) {
      event.preventDefault();
      if (!list.dragStart) {
        list.dragOver = true;
      }
    }
    return false;
  }

  /** Método encargado de cambiar el valor dragOver a falso
   * de los objetos available y confirmed
   */
  dragLeave() {
    this.available.dragOver = false;
    this.confirmed.dragOver = false;
  }

  /** Método encargado de cambiar los valores Default 
   * según sí cumle condiciones
   * @param event objeto DragEvent a usar
   * @param list objeto lista a usar
   */
  drop(event: DragEvent, list: BasicList) {
    if (event.dataTransfer.types.length && event.dataTransfer.types[0] == this.id) {
      event.preventDefault();
      this.dragLeave();
      this.dragEnd();

      if (list == this.available) {
        this.moveItem(this.available, this.confirmed);
      } else {
        this.moveItemConfirmed(this.confirmed, this.available);
      }
    }
  }

  /** Método encargado de remover items */
  private trueUp() {
    let changed = false;

    // Clear removed items.
    if (this.destination != undefined) {
      let pos = this.destination.length;
      while ((pos -= 1) >= 0) {
        const mv = this.confirmed.list.filter(conf => {
          if (typeof this.destination[pos] == 'object') {
            return conf._id == this.destination[pos][this.key];
          } else {
            return conf._id == this.destination[pos];
          }
        });
        if (mv.length == 0) {
          // Not found so remove.
          this.destination.splice(pos, 1);
          changed = true;
        }
      }
    }
  }

  /** Método encargado de busqueda de item inicial y retornando
   * valor booleano
   * @param list lista de items a usar
   * @param item item a comparar
   * @param key id de item a buscar
  */
  findItemIndex(list: Array<any>, item: any, key: any = '_id') {
    let idx = -1;
    function matchObject(e: any) {
      if (e._id == item[key]) {
        idx = list.indexOf(e);
        return true;
      }
      return false;
    }
    function match(e: any) {
      if (e._id == item) {
        idx = list.indexOf(e);
        return true;
      }
      return false;
    }
    // Assumption is that the arrays do not have duplicates.
    if (typeof item == 'object') {
      list.filter(matchObject);
    } else {
      list.filter(match);
    }

    return idx;
  }

  /** Método encargado de hacer no disponible un item de la lista
   * @param source lista de items
   * @param item item a desactivar
   */
  private makeUnavailable(source: BasicList, item: any) {
    const idx = source.list.indexOf(item);
    if (idx !== -1) {
      source.list.splice(idx, 1);
    }
  }

  /** Método encargado de cambiar de posición de item
   * @param source lista de items
   * @param target lista auxiliar
   * @param item  item a usar
   * @param trueup variable booleana sin usar
  */
  moveItem(source: BasicList, target: BasicList, item: any = null, trueup = true) {
    let i = 0;
    let y = 0;
    let d = 0;
    let len = source.pick.length;

    if (item) {
      i = source.list.indexOf(item);
      len = i + 1;
    }

    for (d = 0; source.pick.length > d; d++) {
      target.list.push(source.pick[d]);
      target.list = this.utilitiesServices.orderArray(target.list, 'nombre');
      var array = source.list.indexOf(source.pick);
      for (y = 0; source.list.length > y; y++) {
        if (source.list[y].id == source.pick[d].id) {
          source.list.splice(y, 1);
        }
      }
    }
    if (this.compare !== undefined) {
      target.list.sort(this.compare);
    }
    source.pick.length = 0;
    // Delay ever-so-slightly to prevent race condition.
    setTimeout(() => {
      this.onFilter(source);
      this.onFilter(target);
    }, 10);
  }

  /** Método encargado de cambiar de posición de item confirmado
   * @param source lista de items
   * @param target lista auxiliar
   * @param item  item a usar
   * @param trueup variable booleana sin usar
  */
  moveItemConfirmed(target: BasicList, source: BasicList, item: any = null, trueup = true) {
    let i = 0;
    let y = 0;
    let d = 0;
    let len = target.pick.length;

    if (item) {
      i = target.list.indexOf(item);
      len = i + 1;
    }
    for (d = 0; target.pick.length > d; d++) {
      source.list.push(target.pick[d]);
      source.list = this.utilitiesServices.orderArray(source.list, 'nombre');
      var array = target.list.indexOf(target.pick);
      for (y = 0; target.list.length > y; y++) {
        if (target.list[y].id == target.pick[d].id) {
          target.list.splice(y, 1);
        }
      }
    }
    if (this.compare !== undefined) {
      target.list.sort(this.compare);
    }
    target.pick.length = 0;
    // Delay ever-so-slightly to prevent race condition.
    setTimeout(() => {
      this.onFilter(target);
      this.onFilter(source);
    }, 10);
  }

  /** Método encargado de retornar valor booleano
   * 'verdadero' si el item es seleccionado
   * @param list lista de items
   * @param item item seleccionado
   */
  isItemSelected(list: Array<any>, item: any): boolean {
    if (list.filter(e => Object.is(e, item)).length > 0) {
      return true;
    }
    return false;
  }

  /** Método encargado de cambiar de cambios de item
   * @param event evento recibido del click
   * @param index posición seleccionada
   * @param source lista a usar
   * @param item item seleccionado
  */
  shiftClick(event: MouseEvent, index: number, source: BasicList, item: any) {
    if (event.shiftKey && source.last && !Object.is(item, source.last)) {
      const idx = source.sift.indexOf(source.last);
      if (index > idx) {
        for (let i = idx + 1; i < index; i += 1) {
          this.selectItem(source, source.sift[i]);
        }
      } else if (idx !== -1) {
        for (let i = index + 1; i < idx; i += 1) {
          this.selectItem(source, source.sift[i]);
        }
      }
    }
    source.last = item;
  }

  /** Método encargado de agregar item seleccionado en lista
   * @param source lista de items
   * @param item item seleccionado
   */
  selectItem(source: BasicList, item: any) {
    if (this.findItem(source.pick, item)) {
      source.pick.push(item);
    }
  }

  /** Método encargado de buscar items en una lista y retornar
   * valor booleano
   * @param list lista de items
   * @param item item seleccionado
   */
  findItem(list: any, item: any) {
    let result = true;
    list.forEach((element: any) => {
      if (element.id == item.id) {
        result = false;
      }
    });
    return result;
  }

  /** Método encargado de filtrar listas
   * @param source lista de items
   */
  onFilter(source: BasicList) {
    if (source.picker.length > 0) {
      try {
        const filtered = source.list.filter((item: any) => {
          if (Object.prototype.toString.call(item) == '[object Object]') {
            if (item._name !== undefined) {
              // @ts-ignore: remove when d.ts has locale as an argument.
              return item._name.toLocaleLowerCase(this.format.locale).indexOf(source.picker.toLocaleLowerCase(this.format.locale)) !== -1;
            } else {
              // @ts-ignore: remove when d.ts has locale as an argument.
              return JSON.stringify(item).toLocaleLowerCase(this.format.locale).indexOf(source.picker.toLocaleLowerCase(this.format.locale)) !== -1;
            }
          } else {
            // @ts-ignore: remove when d.ts has locale as an argument.
            return item.toLocaleLowerCase(this.format.locale).indexOf(source.picker.toLocaleLowerCase(this.format.locale)) !== -1;
          }
        });
        source.sift = filtered;
        this.unpick(source);
      }
      catch (e) {
        if (e instanceof RangeError) {
          this.format.locale = undefined;
        }
        source.sift = source.list;
      }
    } else {
      source.sift = source.list;
    }
  }

  /** Método encargado de seleccion total de items en la lista
   * @param source lista total
   */
  selectAll(source: BasicList) {
    source.pick.length = 0;
    source.pick = source.sift.slice(0);
  }

  /** Método eliminar las selecciones de la lista
   * @param source lista a usar
   */
  selectNone(source: BasicList) {
    source.pick.length = 0;
  }

  /** Método encargado de seleccion total de las listas
   * @param source lista a usar
  */
  isAllSelected(source: BasicList): boolean {
    if (source.list.length == 0 || source.list.length == source.pick.length) {
      return true;
    }
    return false;
  }

  /** Método encargado de retornar valor booleano
   * verdadero sí el tamaño de la fuente es mayor
   * a cero y por el contrario será falso
   * @param sorce fuente a evaluar
   */
  isAnySelected(source: BasicList): boolean {
    if (source.pick.length > 0) {
      return true;
    }
    return false;
  }

  /** Método encargado de ajustar fuente
   * @param source fuente a usar
   */
  private unpick(source: BasicList) {
    for (let i = source.pick.length - 1; i >= 0; i -= 1) {
      if (source.sift.indexOf(source.pick[i]) == -1) {
        source.pick.splice(i, 1);
      }
    }
  }

  /** Método encargado de limpiar filtros
   * @param source lista a limpiar
   */
  clearFilter(source: BasicList) {
    if (source) {
      source.picker = '';
      this.onFilter(source);
    }
  }

  /** Método privado encargado de retornar item
   * @param item seleccionado
   */
  private makeId(item: any): string | number {
    if (typeof item == 'object') {
      return item[this.key];
    } else {
      return item;
    }
  }

  /** Método protegido encargado de construir nombre de item
   * @param item opcion seleccionado
   * @param separator variable para separación de nombres
  */
  protected makeName(item: any, separator = '_'): string {
    const display = this.display;

    function fallback(itm: any) {
      switch (Object.prototype.toString.call(itm)) {
        case '[object Number]':
          return itm;
        case '[object String]':
          return itm;
        default:
          if (itm !== undefined) {
            return itm[display];
          } else {
            return 'undefined';
          }
      }
    }
    let str = '';
    if (this.display !== undefined) {
      switch (Object.prototype.toString.call(this.display)) {
        case '[object Function]':
          str = this.display(item);
          break;

        case '[object Array]':
          for (let i = 0, len = this.display.length; i < len; i += 1) {
            if (str.length > 0) {
              str = str + separator;
            }

            if (this.display[i].indexOf('.') == -1) {
              // Simple, just add to string.
              str = str + item[this.display[i]];
            } else {
              // Complex, some action needs to be performed
              const parts = this.display[i].split('.');

              const s = item[parts[0]];
              if (s) {
                // Use brute force
                if (parts[1].indexOf('substring') !== -1) {
                  const nums = parts[1].substring(parts[1].indexOf('(') + 1, parts[1].indexOf(')')).split(',');

                  switch (nums.length) {
                    case 1:
                      str = str + s.substring(parseInt(nums[0], 10));
                      break;
                    case 2:
                      str = str + s.substring(parseInt(nums[0], 10), parseInt(nums[1], 10));
                      break;
                    default:
                      str = str + s;
                      break;
                  }
                } else {
                  // method not approved, so just add s.
                  str = str + s;
                }
              }
            }
          }
          break;
        default:
          str = fallback(item);
          break;
      }
    } else {
      str = fallback(item);
    }
    return str;
  }

}
