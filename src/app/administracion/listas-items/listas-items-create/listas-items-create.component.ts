import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { ListaItem } from '../models/listas-items.model';
import { ListaItemsService } from '../services/listas-items.service';
import { CONST_ADMINISTRACION_LISTAS_ITEM } from '../listas-items.constant';
import { Lista } from '../../listas/models/lista.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { ListasService } from '../../listas/services/listas.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la creación de insumos*/
@Component({
  selector: 'app-listas-items-create',
  templateUrl: './listas-items-create.component.html'
})
export class ListasItemsCreateComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LISTAS_ITEM;
  /** Variable encargada listado de objetos de tipo modelo */
  listaItem: ListaItem = new ListaItem();
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  lista: Lista;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledBtn_Login = false;
  /** Total de elementos presentados al usuario en la grilla */
  totalElementos: number = 0;

   /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param data Información a procesar
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   * @param servicioLista Componente para invecación servicios de listas items
   */
  constructor(
    private dialogRef: MatDialogRef<ListasItemsCreateComponent>,
    private snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private servicio: ListaItemsService,
    private servicioLista: ListasService,
    private dialog: MatDialog,
    private dataGenericService: DataGenericService,
    @Inject(MAT_DIALOG_DATA) data: Lista,
    private utilitiesService: UtilitiesService
  ) {
    this.lista = data;
    this.listaItem = new ListaItem();
    this.listaItem.listaId = data.id;
    this.listaItem.activo = true;
    this.totalElementos = this.lista.items.length > 0 ? this.lista.items.length : 0;
    this.form = this.formBuilder.group({
      activo: [true, Validators.compose([])],
      listaId: [this.listaItem.listaId, Validators.required],
      valor: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      descripcion: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {}

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
        try {
          this.lista.items.slice(this.totalElementos, 1);
        } catch (error) { }
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
      this.snackBar.open(this.constants.errorForm, 'X', {
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
    this.lista.items[this.totalElementos] = this.listaItem;
    this.lista.items = this.utilitiesService.uniqArray(this.lista.items);
    this.servicio.updateLista(this.lista).subscribe(
      data => {
        this.lista = data;
        this.servicioLista.solicitarActualizacionModel(this.lista);
        this.disabledBtn_Login = false;
        this.dialogRef.close(this.form.value);
        this.dataGenericService.removeCacheListContain(this.lista.nombre);
        this.snackBar.open(this.constants.successSave, 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        try {
          this.lista.items.slice(this.totalElementos, 1);
        } catch (error) { }
        this.disabledBtn_Login = false;
        if (error.status == 400)
        {
          this.snackBar.open(error.error[0].message, 'X', {
            duration: 10000,
            panelClass: ['error-snackbar']
          });
        }

        if (error.status == 500  || error.status == 0)
        {
          this.snackBar.open(this.constants.error500, 'X', {
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
  setPadreId(_listaId: number) {
    this.form.value.listaId = _listaId;
  }
}
