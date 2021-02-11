import { Component, Input, OnInit, ChangeDetectionStrategy, Optional, Self, ViewChild, ChangeDetectorRef, OnChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, FormControlName, AbstractControl } from '@angular/forms';
import { CONST_SHARED } from '../../constantes-shared';
import { MatFormFieldControl, MatInput } from '@angular/material';
import { Subject, Observable } from 'rxjs';
import { DataGenericService } from '../../services/data-generic.service';

/** Componente encargado de gestionar componente autocompletar */
@Component({
  selector: 'sigma-form-autocomplete',
  templateUrl: './sigma-form-autocomplete.component.html',
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: SigmaFormAutocompleteComponent
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigmaFormAutocompleteComponent implements OnInit, ControlValueAccessor, OnChanges {

  /** Constantes a usar en el componente */
  constants = CONST_SHARED;
  /** Objeto control del formulario */
  control: FormControl = new FormControl();
  /** Variable usada para determinar si será requerido el componente */
  required: boolean = false;
  /** Variable que recibe data en diferentes métodos del componente */
  data: any = {};
  /** Varible tipo String que recibe data */
  dataString: string = '';
  /** lista de opciones */
  optionsList: [];
  /** variable que recibe los terminos de busqueda */
  searchTerm$ = new Subject<string>();
  /** Lista que contiene tipo de opciones */
  options: any[] = [];
  /** Objeto que recibe las opciones de filtro */
  filteredOptions: Observable<string[]>;
  /** Variable con url de peticion a realizar */
  petitionList = null;
  /** Bandera que permite identificar si el formulario se encuentra siendo procesado */
  loading: boolean = false;
  /** variable que permite o no multiple información del componente */
  multipleInformacion: boolean = false;
  objectKeys = Object.keys;

  /** objeto que contiene lista de errores posibles */
  basicErrors = [
    { name: 'required', message: this.constants.campoRequerido }
  ];

  /** Variable usada para recibir ruta en la invocación del componente */
  @Input('path') path = '';
  /** Variable usada para recibir información a mostrar en la invocación del componente */
  @Input('moreInfo') moreInfo = {} // example { nombre: this.constants.nombre };
  /** Variable usada para recibir variable para busquedad en la invocación del componente */
  @Input('searchBy') searchBy: string = 'nombre';

  @Input('searchDuo') searchDuo: string;
  /** Variable usada para recibir id en la invocación del componente */
  @Input('id') id: string = '';
  /** Variable usada para recibir lista de errores posibles en la invocación del componente */
  @Input('errors') errors: [] = [];
  /** Variable usada para identificar si sera usado el valor como clase de la imagen */
  @Input('valueAsImage') valueAsImage = false;

  /** Variable usada para retornar o setear valor del placeholder
   * en la invocación del componente */
  @Input()
  get placeholder() {
    return this.input.placeholder;
  }
  set placeholder(plh) {
    this.input.placeholder = plh;
  }

  /** Variable usada para retornar o setear valores de entrada
   * en la invocación del componente */
  @Input()
  get value() {
    return this.input.value;
  }
  set value(val) {
    this.input.value = val;
  }

  /** Componente hijo tipo MatInput para uso del componente */
  @ViewChild('input') input: MatInput;
  /** Variable que recibe valores en el método 'registerOnChange' */
  onChange = (_: any) => { }
  /** Variable que recibe valores en el método 'registerOnTouched' */
  onTouch = () => { }

  /**
    * Método encargado de construir una instancia de la clase
    *
    * @param ngControl Componente gráfico usado para presentar cuadros de dialogo
    * @param _controlName Componente tipo FormControlName para uso del formulario
    * @param dataService Servicio data usado en el componente para gestionar las peticiones
    * @param cdRef Componente usado para detectar los cambios del componente
    */
  constructor(
    @Optional() @Self() ngControl: NgControl,
    @Optional() private _controlName: FormControlName,
    private dataService: DataGenericService,
    private cdRef: ChangeDetectorRef
  ) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  /**
   * Método encargado de inicializar el componente
   */
  ngOnInit(): void {
    if (!this.id) {
      this.id = this.searchBy;
    }
    if (this._controlName) {
      this.control = this._controlName.control;
    }

    this.activeRequired(this.control);
    this.addErrors();
    this.watchChange();
    if (Object.keys(this.moreInfo).length > 0) {
      this.multipleInformacion = true;
    }
  }

  /** Método encargado de ejecutarse despues del método ngOnInit()
   * @param changes objeto a usar
  */
  ngOnChanges(changes) { }

  /** Método encargado recibir data y asignarlo al componente */
  watchChange() {
    this.control.valueChanges.subscribe(data => {
      if (typeof data === 'undefined' || typeof data === 'string') {
        this.data = [];
        this.onChange(this.data);
        this.loading = false;
        //this.response();
      }
    });
  }

  /** Método encargado de añadir los errores a lista */
  addErrors() {
    if (this.errors.length > 0) {
      this.errors.map(item => {
        this.basicErrors.push(item);
      });
    }
  }

  /** Método encargado de asignar valores seleccionados al data del componente
   * @param event objeto seleccionado
   */
  selected(event: any) {
    this.data = event.option.value;

    if (!this.control.disabled) {
      this.response();
    }
  }

  /** Método encargado de invocar la petición de consulta
  * al servicio según los criterios definidos
  * @param value variable tipo String
  */
  searchFilter(value: string) {
    this.loading = true;
    this.options = [];
    const filterValue = value.toLowerCase();
    let query = `?${this.searchBy}=${filterValue}`;
    if (this.searchDuo != '' && this.searchDuo != null) {
      query = query + `&${this.searchDuo}=${filterValue}`;
    }

    if (this.petitionList) {
      this.petitionList.unsubscribe();
    }
    this.data = [];
    this.petitionList = this.dataService.search(this.path, query)
      .subscribe((data) => {
        this.options = data.content;
        this.loading = false;
        this.executecdRef();
      }, error => {
        this.options = [];
        this.loading = false;
        this.data = [];
        this.response();
        this.executecdRef();
      });

    return this.options;
  }

  /** Método encargado de ejecutar los métodos 'onTouch' y 'onChange' */
  response() {
    this.onTouch();
    this.onChange(this.data);
  }

  /** Método encargado de validar sí el parámetro recibido obliga a la
   *  variable required a cambiar su valor a verdadero
   * @param control objeto formulario recibido
   */
  activeRequired(control: FormControl) {
    if (control.validator != undefined) {
      const validator = control.validator({} as AbstractControl);

      if (validator && validator.required) {
        this.required = true;
      }
    }
  }

  /** Método encargado de mostrar los los resultados según el parametro recibido
   * @param option variable recibida a evaluar
   */
  displayFn(option: any): string | undefined {
    if (option) {
      if (option.hasOwnProperty('nombre')) {
        return option.nombre;
      } else if (option.hasOwnProperty('nombres') && option.hasOwnProperty('apellidos')) {
        return option.identificacion + ' ' + option.nombres + ' ' + option.apellidos;
      } else if (option.hasOwnProperty('descripcion')) {
        return option.descripcion;
      } else if (option.hasOwnProperty('numeroInterno')) {
        return option.numeroInterno;
      } else {
        return option.id;
      }
    } else {
      return '';
    }
  }

  /** Método encargado de limpiar los valores del controlador */
  clearValueControl() {
    if (this.data === null || this.data === undefined) {
      try {
        this.control.setValue(null);
      } catch (exception) {
        console.log(exception);
      }
    }
  }

  /** Método a ejecutar despues de cualquier cambio en el formulario  */
  executecdRef() {
    try {
      this.cdRef.detectChanges();
    } catch (error) { }
  }

  /**
   * Método encargado de establecer el valor digitado por el usuario
   * a la variable del modelo del componente
   *
   * @param value valor digitado por el usuario en el campo del formulario
   **/
  writeValue(value: any) {
    this.data = value;

    this.clearValueControl();
    this.executecdRef();
  }

  /**
   * Método encargado de registar la funcion ingresada al onchange
   * del componente
   *
   * @param fn Funcion con la que se definirá la acción onchange
   * del control del formulario
   **/
  registerOnChange(fn) {
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
