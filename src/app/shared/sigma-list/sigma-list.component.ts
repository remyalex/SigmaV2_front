import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Lista } from 'src/app/administracion/listas/models/lista.model';

import { ListasService } from 'src/app/administracion/listas/services/listas.service';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { ListaItemsService } from 'src/app/administracion/listas-items/services/listas-items.service';

/**
 * Componente usado para estandarizar el campo de listas
 * en todos los formularios del sistema
 */
@Component({
  selector: 'sigma-list',
  templateUrl: './sigma-list.component.html'
})
export class SigmaListComponent implements OnInit {

  /** Variable usada para recibir lista/data en la invocación
   * del componente */
  @Input('lista') lista: string;
  /** Variable usada para recibir etiqueta en la invocación
   * del componente */
  @Input('etiqueta') etiqueta: string = '';
  /** Variable usada para recibir valor en la invocación
   * del componente */
  @Input('value') value: number;
  /** Variable usada para recibir valor booleano para hacer
   * requerido el componente */
  @Input('required') required: boolean;
  /** variable que recibe Lista de Items a usar en el componente */
  options: ListaItem[];
  /** variable lista a usar en el componente */
  optionsList: Lista[];
  /** valor Id seleccionado que devuelve el componente una vez
   * procesada la información */
  @Output()
  optionIdSelected = new EventEmitter<number>();


  /**
  * Método encargado de construir una instancia
  * @param servicioItems Componente encargado de gestionar los item de la lista
  * @param servicioListas Componente encargado de gestionar la informacción de la lista
  */
  constructor(
    private servicioItems: ListaItemsService,
    private servicioListas: ListasService) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.servicioItems.listByNombreLista(this.lista).subscribe(data => {
      this.options = data;
    });
  }

  /** Método encargado de emitir Id de la opción seleccionada
   * @param optionId variable tipo numerica con valor ID
   * de opción seleccionada
   */
  select(optionId: number): void {
    this.optionIdSelected.emit(optionId);
  }
}
