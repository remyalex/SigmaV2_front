import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modalr',
  templateUrl: './modalr.component.html',
  styleUrls: ['./modalr.component.scss']
})
export class ModalrComponent implements OnInit {

  @Input() titulo;
    @Input() btnOk;
    @Input() btnCancel;
    @Input() btnCerrar;
    @Input() maxSize;
    @Output() cerrar = new EventEmitter();
    @Output() cancel = new EventEmitter();
    constructor() {

    }

    ngOnInit() {
    }

    cerrarModal(){
    	this.cerrar.emit();
    }
    cancelModal(){
    	this.cancel.emit();
    }

}
