import { Component, OnInit, Inject } from '@angular/core';
import { ListaItem } from '../models/listas-items.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

/** Componente encargado de gestionar la visualización de un item de lista*/
@Component({
  selector: 'app-listas-items-detail',
  templateUrl: './listas-items-detail.component.html'
})
export class ListasItemsDetailComponent implements OnInit {

  lista: ListaItem;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;

/**
  * Método encargado de construir una instancia de la clase
  *
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param data Información a procesar
  * @param fb Componente usado para Agrupar elementos en el formulario
  */
  constructor(
    private dialogRef: MatDialogRef<ListasItemsDetailComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: ListaItem )
    {
    this.lista = data;

    this.form = fb.group(
      {
        id: [this.lista.id, Validators.required],
        valor: [this.lista.valor, Validators.required],
        descripcion: [this.lista.descripcion, Validators.required],
        activo: [this.lista.activo, Validators.required],
      }
    );
  }
  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }
  /** Método encargado de gestionar el cierre del dialog del componente */
  close () {
    this.dialogRef.close();
  }

}
