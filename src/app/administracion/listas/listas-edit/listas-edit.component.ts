import { ListasService } from './../services/listas.service';
import { Component, OnInit, Inject, ViewChild, KeyValueDiffer, KeyValueDiffers, KeyValueChanges } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatSort, MatDialogConfig, MatDialog, MatSnackBar, MatTableDataSource } from "@angular/material";
import { Lista } from "../models/lista.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ListasItemsDatasource } from "../../listas-items/services/listas-items.datasource";
import { ListaItemCriteria } from "../../listas-items/models/listas-items-criteria.model";
import { ListaItemsService } from "../../listas-items/services/listas-items.service";
import { ListaItem } from "../../listas-items/models/listas-items.model";
import { ListasItemsEditComponent } from "../../listas-items/listas-items-edit/listas-items-edit.component";
import { ListasItemsCreateComponent } from "../../listas-items/listas-items-create/listas-items-create.component";
import { ListasItemsDeleteComponent } from "../../listas-items/listas-items-delete/listas-items-delete.component";
import { ListasItemsDetailComponent } from "../../listas-items/listas-items-detail/listas-items-detail.component";
import { ExcelService } from 'src/app/shared/services/excel.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { debug } from 'util';
import { CONST_ADMINISTRACION_LISTAS } from '../listas.constant';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

/** Componente encargado de gestionar la edición de una lista*/
@Component({
  selector: "app-listas-edit",
  templateUrl: "./listas-edit.component.html"
})
export class ListasEditComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LISTAS;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  lista: Lista;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Clon del objeto que se va a modificar información */
  cloneListaItem:any;
  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disabledBtn_Login = false;
  /** Variable usada para identificar si el componente se encuentra cargando información */
  isChanging = false;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource = new MatTableDataSource();
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new ListaItemCriteria();
  /** Definición de las columnas presentadas en la grilla */
  columns = ['valor', 'descripcion', 'activo', 'acciones'];
  /**  Nombres de columnas que presentará la grilla de mantenimiento usada en el componente */
  headers = [{
    valor: 'Valor',
    descripcion: 'Nombre',
    activo: 'activo'
  }];
  /** Clon del objeto que se va a modificar información */
  clone:any = {};
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  private customerDiffer: KeyValueDiffer<string, any>;

  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;


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
   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
   * @param differs Elemento usado para mantener la información clonada.
   * @param servicioItem Componente usado para gestionar las solicitudes de items de listas
   * @param servicioLista Componente usado para gestiones de listas
   */
  constructor(
    private dialogRef: MatDialogRef<ListasEditComponent>,
    public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Lista,
    private servicioItem: ListaItemsService,
    private servicioLista: ListasService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private excelService: ExcelService,
    private differs: KeyValueDiffers,
    private utilitiesService: UtilitiesService,
  ) {
    this.lista = data;
    this.criteria.listaId = data.id;
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.servicioLista.modelIsChange$.subscribe( (result:any) => {
      if(typeof result.id !== 'undefined'){
        if(result.id === this.lista.id){
          this.dataSource = new MatTableDataSource(result.items);
          this.lista = result;
          this.clone = JSON.parse(JSON.stringify(this.lista));
        }
      }
    });
    this.loaddata();

    this.clone = JSON.parse(JSON.stringify(this.lista));
    this.customerDiffer = this.differs.find(this.lista).create();
    if (this.lista.deSistema) {
      this.form = this.fb.group({
        id: [this.lista.id, Validators.required],
        nombre: [{ value: this.lista.nombre, disabled: true }, Validators.compose([Validators.required, Validators.maxLength(100)])],
        descripcion: [this.lista.descripcion, Validators.compose([Validators.required, Validators.maxLength(100)])],
        activo: [this.lista.activo, Validators.required],
        deSistema: [{value: null, disabled: true}, Validators.compose([ Validators.required ])],
        items: [this.lista.items, null]
      });
    } else {
      this.form = this.fb.group({
        id: [this.lista.id, Validators.required],
        nombre: [{ value: this.lista.nombre, disabled: false }, Validators.compose([Validators.required, Validators.maxLength(100)])],
        descripcion: [this.lista.descripcion, Validators.compose([Validators.required, Validators.maxLength(100)])],
        activo: [this.lista.activo, Validators.required],
        deSistema: [{value: null, disabled: false}, Validators.compose([ Validators.required ])],
        items: [this.lista.items, null]
      });
    }
  }

   /**
   * Método encargado de cargar los datos según el criterio enviado como parámetro
   *
   * @param criteria Objeto de tipo Criteria con los filtros de la consulta a realizar
   */
  loaddata() {
    this.dataSource = new MatTableDataSource(this.lista.items);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.loaddata();
        for (let key in this.lista) {
          this.lista[key] = this.clone[key];
        }
        this.dialogRef.close();
      }
    });
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    this.markAndValidateAllInputs(this.form);
    // this.enviada = true;

    if (this.form.valid == true) {
      this.disabledBtn_Login = true;
      this.save();
    } else {
      this.snackBar.open("Favor revise el formulario", "X", {
        duration: 5000,
        panelClass: ["warning-snackbar"]
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
    this.servicioLista.update(this.lista).subscribe(
      data => {
        this.dialogRef.close(this.form.value);
        this.disabledBtn_Login = false;
        this.snackBar.open(this.constants.successSave, "X", {
          duration: 5000,
          panelClass: ["success-snackbar"]
        });
      },
      error => {
        this.disabledBtn_Login = false;
        if (error.status == 400) {
          this.snackBar.open(error.error[0].message, 'X', {
            duration: 10000,
            panelClass: ['error-snackbar']
          });
        }
        if (error.status == 500 || error.status == 0) {
          this.snackBar.open(this.constants.error500, 'X', {
            duration: 10000,
            panelClass: ['error-snackbar']
          });
        }
      }
    );
  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.criteria.page = this.paginator.pageIndex;
      this.criteria.size = this.paginator.pageSize;
    });

    this.sort.sortChange.subscribe(() => {
      this.criteria.sortBy = this.sort.active;
      this.criteria.sortOrder = this.sort.direction || "asc";
      this.paginator.pageIndex = 0;
    });
  }

  /** Método encargado de llamar el componente de creación de items de listas */
  createItem(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.lista;

    const dialogRef = this.dialog.open(ListasItemsCreateComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val !== 0) {
        this.loaddata();
      }
    });
  }

  /**
   * Método encargado de llamar el componente de edición de items de listas
   *
   * @param key id de la lista del ítem a editar
   * @param listaItem Lista item que se desea editar
   **/
  editItem(pos:number, listaItem: ListaItem): void {
    this.cloneListaItem = JSON.stringify(listaItem);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      lista: this.lista,
      listaItem: listaItem,
      pos: pos
    };
    const dialogRef = this.dialog.open(ListasItemsEditComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val !== 0) {
        this.loaddata();
      }
    });
  }

 /**
  * Método encargado de llamar el componente de eliminación de items de listas
  *
  * @param key id de la lista del ítem a eliminar
  * @param listaItem Lista item que se desea eliminar
  **/
 deleteItem(key: number, listaItem: ListaItem): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      listaItem: listaItem,
      lista: this.lista,
      key: key
    };

    const dialogRef = this.dialog.open(ListasItemsDeleteComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val !== 0) {
        this.loaddata();
      }
    });
  }

  /**
   * Método encargado de llamar el componente de ver detalle de items de listas
   *
   * @param lista Objeto tipo lista de la cual se gestionaran los items
   */
  detailItem(lista: Lista): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = lista;

    const dialogRef = this.dialog.open(ListasItemsDetailComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(val => {
      this.loaddata();
    });
  }

  /** Método encargado de notificar los cambios del componente check hacia el modelo */
  ngDoCheck(): void {
    const changes = this.customerDiffer.diff(this.lista);
    if (changes) {
      this.customerChanged(changes);
    }
  }

  /**
   * Método en cargado de actualizar el modelo del componente una
   * vez notificado un cambio en los campos
   *
   * @param changes Diccionario de claves que se modificaron
   */
  customerChanged(changes: KeyValueChanges<string, any>) {
    changes.forEachChangedItem((record: any) => {
      if (record.key.length > 2 && record.key.search('Id') > -1) {
        this.servicioLista
          .searchByList(
            this.constants['permisos_administracion_listas_' + record.key],
            this.lista[record.key]
          )
          .then(data => {
            if (data) {
              this.lista[record.key.replace('Id', '') + 'Valor'] = data.valor;
            }
          });
      }
    });
  }
}
