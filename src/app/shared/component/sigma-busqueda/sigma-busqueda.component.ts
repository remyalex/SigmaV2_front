import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CONST_SHARED } from '../../constantes-shared';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { DataGenericService } from '../../services/data-generic.service';

/** Componente encargado de gestionar el componente de busquedas */
@Component({
  selector: 'sigma-busqueda',
  templateUrl: './sigma-busqueda.component.html',
  styleUrls: ['./sigma-busqueda.component.scss']
})
export class SigmaBusquedaComponent implements OnInit {

  /** Objeto que emite o retorna valores al componente suscrito */
  @Output()
  public emitir = new EventEmitter<string>();
  /** Constantes a usar en el componente */
  public constants = CONST_SHARED;
  /** Bandera para indicar si el componente se encuentra en procesamiento por el servicio  */
  public cargando = false;
  /** Bandera para indicar si el componente se encuentra vinculado */
  public vinculado = false;
  /** Bandera para indicar si en las peticiones se encuentran errores */
  public error = false;
  /** Variable usada para recibir en la invocación del componente */
  @Input('autoEmitir') autoEmitir: boolean = true;
  /** Variable usada para recibir título en la invocación del componente */
  @Input('titulo') titulo: string = '';
  /** Variable usada para recibir ruta en la invocación del componente */
  @Input('path') path: string = '';
  /** Variable usada para recibir valor en la invocación del componente */
  @Input('valor') valor: string = '';
  /** Variable usada para recibir lista de títulos en la invocación del componente */
  @Input('titulos') titulos: any = [
    this.constants.radicado.numero,
    this.constants.radicado.fechaRadicado,
    this.constants.radicado.fechaVencimiento,
    this.constants.radicado.entidad,
    this.constants.radicado.remitente,
    this.constants.acciones,
  ];
  /** variable que recibe valor del objeto de entrada 'valor' */
  public value = '';
  /** variable que recibe valor del objeto de entrada 'títulos' */
  public datos = [];
  /**  Bandera para indicar si se realizó la vinculación del radicado */
  public vincularRadicado: boolean = true;

  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param dialog Componente gráfico usado para presentar cuadros de dialogo
  * @param segvicioGeneral Servicio usado en el componente para gestionar las peticiones generales
  * @param snackBar Componente usado para abrir un recuadro modal
  */
  constructor(
    public dialog: MatDialog,
    public segvicioGeneral: DataGenericService,
    private snackBar: MatSnackBar,
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.value = this.valor;
  }

  /** Método encargado de invocar la petición de consulta
  * al servicio */
  buscar(): void {
    this.vinculado = false;
    this.cargando = true;
    this.segvicioGeneral.detailAny(this.path + this.value).subscribe(data => {
      if (data) {
        if (data.radicacion !== 'undefined') {
          this.datos = [];
          if (this.titulos.indexOf(this.constants.radicado.numero) !== -1) {
            this.datos = [...this.datos, ...data.radicacion.numeroRadicado];
            if (this.autoEmitir) {
              this.error = false;
              this.vinculado = true;
              this.emitir.emit(data.radicacion.numeroRadicado);
            }
          }
          if (this.titulos.indexOf(this.constants.radicado.fechaRadicado) !== -1) {
            this.datos = [...this.datos, ...data.radicacion.fechaRadicacion];
          }
          if (this.titulos.indexOf(this.constants.radicado.fechaVencimiento) !== -1) {
            this.datos = [...this.datos, ...data.radicacion.fechaVencimiento];
          }
          if (this.titulos.indexOf(this.constants.radicado.entidad) !== -1) {
            const entidadDatos: any = data.remitente.nombresRemitente + ' ' + data.remitente.nombresRemitente;
            this.datos = [...this.datos, ...entidadDatos];
          }
          if (this.titulos.indexOf(this.constants.radicado.remitente) !== -1) {
            const remitenteDatos: any = data.remitente.nombresRemitente + ' ' + data.remitente.nombresRemitente;
            this.datos = [...this.datos, ...remitenteDatos];
          }
          if (this.titulos.indexOf(this.constants.radicado.asunto) !== -1) {
            this.datos = [...this.datos, ...data.radicacion.asunto];
          }
          if (this.titulos.indexOf(this.constants.acciones) == -1) {
            this.vincularRadicado = false;
          }
        } else {
          this.snackBarError();
          this.datos = [];
          this.error = true;
        }
      } else {
        this.snackBarError();
        this.datos = [];
        this.error = true;
      }
      this.cargando = false;
    },
      error => {
        this.snackBarError();

        this.datos = [];
        this.error = true;
        this.cargando = false;
      });

    this.emitir.emit(null);
  }

  /** Método encargado de mostrar errores en snackBar */
  snackBarError(): void {
    this.snackBar.open(this.constants.noRadicado, 'X', {
      duration: 10000,
      panelClass: ['error-snackbar']
    });
  }

  /** Método encargado de llamar el componente de confirmación y
   * marcar como vinculado 
   */
  vincular(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      mensaje: this.constants.vincular.mensaje
    };
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val == 1) {
          this.vinculado = true;
          this.error = false;
          this.emitir.emit(this.value);
        } else {
          this.error = false;
          this.emitir.emit(null);
        }
      }
    );
  }
}
