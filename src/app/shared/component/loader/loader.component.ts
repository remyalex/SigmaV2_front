import { Component, OnInit } from '@angular/core';
import { LoaderService } from './loader.service';
import { Subject } from 'rxjs';

/** Componente encargado de gestionar las cargas de componentes */
@Component({
  selector: 'sigma-loader',
  templateUrl: './loader.component.html'
})
export class LoaderComponent implements OnInit {

  /** variable boolean encargada de recibir valor de loaderService */
  isLoading: Subject<boolean> = this.loaderService.isLoading;

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado ocultar o mostrar el componente
  */
  constructor(
    private loaderService: LoaderService
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
