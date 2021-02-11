import { Component, Input, OnInit, ChangeDetectionStrategy, Optional, Self, ViewChild, ViewEncapsulation, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, FormControlName, AbstractControl } from '@angular/forms';
import { CONST_SHARED } from '../../constantes-shared';
import { MatFormFieldControl, MatInput, MatSnackBar } from '@angular/material';
import { InputFileMaxValidator, InputFileMinValidator, InputFileAcceptsValidator, InputFileSize } from '../../form/input.file';
import { UploadFileService } from '../../services/upload.file.service';
import { HttpEventType } from '@angular/common/http';
import { WebcamImage } from 'ngx-webcam';

/**
 * Componente usado para estandarizar el campo de carga de archivos
 * en todos los formularios del sistema
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-form-upload-file',
  templateUrl: './sigma-form-upload-file.component.html',
  styleUrls: ['./sigma-form-upload-file.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: SigmaFormUploadFileComponent
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SigmaFormUploadFileComponent implements OnInit, ControlValueAccessor {
 /** Constantes a usar en el componente */
  constants = CONST_SHARED;
  /** Archivos seleccionados por el usuario */
  files = [];
  /** Control de formulario al que se asocia el campo */
  control: FormControl = new FormControl();
  /** Bandera de control para saber si el campo es requerido en el formulario o no */
  required = false;
  /** Función encargada de la validación de elementos del campo del formulario */
  validateFn: Function;
  /** Mensaje que indica el error de tipo de archivo */
  errorTipoArchivos = '';
  /** Listado de errores personalizados que puede presentar el componente */
  basicErrors = [
    { name: 'required', message: this.constants.campoRequerido },
  ];
  /** Objeto con valores a procesar actualizados por el usuario */
  object = Object;

  /** Listado de errores personalizados permitidos por el componente */
  @Input('errors') errors: [] = [];
  /** Propiedad Placeholder asociado al campo del formulario */
  @Input('placeholder') placeholder: string = '';
  /** Cadena de texto con los tipos de archivos aceptados por el componente */
  @Input('accept') accept: string = '*';
  /** Bandera que indica si el componente admite multiples archivos */
  @Input('multiple') multiple: boolean = false;
  /** Cantidad maxima de archivos a cargar */
  @Input('maxUpload') maxUpload: number = 0;
  /** Cantidad mínima de archivos a cargar */
  @Input('minUpload') minUpload: number = 0;
  /** Bandera que permite identificar si se actualiza la vista del archivo al realizar el cargue */
  @Input('autoUpdate') autoUpdate: boolean = true;
  /** Bandera que indica si se presentará al usuario la vista previa del archivo */
  @Input('showFile') showFile: boolean = false;
  /** Tamaño máximo permitido para el cargue del archivo en MBs */
  @Input('sizeFile') sizeFile: number = 10;

  @Input('action') action: string = 'create';

  status = '';
  public filesProcessed = 0;
  public filesToProcess = 0;

  /** Entrada de tipo de componente que define el campo en el formulario */
  @ViewChild('input') input: MatInput;
  /** Entrada de tipo de componente que define el campo archivo en el formulario */
  @ViewChild('inputFile') inputFile: ElementRef;

  /** Definición del método que es llamado al momento de cambiar el dato del
   * campo del formulario */
  onChange = (_: any) => { }
  /** Definición del método que es llamado al momento de realizar acción sobre el
   * campo del formulario */
  onTouch = () => { }

  /**
   * Método encargado de construir una instancia de componente
   *
   * @param ngControl Control de tipo de ng del componente del formulario
   * @param _controlName Nombre del Control a usar en el formulario
   * @param uploadFileService Servicio de carga de archivos
   * @param cdRef Referencia a componente de observable para saber si ha cambiado el valor del componente
   * @param snackBar Componente usado para abrir un recuadro modal
   */
  constructor(
    @Optional() @Self() ngControl: NgControl,
    @Optional() private _controlName: FormControlName,
    private uploadFileService: UploadFileService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar,
  ) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    if (this._controlName) {
      this.control = this._controlName.control;
    }
    this.clearInputHiden();
    this.activeRequired(this.control);
    this.acceptValid(this.control);
    this.addTotalFiles(this.control);
    this.addSizeFile(this.control);
    this.addErrors();
    this.setMensajeErrorTipoArchivo();
  }

  /** Método que permite saber cual es el archivo seleccionado */
  selectFile() {
    this.onTouch();
    this.inputFile.nativeElement.click();
  }

  /**
   * Método encargado de asignar la bandera de activo al contol
   * indicado
   *
   * @param control Control al cual se le asignará la bandera de requerida
  */
  activeRequired(control: FormControl) {
    if (control.validator != undefined) {
      const validator = control.validator({} as AbstractControl);

      if (validator && validator.required) {
        this.required = true;
      }
    }
  }

  /**
   * Método que permite validar el tipo de archivo con los permitidos
   *
   * @param control Control de formulario al cual se le asociará el mensaje de falla o éxito
  */
  acceptValid(control: FormControl) {
    if (this.accept) {
      let validate = this.setValidateFile(control.validator, InputFileAcceptsValidator(this.accept));
      control.setValidators(validate);
    }
  }

  /**
   * Método encargado de adicionar los errores identificados
   * en el validator a la sección de errores del campo del formulario
   */
  addErrors() {
    if (this.errors.length > 0) {
      this.errors.map(item => {
        this.basicErrors.push(item);
      });
    }
  }

  validateShowAttachFile(): Boolean {
    if (this.control.disabled) {
      return false;
    }

    if (this.maxUpload === 0 ) {
      return true;
    }
    if ( this.files && ( this.maxUpload > this.files.length) ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Método encargado de adicionar el total de archivos al componente indicado
   *
   * @param control Control de formulario al cual se le asociará el mensaje de falla o éxito
  */
  addTotalFiles(control: FormControl) {
    let total = this.files ? this.files.length : 0;
    if (this.maxUpload > 0) {
      let validate = this.setValidateFile(control.validator, InputFileMaxValidator(this.maxUpload, total));
      control.setValidators(validate);
    }

    if (this.minUpload > 0) {
      if (this.action ===  'edit') {
        total = 0;
      }
      let validate = this.setValidateFile(control.validator, InputFileMinValidator(this.minUpload, total));
      control.setValidators(validate);
    }
  }

  resetForm() {
    this.action = 'edit';
    this.ngOnInit();
  }

  /**
   * Método encargado de adicionar el tamaño de archivo al control indicado
   * @param control Control de formulario al cual se le asociará el mensaje de falla o éxito
   */
  addSizeFile(control) {
    let validate = this.setValidateFile(control.validator, InputFileSize(this.sizeFile));
    control.setValidators(validate);
  }

  /**
   * Método encargado de realizar la validación del archivo cargado por el usuario
   * @param existeValidate Indica si el archivo ya existe o es nuevo
   * @param validate Indica si el archivo es de tipo válido
   */
  setValidateFile(existeValidate, validate) {
    if (existeValidate) {
      return [existeValidate, validate];
    } else {
      return [validate];
    }
  }

  /**
   * Método que permite saber si el control al cual se le asigna el archivo 
   * es válido o no
   */
  validControl(): boolean {
    if (this.control.disabled) {
      return false;
    }

    if (this.control.errors) {
      if (Object.keys(this.control.errors).length > 0) {
        return false;
      }
    }
    if (!this.autoUpdate) {
      return false;
    }
    return true;
  }

  /**
   * Método encargado de adicionar los archivos cargados por el cliente al
   * listado de archivos del modelo
   *
   * @param event Evento con los archivos cargados por el usuario
   */
  agregarFiles(event) {
    this.onTouch();
    this.status = 'adding';
    this.filesProcessed = 0;
    this.filesToProcess = event.target.files.length;
    this.control.setValue(event.target.files);
    if (!this.validControl() && this.minUpload === 0) {
      return;
    }

    this.files = [];
    for (let file in event.target.files) {
      if (typeof event.target.files[file] == 'object') {
        this.files.push(event.target.files[file]);
        this.upload(file, this.files[file]);
      }
    }
  }

  setFiles(files: any) {
    this.files = files;
    this.response();
    this.status = 'rewrite';
    this.detectChange();
    this.clearInputHiden();
  }

  resetFormConditions() {
    this.onTouch();
    this.response();
    this.status = 'reseting';
    this.detectChange();
    this.action = 'edit';
    this.ngOnInit();
  }

  /**
   * Método que permite la asignación de los errores de tipos de archivo
   * a la sección de errores del formulario
   */
  setMensajeErrorTipoArchivo() {
    this.errorTipoArchivos = this.constants.typeFiles;
    if (this.accept) {

      let formatos = [] ;
      const tipos = this.accept.split(',');

       if (tipos) {
        tipos.forEach(item => {
          item = item.trim();

          const index = this.constants.formatoArchivos.findIndex(formato => formato.mimeType.toLowerCase() === item.toLowerCase());
          if (index > -1) {
            if (formatos.findIndex(f => f === this.constants.formatoArchivos[index].nombreTipoArchivo) === -1) {
              formatos.push(this.constants.formatoArchivos[index].nombreTipoArchivo);
            }
          }
        });
       }

       if ( formatos.length > 0) {
        let posicion = 0;
        formatos.forEach(formato => {
          posicion++;
          if (formatos.length === posicion) {
            this.errorTipoArchivos += formato + '. ';
          } else {
            this.errorTipoArchivos += formato + ', ';
          }
        });
       }
    }
  }

  /**
   * Método encargado de actualizar el modelo de archivos con los archivos
   * ingresados por el usuario
   * 
   * @param key LLave del archivo modificado
   * @param file Archivo modificado
   */
  upload(key, file: File): void {
    this.files[key].success = true;
    this.uploadFileService.uploadFile(file).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.status = 'loading';
        this.files[key].progress = Math.round((event.loaded / event.total) * 100);
        this.detectChange();
      } else if (event.type === HttpEventType.Response) {
        this.files[key] = event.body;
        this.files[key].success = true;
        this.filesProcessed ++;
        if (this.filesProcessed === this.filesToProcess) {
          this.response();
          this.status = 'completed';
          this.detectChange();
        }
      }
    }, error => {
      this.files[key].success = false;
      this.snackBar.open(this.constants.errorSubirArchivo, 'X', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      this.status = 'error';
      this.detectChange();
    });
  }

  /**
   * Método que permite detectar los cambios del modelo de
   * archivos enviados por el uuario
   */
  detectChange() {
    try {
      this.cdRef.detectChanges();
    } catch (error) { }
  }

  /** Gestión de la petición realizada por el usuario */
  response() {
    if (!this.control.disabled) {
      this.onTouch();
      if (this.multiple) {
        setTimeout(() => {
          this.onChange(this.files);
        }, 100);
      } else {
        this.onChange(this.files[0]);
      }
    }
  }

  /**
   * Método encargado de presentar en el formulario el nombre del archivo cargado
   *
   * @param file Archivo del cual se va a presentar la información
  */
  showNameFile(file): string {
    if (!file) {
      return '';
    }
    if (file.name) {
      return file.name;
    }
    if (file.nombre) {
      return file.nombre;
    }
  }

  /** Método encargado de eliminar el ultimo archivo cargado por el usuario */
  eliminar() {
    this.files = [];
    this.control.setValue('');
    this.clearInputHiden();
    this.control.updateValueAndValidity();
    this.onTouch();
    this.ngOnInit();
  }

  /**
   * Método encargado de eliminar el indice del archivo de la colección
   * de archivos cargados
   * @param key Llave del archivo a eliminar
   */
  eliminarElemento(key) {
    this.onTouch();
    this.files.splice(key, 1);
    this.response();
    this.status = 'deleted';
    this.detectChange();

    this.clearInputHiden();
  }

  /** Método encargado de limpiar el archivo cargado por el usuario del modelo */
  clearInputHiden() {
    this.inputFile.nativeElement.value = '';
  }

  /**
   * Método encargado de obtener el valor de archivo del componente
   * que fué adjuntado
   */
  getValue() {
    return this.constants.adjuntarFile;
  }

  /**
   * Método encargado de establecer el valor digitado por el usuario
   * a la variable del modelo del componente
   *
   * @param value valor digitado por el usuario en el campo del formulario
   **/
  writeValue(value: any) {
    if (typeof value == 'undefined' || value == null || !value) {
      this.files = [];
    } else if (Array.isArray(value)) {
      this.files = value;
    } else if (typeof value == 'object' && value) {
      if (value['length'] > 0) {
        this.files = [value[0]];
      } else {
        this.files = [value];
      }
    } else {
      this.files = value ? value : [];
    }
  }

  /**
   * Método encargado de registar la funcion ingresada al onchange
   * del componente
   *
   * @param fn Funcion con la que se definirá la acción onchange
   * del control del formulario
   **/
  registerOnChange(fn){
    this.onChange = fn;
  }

 
  /**
   * Método encargado de registar la funcion ingresada al ontouched
   * del componente
   *
   * @param fn Funcion con la que se definirá la acción ontouched
   * del control del formulario
   **/
  registerOnTouched(fn) {
    this.onTouch = fn;
  }
 
  /** Método encargado de establecer el estado de deshabilitado del
   * campo del formulario en el componente
   *
   * @param isDisabled Valor que indica si el campo se encuentra en estado
   * dehabilitado
   **/
  setDisabledState(isDisabled: boolean): void { }

}
