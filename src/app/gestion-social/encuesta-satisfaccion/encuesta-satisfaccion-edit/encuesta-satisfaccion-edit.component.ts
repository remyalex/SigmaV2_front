import { Component, OnInit, KeyValueDiffer, Inject, KeyValueDiffers, KeyValueChanges, AfterViewInit, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogConfig, MatDialog, MatSnackBar, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ENCUESTA_SATISFACCION } from '../encuesta-satisfaccion.constant';
import { EncuestaSatisfaccionService } from '../services/encuesta-satisfaccion.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { EncuestaSatisfaccion, Beneficios } from '../models/encuesta-satisfaccion.model';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CountMinElementsValidator, CountMaxElementsValidator } from 'src/app/shared/form/count.elements';
import { FotosComponent } from 'src/app/workflow/forms/diagnostico/shared/fotos/fotos.component';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { ListasService } from 'src/app/administracion/listas/services/listas.service';
import { Subscription } from 'rxjs';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { WorkflowMantenimientoActividadModel } from 'src/app/workflow/models/workflow-mantenimiento-actividad.model';

@Component({
    selector: 'app-encuesta-satisfaccion-edit',
    templateUrl: './encuesta-satisfaccion-edit.component.html'
})
export class EncuestaSatisfaccionEditComponent extends BaseComponent implements OnInit, AfterViewChecked, FormComponent {
   /** Constantes a usar en el componente */
  constants = CONST_ENCUESTA_SATISFACCION;
    private customerDiffer: KeyValueDiffer<string, any>;
    encuesta: EncuestaSatisfaccion;
    form: FormGroup;
    enviada = false;
    requerido = true;
    disableSubmit = false;
    items: ListaItem[];
    beneficios: Beneficios[];
    copy = {};
    sub: Subscription;
    index: number;
    turno: string;
    servidorNombre: string;
    servidorCargo: string;
    @Output() irAEncuestaSatisfaccionList = new EventEmitter();

    constructor(
        servicio: MantenimientoService,
        commonService: CommonService,
        formBuilder: FormBuilder,
        workflowService: WorkflowService,
        excelService: ExcelService,
        utilitiesServices: UtilitiesService,
        snackBar: MatSnackBar,
        tokenStorageService: TokenStorageService,
        mapService: MapService,
        private dialog: MatDialog,
    ) {
        super(servicio, commonService, formBuilder, workflowService, excelService,
            utilitiesServices, snackBar, tokenStorageService, mapService);

        this.data = new WorkflowMantenimientoActividadModel();
        this.data.mantenimiento = CONST_ENCUESTA_SATISFACCION.mObject;

        for (var i = 0; i < this.data.mantenimiento.encuestaSatisfaccion.length; i++) {
            if (this.data.mantenimiento.encuestaSatisfaccion[i].id == CONST_ENCUESTA_SATISFACCION.aID) {
                this.index = i;
            }
        }

        this.encuesta = this.data.mantenimiento.encuestaSatisfaccion[this.index];
        this.servidorNombre = this.encuesta.servidor.nombres + " " + this.encuesta.servidor.apellidos;
        this.servidorCargo = this.encuesta.servidor.cargo.descripcion;

        this.items = [];
        for (var i = 0; i < this.data.mantenimiento.encuestaSatisfaccion[this.index].beneficioRespuesta.length; i++) {
            this.items.push(this.data.mantenimiento.encuestaSatisfaccion[this.index].beneficioRespuesta[i].item);
        }
        this.encuesta.beneficios = this.items;

        this.turno = CONST_ENCUESTA_SATISFACCION.mTurno;

        this.form = this.formBuilder.group({
            id: [null],
            fecha: [null],
            lugar: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
            tipoIntervencion: [null],
            localidad: [null],
            upla: [null],
            barrio: [null],
            frenteTrabajo: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
            civ: [null],
            entidadEjecucionPregunta: [null],
            entidadEjecucionRespuesta: [null, Validators.compose([Validators.maxLength(80)])],
            beneficioPregunta: [null],
            beneficios: [null],
            calificacionIntervencion: [null],
            umvInforma: [null],
            umvAcompanamiento: [null],
            inconvenientePregunta: [null, Validators.compose([Validators.required])],
            inconvenienteRespuesta: [null, Validators.compose([Validators.maxLength(300)])],
            mejoraPregunta: [null, Validators.compose([Validators.required])],
            mejoraRespuesta: [null],
            satisfaccion: [null, Validators.compose([Validators.required, Validators.min(1), Validators.max(5), Validators.pattern("^[0-9]*$")])],
            mejoraNocturna: [null],
            ventajasNocturna: [null],
            satisfechoIntervencion: [null, Validators.compose([Validators.required])],
            felicitaciones: [null],
            pqrs: [null],
            encuestadoNombre: [null, Validators.compose([Validators.maxLength(80)])],
            encuestadoTipoId: [null, Validators.compose([Validators.required,])],
            encuestadoId: [null, Validators.compose([Validators.required, Validators.maxLength(15)])],
            encuestadoDireccion: [null, Validators.compose([Validators.maxLength(300)])],
            encuestadoTelefono: [null, Validators.compose([Validators.max(9999999), Validators.pattern("^[0-9]*$")])],
            encuestadoBarrio: [null],
            pk: [null],
            encuestadoFirma: [null, Validators.compose([Validators.required])],
            servidorNombre: [null],
            servidorFirma: [null, Validators.compose([Validators.required])],
            servidorCargo: [null],
            adjunto: [null],
        });

        this.setValidators(this.form);
    }

    /** Método encargado de inicializar el componente */
  ngOnInit() {
        this.copy = JSON.parse(JSON.stringify(this.encuesta));
        // this.customerDiffer = this.differs.find(this.acta).create();
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
                    this.irAEncuestaSatisfaccionList.emit({accion: 'listar'});
                }
            }
        );
    }

     /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
        this.processing = true;
        this.workflowService.update(this.data).subscribe(
            data => {
                this.data = data;
                this.processing = false;
                this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
                    duration: 5000,
                    panelClass: ['success-snackbar']
                });
                this.irAEncuestaSatisfaccionList.emit({accion: 'listar'});
            },
            error => {
                this.processing = false;
                this.disableSubmit = false;
                this.utilitiesServices.formErrorMessages(error, this.forms, this.snackBar);
            });
    }

    /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
        this.registros();
        this.validarOtros(this.form);
        this.markAndValidateAllInputs(this.form);
        this.enviada = true;
        this.disableSubmit = true;
        if (this.form.valid) {
            this.disableSubmit = true;
            this.data.mantenimiento.encuestaSatisfaccion[this.index] = this.encuesta;
            this.save();
        } else {
            this.disableSubmit = false;
            this.snackBar.open(this.constants.errorForm, 'X', {
                duration: 5000,
                panelClass: ['warning-snackbar']
            });
        }
    }

    /**
   * Marks all controls in a form group as touched and validate
   * @param formGroup - The form group to touch
   */
    private markAndValidateAllInputs(anyForm: FormGroup) {
        // tslint:disable-next-line:forin
        for (const inner in anyForm.controls) {
            anyForm.get(inner).markAsTouched();
            anyForm.get(inner).updateValueAndValidity();
        }
    }

    setValidators(anyForm: FormGroup) {
        if (this.turno === this.constants.turnoDiurno) {
            //Activar validadores turno diurno
            anyForm.controls['entidadEjecucionPregunta'].setValidators([Validators.required]);
            anyForm.controls['beneficioPregunta'].setValidators([Validators.required]);
            anyForm.controls['calificacionIntervencion'].setValidators([Validators.required]);
            anyForm.controls['umvInforma'].setValidators([Validators.required]);
            anyForm.controls['umvAcompanamiento'].setValidators([Validators.required]);

            //Desactivar validadores turno nocturno
            anyForm.controls['mejoraPregunta'].setValue(null);
            anyForm.controls['mejoraPregunta'].clearValidators();
            anyForm.controls['mejoraNocturna'].setValue(null);
            anyForm.controls['mejoraNocturna'].clearValidators();
            anyForm.controls['ventajasNocturna'].setValue(null);
            anyForm.controls['ventajasNocturna'].clearValidators();
        }

        if (this.turno === this.constants.turnoNocturno) {
            //Activar validadores turno nocturno
            anyForm.controls['mejoraPregunta'].setValidators([Validators.required]);
            anyForm.controls['mejoraNocturna'].setValidators([Validators.required, Validators.maxLength(300)]);
            anyForm.controls['ventajasNocturna'].setValidators([Validators.required, Validators.maxLength(300)]);

            //Desactivar validadores turno diurno
            anyForm.controls['entidadEjecucionPregunta'].setValue(null);
            anyForm.controls['entidadEjecucionPregunta'].clearValidators();
            anyForm.controls['beneficioPregunta'].setValue(null);
            anyForm.controls['beneficioPregunta'].clearValidators();
            anyForm.controls['calificacionIntervencion'].setValue(null);
            anyForm.controls['calificacionIntervencion'].clearValidators();
            anyForm.controls['umvInforma'].setValue(null);
            anyForm.controls['umvInforma'].clearValidators();
            anyForm.controls['umvAcompanamiento'].setValue(null);
            anyForm.controls['umvAcompanamiento'].clearValidators();
        }
    }

    validarOtros(anyForm: FormGroup) {
        var value = anyForm.controls['entidadEjecucionPregunta'].value != null ? anyForm.controls['entidadEjecucionPregunta'].value.descripcion : '';
        if (anyForm.controls['entidadEjecucionPregunta'].valid && value == 'SI') {
            anyForm.controls['entidadEjecucionRespuesta'].setValidators([Validators.required, Validators.maxLength(80)]);
        }
        else {
            anyForm.controls['entidadEjecucionRespuesta'].setValue(null);
            anyForm.controls['entidadEjecucionRespuesta'].clearValidators();
        }

        value = anyForm.controls['inconvenientePregunta'].value != null ? anyForm.controls['inconvenientePregunta'].value.descripcion : '';
        if (anyForm.controls['inconvenientePregunta'].valid && value == 'SI') {
            anyForm.controls['inconvenienteRespuesta'].setValidators([Validators.required, Validators.maxLength(80)]);
        }
        else {
            anyForm.controls['inconvenienteRespuesta'].setValue(null);
            anyForm.controls['inconvenienteRespuesta'].clearValidators();
        }

        value = anyForm.controls['beneficioPregunta'].value != null ? anyForm.controls['beneficioPregunta'].value.descripcion : '';
        if (anyForm.controls['beneficioPregunta'].valid && value == 'SI') {
            anyForm.controls['beneficios'].setValidators([Validators.required]);
        }
        else {
            if (anyForm.controls['beneficios'].value != null) {
                anyForm.controls['beneficios'].setValue(null);
                anyForm.controls['beneficios'].clearValidators();
            }
            else {
                anyForm.controls['beneficios'].clearValidators();
            }
        }

        value = anyForm.controls['mejoraPregunta'].value != null ? anyForm.controls['mejoraPregunta'].value.descripcion : '';
        if (anyForm.controls['mejoraPregunta'].valid && value == 'SI') {
            anyForm.controls['mejoraRespuesta'].setValidators([Validators.required, Validators.maxLength(300)]);
        }
        else {
            anyForm.controls['mejoraRespuesta'].setValue(null);
            anyForm.controls['mejoraRespuesta'].clearValidators();
        }
    }

    registros() {
        this.items = this.encuesta.beneficios;
        const cant = this.items != null ? this.items.length : 0;
        this.beneficios = [];
        for (var i = 0; i < cant; i++) {
            this.beneficios.push(new Beneficios());
            this.beneficios[i].item = this.items[i];
        }
        this.encuesta.beneficioRespuesta = this.beneficios;
    }
}