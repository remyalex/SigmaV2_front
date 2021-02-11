import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { CONST_SHARED } from '../constantes-shared';
import { CommonService } from '../services/common.service';

/**
 * Componente usado para estandarizar el campo de selecciones
 * en todos los formularios del sistema
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-select',
  templateUrl: './sigma-select.component.html'
})
export class SigmaSelectComponent implements OnInit, AfterViewInit {

  /**  Constantes que utiliza el componente */
  constanst = CONST_SHARED;

  /** Variable usada para recibir label en la invocación del componente */
  @Input() label = '';
  /** Variable usada para recibir target en la invocación del componente */
  @Input() target: any;
  /** Variable usada para recibir valor booleano para ocultar el componente */
  @Input() disabled = false;
  /** Variable usada para recibir valor booleano para hacer requerido el componente */
  @Input() required: boolean;
  /** Variable usada para recibir id en la invocación del componente */
  @Input() id = 'id';
  /** Variable usada para recibir display en la invocación del componente */
  @Input() display = 'descripcion';
  /** Variable usada para recibir path o ruta en la invocación del componente */
  @Input() path: string;
  /** variable que recibe valor id del objeto seleccionado */
  selected: any;
  /** variable que recibe resultado de busquedad de elementos a usar */
  options: any = null;
  /** Bandera para indicar si el componente se encuentra en procesamiento por el servicio  */
  loaded = false;


  /**
  * Método encargado de construir una instancia
  * @param commonService Componente usado para invocar los servicios de mantenimiento
  */
  constructor(private commonService: CommonService) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.commonService.getElements(this.path).subscribe((options) => {
      this.options = options;
      this.loaded = true;
    });
  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
    this.selected = this.target.id;
  }

  /** Método encargado de mantener seleccionado el id de la
   * opción seleccionada
   * @param optionId variable tipo String que contiene el Id
   * de opción seleccionada
   */
  select(optionId: string): void {
    const valId: number = +optionId;
    this.target = this.options.filter(x => x[this.id] === valId);
    console.log(this.target);
    this.selected = this.target.id;
  }
}
