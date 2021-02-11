import { UtilitiesService } from './../../../shared/services/utilities.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ListaItem } from '../models/listas-items.model';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ListaItemsService } from '../services/listas-items.service';
import { Lista } from '../../listas/models/lista.model';
import { CONST_ADMINISTRACION_LISTAS_ITEM } from '../listas-items.constant';
import { ListasService } from '../../listas/services/listas.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la eliminación de un item de la lista */
@Component({
  selector: 'app-listas-items-delete',
  templateUrl: './listas-items-delete.component.html'
})
export class ListasItemsDeleteComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LISTAS_ITEM;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  lista: Lista = new Lista();
  /** Id de la lista que se desea procesar */
  key: number;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  listaItem: ListaItem = new ListaItem();
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
   /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledBtn: boolean = false;

 /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param servicioLista Servicio usado en el componente para gestionar las peticiones de listas
  * @param data Información a procesar
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param _utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ListasItemsDeleteComponent>,
    private servicio: ListaItemsService,
    private servicioLista: ListasService,
    private _utilitiesService: UtilitiesService,
    private dataGenericService: DataGenericService,
    private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) data: ListaItem ) {
    this.lista = data['lista'];
    this.key = data['key'];
    this.listaItem = data['listaItem'];
    this.form = fb.group(
      {
        id: [this.listaItem.id, Validators.required]
      }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog*/
  close() {
    this.dialogRef.close(0);
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.disabledBtn = true;
    this.lista.items[this.key].activo = false;
    this.servicio.updateLista(this.lista).subscribe(
      data => {
        this.disabledBtn = false;
        this.dialogRef.close(this.form.value);
        this.snackBar.open(this.constants.deleteSuccess, 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
        this.dataGenericService.removeCacheListContain(this.lista.nombre);
        this.servicioLista.solicitarActualizacionModel(data);
      },
      error => {
        this.disabledBtn = false;
        this._utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

}
