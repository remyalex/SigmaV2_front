import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { UploadFileService } from '../services/upload.file.service';
import { CONST_SHARED } from '../constantes-shared';

/**
 * Componente usado para estandarizar el campo de archivos
 * en todos los formularios del sistema
 */
@Component({
  selector: 'sigma-show-file',
  templateUrl: './sigma-show-file.component.html',
  styleUrls: ['./sigma-show-file.component.scss']
})

export class SigmaShowFileComponent implements OnInit {

  /** Constantes a usar en el componente */
  public constants = CONST_SHARED;
  /** Variable que se encarga de Mostrar o no la informacion en el componente  */
  public show: boolean = false;
  /** variable publica que permite identificar si el formulario se encuentra siendo procesado */
  public loading: boolean = true;
  /** variable publica que recibe archivo a gestionar */
  public file = null;
  /** variable publica que recibe caracter base64 de archivo */
  public base64data: any;
  /** variable publica que recibe ruta de imagen */
  public imageSrc: string = '';
  /** variable publica que recibe peticiónes de consulta o descarga de archivos */
  public petition;
  /** Variable usada para recibir id en la invocación del componente */
  @Input('id') id: number;
  /** Variable usada para recibir valor booleano para mostrar o no el archivo */
  @Input('showFile') showFile: boolean = false;
  /** Entrada de tipo de componente que define la imagen en el formulario */
  @ViewChild('image') image = ElementRef;


  /**
  * Método encargado de construir una instancia de la clase
  * @param uploadFileService Servicio de carga de archivos
  * @param cdRef Referencia a componente de observable para saber si ha cambiado el valor del componente
  */
  constructor(
    private uploadFileService: UploadFileService,
    private cdRef: ChangeDetectorRef,
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    if (this.id) {
      this.show = true;
    } else {
      this.show = false;
    }

    if (this.showFile) {
      this.searchImage();
    }
  }

  /** Método encargado de ejecutarse al detectar 
   * cambios el componente */
  detectedChange() {
    try {
      this.cdRef.detectChanges();
    } catch (error) { }
  }

  /** Método encargado de buscar archivo imagen */
  searchImage() {
    this.show = true;
    this.loading = true;

    if (this.petition) {
      this.petition.unsubscribe();
    }

    this.petition = this.uploadFileService.getFile(this.id).subscribe(data => {
      const body = data[0];
      this.file = data[1];

      const type = body.headers.get('Content-Type');
      const a = document.createElement('a');
      document.body.appendChild(a);
      const blob = new Blob([body.body], { type: type });
      this.imageSrc = window.URL.createObjectURL(blob);

      this.loading = false;
      this.detectedChange();
    },
      error => {
        this.show = false;
      });
  }

  /** Método encargado de descargar archivo visible */
  descargar(): void {
    this.show = true;
    this.loading = true;
    if (this.petition) {
      this.petition.unsubscribe();
    }

    this.petition = this.uploadFileService.getFile(this.id).subscribe(data => {
      const body = data[0];
      this.file = data[1];
      const type = body.headers.get('Content-Type');
      const a = document.createElement('a');
      document.body.appendChild(a);
      const blob = new Blob([body.body], { type: type });
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = this.file.nombre;
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 0);
    },
      error => {
        this.show = false;
      });
  }

  /**
   * Método encargado de ejecutar método 'ngOnInit' al cargar el componente
   * @param changes Cambios detectados en el modelo
   */
  ngOnChanges(changes) {
    this.ngOnInit();
  }
}
