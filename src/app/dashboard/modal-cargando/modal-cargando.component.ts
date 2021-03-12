import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal-cargando',
  templateUrl: './modal-cargando.component.html',
  styleUrls: ['./modal-cargando.component.scss']
})
export class ModalCargandoComponent implements OnInit {

  mostrarModal = false;


  progreso:boolean;


  cancelable:boolean;

  @Output()
  cancelar = new EventEmitter();

  porcentajeProgreso: number;

  constructor() {
    this.mostrarModal = false;
    this.porcentajeProgreso = 0;

  }

  ngOnInit() {
  }

  cerrarModalEvt() {
    this.mostrarModal = false;
  }

  mostrarPanel () {
    this.mostrarModal = true;
  }

  ocultarPanel () {
    this.mostrarModal = false;
  }


}
