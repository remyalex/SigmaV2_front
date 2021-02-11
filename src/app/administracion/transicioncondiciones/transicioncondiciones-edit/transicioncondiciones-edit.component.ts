import { OPERADORES_ALL, OPERADORES_BASICOS, OPERADORES_LOGICOS } from './../transicioncondiciones.constants';
import { TransicioncondicionesDeleteComponent } from './../transicioncondiciones-delete/transicioncondiciones-delete.component';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { CONST_ADMINISTRACION_TRANSICIONCONDICIONES } from '../transicioncondiciones.constants';
import { CondicionService } from '../services/transicioncondiciones.services';
import { Condiciones } from '../models/condiciones.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Termino } from '../models/termino.model';
import { ValorInputComponent } from '../valor-input/valor-input.component';
import { MatTableDataSource, MatDialogConfig, MatSnackBar, MatDialog, MAT_DIALOG_DATA,
  MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { RouterModule, Router } from '@angular/router';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { TerminoService } from '../services/termino.services';

/** Componente encargado de gestionar la edición de una condición de la transición*/
@Component({
  selector: 'app-transicioncondiciones-edit',
  templateUrl: './transicioncondiciones-edit.component.html'
})
export class TransicioncondicionesEditComponent implements OnInit {

  /** Valor de transición que ingresa */
  @ViewChild('valor') valorComponent: ValorInputComponent;
  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator) paginator: MatPaginator;

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TRANSICIONCONDICIONES;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  condicion: Condiciones;
  /** Termino asociado a la condicion a crear */
  termino: Termino;
  /** Listado de atributos del termino */
  listAtributos;
  /** Listado de términos de la condición */
  listaTerminos;
  /** Variable que se encarga de Mostrar o no la informacion en el componente  */
  noInfoToShow;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  /** Listado de términos */
  terminosArray = [];
  /** Atributo de termino actual */
  atributo;
  /** Consecutivos usados para los términos de las condiciones */
  consecutivos = [];
  /** Consecutivo maximo de la condicion */
  maxConsecutivo = 0;
  /** Bandera que identifica si el termino solicita ser eliminado por el usuario */
  eliminarTermino = false;
  /** Bandera que permite identificar si el atributo actual esta oculto */
  hideAtributo = true;
  /** Bandera que permite identificar si el operador actual esta oculto */
  hideOperador = true;
  /** Bandera que permite identificar si el valor actual esta oculto */
  hideValor = true;
  /** Bandera que permite identificar si el boton enviar está desabilitado */
  disabledAddButton = true;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'consecutivo',
    'operadorLogico',
    'atributo',
    'operador',
    'descripcionValor',
    'acciones'
  ];
  /** Listado de operadores lógicos admitidos */
  operadoresLogicos =  OPERADORES_LOGICOS;

  /** Listado de operadores a utilizar */
  todosOperadores = OPERADORES_ALL;
  operadoresBasicos = OPERADORES_BASICOS;

  /** Listado de operadores permitidos */
  operadores = [];

   /**
   * Método encargado de construir una instancia de componente
   *
   * @param service Servicio usado en el componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param data Información a procesar
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param differs Elemento usado para mantener la información clonada.
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesServices Componente de utilidades de peticiones a servicios
   * @param terminoServices Componente de servicios para terminos de las condiciones
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private service: CondicionService,
    private formBuilder: FormBuilder,
    private router: Router,
    private utilitiesServices: UtilitiesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<TransicioncondicionesEditComponent>,
    private terminoServices: TerminoService
  ) {
    this.condicion = data;
    this.termino = new Termino();
    this.form = this.formBuilder.group({
      nombre: [null, Validators.compose([Validators.required])],
      descripcion: [null, Validators.compose([Validators.required])],
      atributo: [null],
      operadorLogico: [null],
      operador: [null],
      valor: [null],
      consecutivo: [1, Validators.compose([Validators.required])],
      activo: [null]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.condicion.terminos = [];
    this.setConsecutivoTermino(1);
    this.createListConsecutivosTerminos();
    this.terminoServices.getListTerminosByCondicion(this.condicion.id).subscribe(lista => {
      this.condicion.terminos = lista;
      this.loadData();
      this.createListConsecutivosTerminos();
      this.setConsecutivoTermino(this.condicion.terminos.length + 1);
    });

    this.service.getListAtributos().subscribe(
      (listAtributos: any[]) => {
        this.listAtributos = listAtributos;
      }
    );
  }

   /**
   * Método encargado de solicitar el listado de los pks al servicio
   */
  loadData() {
    this.listaTerminos = new MatTableDataSource(this.condicion.terminos);
    this.listaTerminos.paginator = this.paginator;
  }

   /**
   * Operador lógico a actualizar en el modelo
   *
   * @param operadorLogico Operador lógico a actualizar en el modelo
   */
  setOperadorLogico(operadorLogico) {
    this.termino.operadorLogico = operadorLogico;

    if (operadorLogico === 'AND (' || operadorLogico === 'OR (' || operadorLogico === 'AND NOT (' ||
      operadorLogico === 'OR NOT (' || operadorLogico === ')') {
      this.hideAtributo = true;
      this.hideOperador = true;
      this.hideValor = true;
      this.limpiarFormulario();
      this.disabledAddButton = false;

    } else {
      this.hideAtributo = false;
    }
  }

  /**
   * Método encargado de actualizar el órden consecutivo del término
   * en el modelo
   *
   * @param consecutivo valor de consecutivo a actualizar
   */
  setConsecutivoTermino(consecutivo) {
    this.termino.orden = consecutivo;
  }

  /**
   * Método encargado de crear crear los consecitivos de los terminos
   * según nummero de términos
   */
  createListConsecutivosTerminos() {
    this.consecutivos = [];
    if (this.condicion.terminos === null || this.condicion.terminos === undefined || this.condicion.terminos.length === 0) {
      this.maxConsecutivo = 1;
    } else {
      this.maxConsecutivo = this.condicion.terminos.length + 1;
    }

    for (let i = 1; i <= this.maxConsecutivo; i++) {
      this.consecutivos.push(i);
    }
    this.setConsecutivoTermino(this.maxConsecutivo);
    this.form.get('consecutivo').setValue(this.maxConsecutivo);
  }

  /**
   * Método encargado de actualizar la información de los atributos de la condición
   * teniendo en cuenta los operadores
   *
   * @param atributo Objeto atributo con los datos a actualizar en los términos
   **/
  setAtributo(atributo: any) {
    this.hideOperador = false;
    this.atributo = atributo;
    this.termino.valor = '';
    this.valorComponent.clear();
    this.limpiarFormulario();
    this.valorComponent.chooseInput(this.atributo);
    this.termino.atributo = atributo.nombre;
    if (atributo) {
      if (
        atributo.tipo === 'LISTA_TIPO_INTERVENCION' ||
        atributo.tipo === 'LISTA_BARRIO' ||
        atributo.tipo === 'LISTA_ZONA' ||  atributo.tipo === 'LISTA_CUADRANTE' ||
        atributo.tipo === 'LISTA_LOCALIDAD' || atributo.tipo === 'LISTA_UPZ' ||
        atributo.tipo === 'LISTA_ACTIVIDAD' || atributo.tipo === 'LISTA_ITEM' ||
        atributo.tipo === 'BOOLEAN' || atributo.tipo === 'NVARCHAR2' ||
        atributo.tipo === 'VARCHAR2' ) {
          this.operadores = this.operadoresBasicos;
        } else {
          this.operadores = this.todosOperadores;
      }
    }
  }

  /**
   * Método encargado de actualizar el operador en un termino.
   *
   * @param operador Operador del término que se modificó
   */
  setOperador(operador) {
    this.hideValor = false;
    this.termino.operador = operador;
    if (operador !== 'NOT NULL' && operador !== 'NULL') {
      this.valorComponent.chooseInput(this.atributo);
      this.disabledAddButton = true;
    } else {
      this.hideValor = true;
      this.termino.valor = '';
      this.valorComponent.clear();
      this.limpiarFormulario();
      this.disabledAddButton = false;
    }
  }

  /**
  * Método encargado de actualizar la información del valor de atributo indicado 
  *
  * @param valor Valor del elemento actualizado
  */
 setValor(valor) {
    if (typeof (valor) === 'object') {
      this.termino.valor = valor.id;
      this.termino.descripcionValor = valor.descripcion;
    } else {
      this.termino.valor = valor;
      this.termino.descripcionValor = valor;
    }
    this.disabledAddButton = false;
  }

  /** Método encargado de gestionar la adicion de un nuevo termino a la condición */
  add() {
    this.validarConsecutivo();
    this.condicion.terminos.push(this.termino);
    this.condicion.terminos.sort(function (a, b) {
      return a.orden - b.orden;
    });
    this.termino = new Termino();
    this.createListConsecutivosTerminos();
    this.loadData();
    this.form.get('operadorLogico').setValue('');
    this.form.get('atributo').setValue('');
    this.form.get('operador').setValue('');
    this.form.get('valor').setValue('');
    this.form.get('consecutivo').setValue(this.maxConsecutivo);
    this.valorComponent.clear();
    this.hideValor = true;
    this.hideAtributo = true;
    this.hideOperador = true;
    this.limpiarFormulario();
    this.disabledAddButton = true;
  }

  /** Método encargado de validar los consecutivos de los términos generados */
  validarConsecutivo() {
    for (var term of this.condicion.terminos) {
      if (this.eliminarTermino && term.orden > this.termino.orden && term.orden > 1) {
        term.orden--;
      } else if (!this.eliminarTermino && term.orden >= this.termino.orden) {
        term.orden++;
      }
    }
    this.eliminarTermino = false;
  }

   /**
   * Método encargado de limpiar los campos del formulario
   * y reinicar sus datos al estado inicial
   **/
  limpiarFormulario() {
    if (this.hideAtributo) {
      this.form.get('atributo').setValue('');
      this.termino.atributo = null;
    }

    if (this.hideOperador) {
      this.form.get('operador').setValue('');
      this.termino.operador = null;
    }

    if (this.hideValor) {
      this.form.get('valor').setValue('');
      this.termino.valor = null;
      this.termino.descripcionValor = null;
    }
  }

  /**
   * Método encargado de invocar el componente de eliminación del registro seleccionado
   * en la grilla desde el listado actual
   *
   * @param termino Objeto que encapsula los datos del registro seleccionado
   * que se va a eliminar
   */
  delete(termino) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dataOrigen = { condicion: termino, origen: 'noDeleteOnModal' };
    dialogConfig.data = dataOrigen;
    const dialogRef = this.dialog.open(TransicioncondicionesDeleteComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(val => {
      if (val) {
        for (let term = 0; term < this.condicion.terminos.length; term++) {
          if (JSON.stringify(termino) === JSON.stringify(this.condicion.terminos[term])) {
            this.condicion.terminos.splice(term, 1);
          }
        }
        this.termino = termino;
        this.eliminarTermino = true;
        this.validarConsecutivo();
        this.createListConsecutivosTerminos();
        this.loadData();
      }
    });
  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.service.update(this.condicion).subscribe(
      data => {
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close();
      },
      error => {
        this.disableSubmit = false;
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }


  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    this.disableSubmit = true;
    if (this.form.valid === true) {
      this.disableSubmit = true;
      this.save();
    } else {
      this.disableSubmit = false;
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
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  /** Método encargado de devolver a la página principal el componente */
  onBack(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          this.dialogRef.close();
        }
      }
    );
  }

}
