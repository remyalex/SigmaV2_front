import { forEach } from '@angular/router/src/utils/collection';
import { RegistrarValePlantaEditComponent } from './../registrar-vale-planta-edit/registrar-vale-planta-edit.component';
import { RegistrarValePlantaService } from './../services/registrar-vale-planta.service';
import { ArchivoModel } from './../../../administracion/formato/models/formato.model';
import { CONST_PRODUCCION_REGISTRO_VALE_PLANTA } from './../registrarValePlanta.constant';
import { RegistrarValePlanta, RegistrarArchivoValePlanta } from './../models/registrar-vale-planta.model';
import { Component, OnInit, KeyValueDiffer, Inject, KeyValueDiffers, KeyValueChanges, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogConfig, MatDialog, MatSnackBar, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';

@Component({
    selector: 'app-registrar-vale-planta-attach',
    templateUrl: './registrar-vale-planta-attach.component.html'
})
export class RegistrarValePlantaAttachComponent implements OnInit {
   /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_REGISTRO_VALE_PLANTA;
    registro: RegistrarValePlanta;
    form: FormGroup;
    enviada = false;
    requerido = true;
    disableSubmit = false;
    sub: Subscription;
    index: number;
    archivos: Array<ArchivoModel>;

    constructor(
        private servicio: RegistrarValePlantaService,
        private snackBar: MatSnackBar,
        commonService: CommonService,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) data: RegistrarValePlanta,
        private router: Router,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<RegistrarValePlantaEditComponent>,
        private utilitiesServices: UtilitiesService
    ) {
        this.archivos = new Array<ArchivoModel>();
        this.form = this.formBuilder.group({
            adjunto: [null]
        });
        this.registro = data;
        if ( this.registro.valeArchivo && this.registro.valeArchivo.length > 0  ) {
            this.registro.valeArchivo.forEach(element => {
                this.archivos.push(element.archivo);
            });
        }
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
                    this.dialogRef.close();
                }
            }
        );
    }

     /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
        const adjuntos = new Array<RegistrarArchivoValePlanta>();
        if (typeof(this.archivos) !== 'string') {
            this.archivos.forEach(element => {
                const newFile = new RegistrarArchivoValePlanta();
                newFile.fechaRegistro = this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(new Date());
                newFile.archivo = element;
                adjuntos.push(newFile);
            });
        }
        this.registro.valeArchivo = adjuntos;
        this.servicio.update(this.registro).subscribe(
        data => {
            this.dialogRef.close(this.form.value);
            this.enviada = false;
            this.snackBar.open(this.constants.successEdit, 'X', {
            duration: 5000,
            panelClass: ['success-snackbar']
            });
        },
        error => {
            this.disableSubmit = false;
            this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
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