import { Component, OnInit, KeyValueDiffer, Inject, KeyValueDiffers, KeyValueChanges, AfterViewInit, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogConfig, MatDialog, MatSnackBar, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONST_ACTAS_VECINDAD } from '../actas-vecindad.constant';
import { ActasService } from '../services/actas-vecindad.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { Acta, ActaArchivos, Uso_Servicio } from '../models/actas-vecindad.model';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CountMinElementsValidator, CountMaxElementsValidator } from 'src/app/shared/form/count.elements';
import { FotosComponent } from 'src/app/workflow/forms/diagnostico/shared/fotos/fotos.component';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { ActasCriteria } from '../models/actas-vecindad-criteria.model';
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
    selector: 'app-actas-vecindad-attach',
    templateUrl: './actas-vecindad-attach.component.html'
})
export class ActasVecindadAttachComponent extends BaseComponent implements OnInit, AfterViewChecked, FormComponent {
    /** Constantes a usar en el componente */
    @Output() irAtras = new EventEmitter();
    @Output() goToHome = new EventEmitter();
    constants = CONST_ACTAS_VECINDAD;
    acta: Acta;
    form: FormGroup;
    enviada = false;
    requerido = true;
    disableSubmit = false;
    sub: Subscription;
    index: number;

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
        private mantenimientoService: MantenimientoService,
        private actasService: ActasService,
        private router: Router,
        private dialog: MatDialog,
    ) {
        super(servicio, commonService, formBuilder, workflowService, excelService,
            utilitiesServices, snackBar, tokenStorageService, mapService);

        this.data = new WorkflowMantenimientoActividadModel();
        this.data.mantenimiento = CONST_ACTAS_VECINDAD.mObject;

        for (var i = 0; i < this.data.mantenimiento.actasVecindad.length; i++) {
            if (this.data.mantenimiento.actasVecindad[i].id == CONST_ACTAS_VECINDAD.aID) {
                this.index = i;
            }
        }

        this.acta = this.data.mantenimiento.actasVecindad[this.index];

        this.form = this.formBuilder.group({
            adjunto: [null, Validators.compose([Validators.required])]
        });
    }

    /** Método encargado de inicializar el componente */
    ngOnInit() {
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
                    this.irAtras.emit();
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
                this.goToHome.emit();
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
        this.markAndValidateAllInputs(this.form);
        this.enviada = true;
        this.disableSubmit = true;
        if (this.form.valid) {
            this.disableSubmit = true;
            this.data.mantenimiento.actasVecindad[this.index] = this.acta;
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
}