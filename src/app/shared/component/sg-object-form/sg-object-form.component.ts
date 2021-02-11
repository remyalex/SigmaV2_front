
import * as _moment from 'moment';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

export const MY_CUSTOM_FORMATS = {
    parseInput: 'DD-MM-YYYY',
    parseInputGuion: 'YYYY-MM-DD',
    parseInputHours: '+00 HH:mm:ss',
    fullPickerInput: 'DD/MM/YYYY HH:mm:ss',
    datePickerInput: 'DD/MM/YYYY',
    timePickerInput: 'HH:mm',
    formatoInput: 'YYYY/MM/DD HH:mm:ss',
    formatoDateControl: 'YYYY/MM/DD HH:mm:ss'
  };
/** Variable encargada de gestionar la propiedad momento de una hora  */
const moment = (_moment as any).default ? (_moment as any).default : _moment;

/**
 * Componente que construye un formulario a partir de una definición. La información que se captura se
 * mantiene en un modelo local y por tanto hay que usar las funciones transferToModel y transferFromModel.
 */
@Component({
    selector: "sg-object-form",
    templateUrl: "./sg-object-form.component.html"
})

export class ObjectFormComponent implements OnInit {

    comp = this;

    /**
     * Definición del formulario
     */
    @Input("def") def: FormDef;

    /**
     * Modelo al que se enlaza el formulario
     */
    @Input("model") model?: any;

    /**
     * Evento de guardado
     */
    @Input("saveButtonLabel") saveButtonLabel?: string;
    /** Variable usada para recibir valor booleano para mostrar guardado */
    @Input("showSave") showSave?= true;
    /** objeto que devuelve el componente una vez procesada la información */
    @Output("onSave") notifySave?= new EventEmitter<void>();
    /** Método  encargado de emitir la notificación de guardado */

    /** Metodo encargado de emitir la notificación del estado de validación del formulario */
    @Output("onStatusValid") statusValid = new EventEmitter<boolean>();

    onSave() {
        this.notifySave.emit();
    }

    /**
     * Evento de cancelación
     */
    @Input("scancelButtonLabel") cancelButtonLabel?: string;
    @Input("showCancel") showCancel?= true;
    @Output("onCancel") notifyCancel?= new EventEmitter<void>();
    /** Método  encargado de emitir la notificación de guardado */
    onCancel() {
        this.notifyCancel.emit();
    }

    /**
     * Errores de las validaciones extra
     */
    errores: string[] = [];

    /** Valor mínimo permitido para la fecha  */
    minDates: any = {};
    /** Valor máximo permitido para la fecha  */
    maxDates: any = {};

    /**
     * Campos visibles
     */
    visibleFields: string[] = [];
    @Input("visibleFields") set _visibleFields(str: string) {
        if (str != null) this.visibleFields = str.split(",");
    }

    /**
     * Campos inhabilitados
     */
    disabledFields: string[] = [];
    @Input("disabledFields") set _disabledFields(str: string) {
        if (str != null) this.disabledFields = str.split(",");
    }

    /**
     * Campos obligatorios
     */
    requiredFields: string[] = [];
    @Input("requiredFields") set _requiredFields(str: string) {
        if (str != null) this.requiredFields = str.split(",");
    }

    /**
     * Arreglo que se enlaza por ngModel a cada uno de los controles
     */
    bindings: any = {};

    /**
     * El modelo del formulario
     */
    formGroup: FormGroup;

    /**
     * Distribución de los campos por columnas
     */
    layout: number[][];

    /**
    * Método encargado de construir una instancia de la clase
    * @param formBuilder Componente usado para Agrupar elementos en el formulario
    * @param utilitiesService Componente de utilidades de peticiones a servicios
    */
    constructor(
        private formBuilder: FormBuilder,
        private utilitiesService: UtilitiesService
    ) {
    }

    /** Método encargado de inicializar el componente */
    ngOnInit(): void {
        this.buildForm();
    }

    /** Método encargado de desactivar componente del formulario
     * envíado por parámetro
     * @param f formulario a usar
     */
    private isDisabled(f: FormFieldDef) {
        return this.disabledFields.find(x => x == f.name);
    }
    /** Método encargado de hacer visible componente del formulario
     * envíado por parámetro
     * @param f formulario a usar
     */
    private isVisible(f: FormFieldDef) {
        return this.visibleFields.find(x => x == f.name);
    }
    /** Método encargado de requerir componente del formulario
     * envíado por parámetro
     * @param f formulario a usar
     */
    private isRequired(f: FormFieldDef) {
        return this.requiredFields.find(x => x == f.name);
    }

    /** Método encargado de construir Formulario */
    buildForm(): void {

        // Inicia el modelo local
        this.bindings = {};
        for (let i = 0; i < this.def.fields.length; i++) {
            const field = this.def.fields[i];
            this.bindings[field.name] = '';
        }

        // Por defecto los formularios se arman en cuatro columnas
        if (this.def.cols === undefined) {
            this.def.cols = 4;
        }

        // Resuelve los valores por defecto de los campos
        for (let i = 0; i < this.def.fields.length; i++) {
            const field = this.def.fields[i];

            // Los campos que no especifican el tipo se asume que son 'text'
            if (field.type === undefined) {
                field.type = "text";
            }

            // Para las definiciones que no tienen opciones se inicia el objeto vacío
            if (field.options == null) {
                field.options = {};
            }

            let options = field.options;

            // Para los campos de texto que no tienen patrón entonces este se resuelve dependiento
            // de si es o no requerido (+ o *)
            if (field.type === "text" && options.pattern === undefined) {
                if (this.isRequired(field)) {
                    options.pattern = '^[a-zA-Z0-9 ]+$';
                } else {
                    options.pattern = '^[a-zA-Z0-9 ]*$';
                }
            }

            // Los campos numéricos reciben únicamente números positivos enteros por defecto
            if (field.type === "number" && options.pattern === undefined) {
                if (this.isRequired(field)) {
                    options.pattern = '^[1-9]+[0-9]*$';
                } else {
                    options.pattern = '^|[1-9]+[0-9]*$';
                }
            }

            // Por defecto un campo ocupa una posición
            if (field.colSpan === undefined) {
                field.colSpan = 1;
            }
        }

        // Construye el formulario
        let group: any = {};
        this.def.fields.forEach(fieldDef => {
            if (!this.isVisible(fieldDef)) {
                return;
            }
            var defaultValue: any = fieldDef.default || '';
            if (fieldDef.type == "calendar") {
                defaultValue = this.utilitiesService.convertStringToDate(defaultValue, 'DD-MM-YYYY');
                if (fieldDef.options != null && fieldDef.options.minDate != null) {
                    this.minDates[fieldDef.name] = fieldDef.options.minDate;
                } else {
                    this.minDates[fieldDef.name] = "";
                }
            }
            var defaultValidators = [Validators.required];
            if (!this.isRequired(fieldDef)) {
                defaultValidators = [];
            }
            fieldDef.validators = defaultValidators;
            if (fieldDef.validators.length > 0) {
                group[fieldDef.name] = new FormControl(defaultValue, fieldDef.validators);
            } else {
                group[fieldDef.name] = new FormControl(defaultValue);
            }
        });
        const theForm = this.formBuilder.group(group);
        this.formGroup = theForm;
        const comp = this;
        if (this.def.onValueChanges != null) {
            const theHandler = this.def.onValueChanges;
            theForm.valueChanges.subscribe(x => theHandler(comp));
        }
        this.layout = this.getLayout();
    }

    /**
     * Calcula la distribución de campos según el número de columnas del formulario y el colSpan de
     * cada uno de los campos
     */
    private getLayout(): number[][] {
        let layout: number[][] = [];
        var colsCount = 0;
        var row: number[] = [];
        var colsPerRow = this.def.cols || 4;
        for (let i = 0; i < this.def.fields.length; i++) {
            const field = this.def.fields[i];
            let fieldColSpan = field.colSpan || 1;
            if (colsCount + fieldColSpan > colsPerRow) {
                layout.push(row);
                row = [];
                colsCount = 0;
            }
            row.push(i);
            colsCount += fieldColSpan;
        }
        if (row.length > 0) {
            layout.push(row);
        }
        return layout;
    }

    /**
     * Asigna el valor al modelo mediante el nombre de la propiedad
     * @param model El modelo
     * @param key El nombre del campo
     * @param value El valor que se extrae del control de formulario
     */
    private defaultToModelFn(model: any, key: string, value: any) {
        model[key] = value;
    }

    /**
     * Extrae del modelo el valor de la propiedad
     * @param model El modelo
     * @param key El nombre del campo
     */
    private defaultFromModelFn(model: any, key: string) {
        let value = model[key];
        return value;
    }

    /**
     * Devuelve true si el formulario está libre de errores de validación
     */
    public isValid(): boolean {
        let validControls = this.formGroup.valid;
        var validPredicates = true;
        this.errores = [];
        if (this.def.validations != null) {
            for (let i = 0; i < this.def.validations.length; i++) {
                const validation = this.def.validations[i];
                const validationMessage = validation(this.bindings);
                if (validationMessage != null) {
                    this.errores.push(validationMessage);
                    validPredicates = false;
                }
            }
        }
        this.statusValid.emit(validControls && validPredicates);
        return validControls && validPredicates;
    }

    /**
     * Transfiere la información del formulario hacia el modelo usando las funciones toModelFn definidas para
     * cada uno de los campos.
     */
    transferToModel(): void {
        if (this.model == undefined || this.model == null) {
            console.log("ERROR: El atributo 'this.model' es nulo en transferToModel(). No se hará la transferencia de datos.");
            return;
        }
        for (let i = 0; i < this.def.fields.length; i++) {
            const field = this.def.fields[i];
            if (this.isDisabled(field) || !this.isVisible(field)) {
                continue;
            }
            let control = this.formGroup.controls[field.name];
            if (control) {
                var value = this.bindings[field.name];
                if (field.type === "calendar") {
                    value = value != null ? this.utilitiesService.convertDateToString(value, 'DD-MM-YYYY') : '';
                }
                if (field.type === "timer") {
                    if (value != null && value.toString().length > 15) {
                        value = this.utilitiesService.convertHourToString(value, 'HH:mm');
                    } else {
                        value = value != null ? this.utilitiesService.getHoraClientFormat(value) : '';
                    }
                }
                if (field.type === "autocomplete") {
                    if (value != null ) {
                        if (typeof(value.usuario) !== 'undefined') {
                            value = value.usuario.id;
                        }
                    } else {
                        //value = '';
                        if(value === undefined){
                            value = control.value;
                        }
                        if(value === null){
                            value = '';
                        }
                    }
                }
                let toModelFn = field.toModelFn ? field.toModelFn : this.defaultToModelFn;
                toModelFn(this.model, field.name, value);
            } else {
                console.log("El control " + field.name + " no se encuentra en el grupo de formulario");
            }
        }
    }

    /**
     * Transfiere la información del modelo hacia el formulario usando las funciones fromModelFn definidas
     * para cada uno de los campos.
     */
    transferFromModel(): void {
        if (this.model === undefined || this.model == null) {
            console.log("ERROR: El atributo 'this.model' es nulo en transferFromModel(). No se hará la transferencia de datos.");
            return;
        }
        for (let i = 0; i < this.def.fields.length; i++) {
            const field = this.def.fields[i];
            let control = this.formGroup.controls[field.name];
            if (control) {
                let fromModelFn = field.fromModelFn || this.defaultFromModelFn;
                let value = fromModelFn(this.model, field.name);
                if (field.type === 'calendar') {
                    if (!this.isDisabled(field)) {
                        value = value != null ? this.utilitiesService.convertStringToDate(value, MY_CUSTOM_FORMATS.parseInput) : '';
                    }
                }
                if (field.type === 'timer') {
                    value = this.utilitiesService.convertStringToHour(value, 'HH:mm');
                }
                if (field.type === 'autocomplete') {
                    if (value != null ) {
                        if (typeof(value.usuario) !== 'undefined') {
                            value = value.usuario.id;
                        }
                    }
                }
                control.setValue( value );
                this.bindings[field.name] = value;

            } else {
                console.log('El control ' + field.name + ' no se encuentra en el grupo de formulario');
            }
        }
    }

}

/**
 * Representa la definición del formulario
 */
export class FormDef {
    title: string;
    cols?: number;
    showButtons?: boolean;
    fields: FormFieldDef[];
    validations?: ((bindings: any[]) => string)[]
    onValueChanges?: (form: ObjectFormComponent) => void;
}

/**
 * Representa la definición de un campo del formulario
 */
export class FormFieldDef {
    name: string;
    label: string;
    type?: string;
    colSpan?: number;
    toModelFn?: (m: any, k: string, v: any) => void;
    fromModelFn?: (m: any, k: string) => any;
    default?: string;
    validators?: any[];
    options?: any;
}