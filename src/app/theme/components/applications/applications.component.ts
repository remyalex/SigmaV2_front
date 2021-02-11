import { Component, OnInit, ViewEncapsulation } from '@angular/core';

/** Componente encargado de gestionar el componente aplicación*/
@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ApplicationsComponent implements OnInit {

  /** Método encargado de construir una instancia de componente */
  constructor() { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}