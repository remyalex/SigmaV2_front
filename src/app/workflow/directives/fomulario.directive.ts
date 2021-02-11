import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[formulario-host]',
})
export class FormularioDirective {

  /**
  * Método encargado de construir una instancia del componente
  */
  constructor(public viewContainerRef: ViewContainerRef) { }
}

