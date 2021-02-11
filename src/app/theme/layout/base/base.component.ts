import { Component, OnInit } from '@angular/core';

/** Componente encargado de gestionar el componente base*/
@Component({
  selector: 'app-root',
  templateUrl: './base.component.html'
})
export class BaseComponent implements OnInit {

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
