import { Component, Input, OnInit, ChangeDetectionStrategy, Optional, Self, ViewChild, DoCheck, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, FormControlName, AbstractControl } from '@angular/forms';
import { CONST_SHARED } from '../../constantes-shared';
import { MatFormFieldControl, MatSelect } from '@angular/material';
import { DataGenericService } from '../../services/data-generic.service';
import { UtilitiesService } from '../../services/utilities.service';
import { filter, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

/**
 * Componente encargado de gestionar las listas que tienen varias
 * etiquetas dependientes entre estas
 **/
@Component({
  selector: 'sigma-form-select-multi-labels',
  templateUrl: './sigma-form-select-multi-labels.component.html',
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: SigmaFormSelectMultiLabelsComponent
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigmaFormSelectMultiLabelsComponent implements OnInit, ControlValueAccessor, DoCheck {

 /** Constantes a usar en el componente */
  constants = CONST_SHARED;
  /** Control de formulario al que se asocia el campo */
  control: FormControl = new FormControl();
  /** Bandera de control para saber si el campo es requerido en el formulario o no */
  required: boolean = false;
  /** Listado de opciones del select presentado al usuario */
  optionsList: any[] = [];
  /** Opción seleccionada */
  option: any;
  /** Componente gráfico que le indica al usaurio que el componente se encuentra cargando */
  loading: boolean = true;
  /** Listado de errores personalizados que puede presentar el componente */
  basicErrors = [
    { name: 'required', message: this.constants.campoRequerido }
  ];

  /** Valor que de forma predeterminada se le presenta al usuario */
  @Input('valueDefault') valueDefault: string = '';
  /** Bandera que indica si el componente permite multiples selecciones */
  @Input('multiple') multiple: boolean = false;
  /** Variable con el nombre de la columna por la cual se ordena el listado presentado al usuario */
  @Input('listBy') listBy: any = 'valor';
  /** Opción de etiqueta generada */
  @Input('labelOption') labelOption: [] = [];
  /** Id del elemento seleccionado por el usuario */
  @Input('id') id: string = 'id';
  /** Ruta por la cual se consulta la información del usuario */
  @Input('path') path = '';
  /** Listado de errores personalizados permitidos por el componente */
  @Input('errors') errors: [] = [];
  /** Listado de opciones presentadas al usuario */
  @Input('opciones') opciones = [];


  /** Propiedad Placeholder asociado al campo del formulario */
  @Input()
  get placeholder() {
    return this.select.placeholder;
  }
  set placeholder(plh) {
    this.select.placeholder = plh;
  }

  /** Propiedad value asociada al campo del formulario */
  @Input()
  get value() {
    return this.select.value;
  }
  set value(val) {
    this.select.value = val;
  }

  /** Select presentado al usuario */
  @ViewChild('select') select: MatSelect;

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
   */
  constructor(
    @Optional() @Self() ngControl: NgControl,
    @Optional() private _controlName: FormControlName,
    private servicioGeneral: DataGenericService,
    private utilitiesService: UtilitiesService,
    private cdRef: ChangeDetectorRef,
  ) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  /**
  * Método encargado de inicializar el componente
  */
  ngOnInit(): void {

    if (this._controlName) {
      this.control = this._controlName.control;
    }

    this.getOptions();
    this.activeRequired(this.control);
    this.addErrors();
  }

  /** Método encargado de notificar los cambios del componente check hacia el modelo */
  ngDoCheck(): void {
    this.select.updateErrorState();
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

  /** Método encargado de devolver las opciones del usuario */
  getOptions() {
    if (this.opciones.length > 0) {
      this.optionsList = this.opciones;
      this.loading = false;
    } else if (this.path !== '') {
      this.servicioGeneral.cacheList(this.path);
      this.servicioGeneral.listQuery$
        .pipe(
          filter((data: any) => (data.path === this.path))
        )
        .subscribe((data: any) => {
          try {
            let opciones = this.utilitiesService.orderArray(data.content, this.listBy);
            this.optionsList = opciones.filter(item => item.activo == true);
            this.select.compareWith = this.compararObjetos;
          } catch (error) {
            this.optionsList = [];
          }

          this.loading = false;
          try {
            this.cdRef.detectChanges();
          } catch (error) { }
        }, error => {
          this.optionsList = [];
          this.loading = false;
          try {
            this.cdRef.detectChanges();
          } catch (error) { }
        });
    } else {
      this.loading = false;
    }
  }

    /**
   * Método encargado de obtener los datos que provienene de otras fuentes
   *
   * @param listToShow Lista de opciones relacionadas en el select del usaurio
   */
  getListFromOtherSite(listToShow) {
    this.optionsList = listToShow;
    this.loading = false;
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
   * Método encargado de establecer el valor digitado por el usuario
   * a la variable del modelo del componente
   *
   * @param value valor digitado por el usuario en el campo del formulario
   **/
  writeValue(obj: any): void {
    this.value = obj;
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

  /**
   * Método encargado de cambiar el valor al modelo y el componente
   * por el valor seleccionado por el usuario
   *
   * @param value valor seleccionado por el usuario
   */
  changeValue(value: any) {
    if (!this.multiple) {
      this.option = this.optionsList.filter(item => item[this.id] == value[this.id]);
      try {
        if (this.option.length > 0) {
          this.option = value;
        } else {
          this.option = this.valueDefault;
        }
      } catch (error) {
        this.option = null;
      }
    } else {
      this.option = value;
    }

    if (!this.control.disabled) {
      this.onTouch();
      this.onChange(this.option);
    }
  }

  /**
   * Método encargado de comparar dos objetos e identificar si son iguales o no
   *
   * @param objetoAlmacenado Objeto con la información que actualmente se encuentra
   * en la base de datos
   *
   * @param objetoOpcion Objeto con la información actualizada actualizada
   * por el usuario
  */
  compararObjetos(objetoOpcion: any, objetoAlmacenado: any): boolean {
    return objetoOpcion.id == objetoAlmacenado.id;
  }

}
