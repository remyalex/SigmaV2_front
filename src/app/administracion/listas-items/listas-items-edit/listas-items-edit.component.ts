import { CONST_ADMINISTRACION_LISTAS_ITEM } from './../listas-items.constant';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { ListaItem } from '../models/listas-items.model';
import { ListaItemsService } from '../services/listas-items.service';
import { Lista } from '../../listas/models/lista.model';
import { ListasService } from '../../listas/services/listas.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la edición de un item de lista*/
@Component({
  selector: 'app-listas-items-edit',
  templateUrl: './listas-items-edit.component.html'
})
export class ListasItemsEditComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LISTAS_ITEM;
  /** Variable encargada listado de objetos de tipo modelo */
  listaItems: ListaItem;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  lista: Lista;
  /** Clon del objeto que se va a modificar información */
  cloneListaItem: any;
  /** Posicion en grilla del elemento seleccionado */
  pos: number;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledBtn_Login = false;

 /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param data Información a procesar
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param fb Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesServices Componente de utilidades de peticiones a servicios
   * @param servicioLista Componente para invecación servicios de listas items
   */
  constructor(
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ListasItemsEditComponent>,
    private fb: FormBuilder,
    private servicio: ListaItemsService,
    private servicioLista: ListasService,
    private dialog: MatDialog,
    private dataGenericService: DataGenericService,
    @Inject(MAT_DIALOG_DATA) data: any ) {
    this.lista = data['lista'];
    this.listaItems = data['listaItem'];
    this.pos = data['pos'];
    this.cloneListaItem = JSON.stringify(this.listaItems);
    this.form = fb.group(
      {
        id: [this.listaItems.id, Validators.required],
        listaId: [this.lista.id, Validators.required],
        valor: [{value: null, disabled: true}, Validators.compose([
          Validators.required,
          Validators.maxLength(100),
        ])],
        descripcion: [null, Validators.compose([
          Validators.required,
          Validators.maxLength(100),
        ])],
        activo: [this.listaItems.activo, Validators.required],
        // eliminado: [this.listaItems.eliminado, Validators.required],
      }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.listaItems = JSON.parse(this.cloneListaItem);
        this.lista.items[this.pos] = this.listaItems;
        this.servicioLista.solicitarActualizacionModel(this.lista);
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.form);
    if (this.form.valid == true) {
      this.disabledBtn_Login = true;
      this.save();
    } else {
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    // tslint:disable-next-line: forin
    for (let inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.updateLista(this.lista).subscribe(
      data => {
        this.disabledBtn_Login = false;
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.dataGenericService.removeCacheListContain(this.lista.nombre);
        this.dialogRef.close(1);
        this.servicioLista.solicitarActualizacionModel(data);
      },
      error => {
        this.disabledBtn_Login = false;
        if (error.status == 400)
        {
          this.snackBar.open(error.error[0].message, 'X', {
            duration: 10000,
            panelClass: ['error-snackbar']
          });
        }

        if (error.status == 500 || error.status == 0)
        {
          this.snackBar.open('Se presento un problema con el servidor, por favor comuníquese con el administrador', 'X', {
          duration: 10000,
          panelClass: ['error-snackbar']
        });
        }
      }
    );
  }

 /**
   * Método encargado de actualizar el valor de la llista
   * en el modelo del negocio
   *
   * @param _listaId Id de la lista a actualizar
   **/
  setPadreId (_ListaId: number){
    this.form.value.ListaId = _ListaId;
  }
}
