import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ListaItemsService } from 'src/app/administracion/listas-items/services/listas-items.service';

/** Componente encargado de gestionar el componente de detalle */
@Component({
  selector: 'sigma-detail',
  templateUrl: './sigma-detail.component.html'
})
export class SigmaDetailComponent implements OnInit {

  /** Variable usada para recibir la lista en la invocación 
   * del componente */
  @Input("lista")
  lista: string;

  /** Variable usada para recibir la el valor tipo String
    * en la invocación del componente */
  @Input("value")
  value: number;

  /** objeto devuelve opcion seleccionada al tener un evento */
  @Output()
  optionIdSelected = new EventEmitter<number>();
  /** Variable usada para recibir la el valor tipo String */
  valor: string = '';


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicioItems Servicio Items usado en el componente para gestionar las peticiones
  */
  constructor(
    private servicioItems: ListaItemsService
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    if (this.value) {
      this.servicioItems.listByNombreLista(this.lista).subscribe(data => {
        for (let i = 0; i < Object.keys(data).length; i++) {
          if (data[i].id == this.value) {
            this.valor = data[i].valor;
            break;
          }
        }
      });
    }
  }

  /** Método encargado de emitir la opcion seleccionada
   * @param optionId objeto de tipo numérico a usar
  */
  select(optionId: number): void {
    this.optionIdSelected.emit(optionId);
  }

  /** Método encargado de ejecutar método ngOnInit al cargar el componente */
  ngOnChanges(changes) {
    this.ngOnInit();
  }
}
