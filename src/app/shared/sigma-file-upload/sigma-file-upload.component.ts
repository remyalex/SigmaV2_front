import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { UploadFileService } from '../services/upload.file.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { CONST_SHARED } from '../constantes-shared';

/**
 * Componente usado para estandarizar el campo de subida de archivos
 * en todos los formularios del sistema
 */
@Component({
  selector: 'sigma-file-upload',
  templateUrl: './sigma-file-upload.component.html'
})
export class SigmaFileUploadComponent implements OnInit {

  /** variable publica que recibe archivo a gestionar */
  public file = null;
  /** variable publica que recibe lista de archivo a gestionar */
  public files;
  /** variable publica que recibe nombre del modelo */
  public nombreModelo: string;
  /** Constantes a usar en el componente */
  constants = CONST_SHARED;
  /** Variable usada para recibir opcion booleana para
   * aceptación de multiples archivos */
  @Input('multiple') multiple: boolean = false;
  /** Variable usada para recibir valor booleano para hacer
    * requerido el componente */
  @Input('required') required: boolean = false;
  /** Variable usada para recibir modelo de archivo en la invocación del componente */
  @Input('model') model: string = "file";
  /** Variable usada para recibir variable tipo String en la invocación del componente */
  @Input('accept') accept: string;
  /** Variable usada para recibir valor booleano en la invocación del componente */
  @Input('clearFiles') clearFiles: boolean = false;
  /** Variable usada para recibir tipo de respuesta en la invocación del componente */
  @Input('responseType') responseType: String;
  /** Variable usada para recibir título en la invocación del componente */
  @Input() public readOnlyComponent: boolean = true;
  /** Variable usada para recibir cantidad de Elementos en la invocación del componente */
  @Input() cantidadElementos: number;
  /** File seleccionado que devuelve el componente una vez procesada la información */
  @Output() dataFile = new EventEmitter<number>();
  /** Variable boolean que devuelve el componente una vez procesada la información */
  @Output() loadFile = new EventEmitter<Boolean>(); // Utilizarlo para identificar el estado de la carga

  /**
  * Método encargado de construir una instancia de la clase
  * 
  * @param uploadFileService Servicio de carga de archivos
  * @param snackBar Componente usado para abrir un recuadro modal
  */
  constructor(
    private uploadFileService: UploadFileService,
    private snackBar: MatSnackBar,
  ) {
    this.files = [];
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.corregirNombreModelo();
  }

  /** Método encargado al llamado del archivo */
  selectFile(): void {
    this.loadFile.emit(true);
    this.file = document.getElementById(`fileInput-${this.nombreModelo}`) as HTMLElement;

    if (this.multiple) {
      this.file.setAttribute('multiple', true);
    }

    this.file.click();
  }

  /** Método encargado de añadir archivos en lista al componente
   * @param event objeto que contiene archivos a añadir
   */
  addFiles(event) {
    if (!this.multiple) {
      this.files = [];
    }
    const cantTotalElementos = this.cantidadElementos + event.target.files.length;
    if (cantTotalElementos > 6) {
      this.snackBar.open('No se permite cargar más de 6 fotos', 'X', {
        duration: 10000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    for (let file in event.target.files) {
      if (typeof event.target.files[file] == 'object') {
        this.files.push(event.target.files[file]);
        this.cantidadElementos = this.cantidadElementos + 1;
        this.upload(file, this.files[file]);
      }
    }
  }

  /** Método encargado de eliminar archivos cargados
   * @param elemento objeto que contiene archivo a eliminar
   */
  eliminar(elemento): void {
    this.files.splice(elemento, 1);

    this.setFiles(this.files);
  }

  /** Método encargado de reemplazar caracteres no permitidos
   * al nombre del archivo
   */
  corregirNombreModelo(): void {
    this.nombreModelo = this.model.replace('.', '-');
  }

  /** Método encargado de reemplazar archivo
   * @param files objeto con archivo a usar
   */
  setFiles(files): void {
    let ids;
    if (!Array.isArray(files)) {
      this.dataFile.emit(null);
    }
    if (this.responseType === this.constants.objeto) {
      ids = files.map(file => {
        try {
          return file.data;
        } catch (error) { }
      });
    } else {
      ids = files.map(file => {
        try {
          return file.data.id;
        } catch (error) { }
      });
    }
    if (!this.multiple) {
      this.dataFile.emit(ids[0]);
    } else {
      this.dataFile.emit(ids);
    }
    this.loadFile.emit(true);
  }

  /** Método encargado de actualizar archivos de la lista
   * @param key llave de archivo a gestionar
   * @param file archivo a usar actualizar
   */
  upload(key, file: File): void {
    this.files[key].success = true;
    this.uploadFileService.uploadFile(file).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.files[key].progress = Math.round((event.loaded / event.total) * 100);
      } else if (event.type === HttpEventType.Response) {
        this.files[key].success = true;
        this.files[key].data = event.body;
        this.setFiles(this.files);
      }
    },
      error => {
        this.loadFile.emit(false);
        if (error.error.message.indexOf('Maximum upload size exceeded;') !== -1) {
          this.snackBar.open('El tamaño del archivo superó el máximo permitido de 1Mb.', 'X', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        } else {
          this.snackBar.open(error.error.message, 'X', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
        this.files[key].success = false;
      });
  }

  /**
   * Método encargado de ejecutar método 'ngOnInit' al cargar el componente
   * @param changes Cambios detectados en el modelo
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (typeof changes.clearFiles !== 'undefined') {
      if (typeof changes.clearFiles.currentValue !== 'undefined') {
        if (changes.clearFiles.currentValue) {
          this.files = [];
          this.clearFiles = !this.clearFiles;
        }
      }
    }
  }

}