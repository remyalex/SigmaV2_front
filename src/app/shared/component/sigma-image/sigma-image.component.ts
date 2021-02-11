import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DataGenericService } from '../../services/data-generic.service';

/** Componente encargado de geestionar las imagenes cargadas externas del aplicativo */
@Component({
  selector: 'sigma-image',
  templateUrl: './sigma-image.component.html'
})
export class SigmaImageComponent implements OnInit, OnChanges {

  /** Listado de fotos a cargar */
  @Input('fotos') fotos: [];

  /** Listado de foros que se pueden presentar al usuario */
  fotosMostrar: [];


  /**
  * Método encargado de construir una instancia
  */
  constructor(private servicio: DataGenericService) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }


  /**
   * Método encargado de gestionar los cambios de modelo
   * cuando se adiciona o elimina una imagen (foto)
   *
   * @param changes Cambios detectados en el modelo
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (typeof changes.fotos.previousValue !== 'undefined') {
    }
  }
}
