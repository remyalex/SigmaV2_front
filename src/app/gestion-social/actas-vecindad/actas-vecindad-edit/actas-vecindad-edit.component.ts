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
    selector: 'app-actas-vecindad-edit',
    templateUrl: './actas-vecindad-edit.component.html'
})
export class ActasVecindadEditComponent extends BaseComponent implements OnInit, AfterViewChecked, FormComponent {
    /** Constantes a usar en el componente */
    @Output() irAtras = new EventEmitter();
    @Output() goToHome = new EventEmitter();
    constants = CONST_ACTAS_VECINDAD;
    private customerDiffer: KeyValueDiffer<string, any>;
    acta: Acta;
    form: FormGroup;
    enviada = false;
    requerido = true;
    disableSubmit = false;
    items: ListaItem[];
    usoActual: Uso_Servicio[];
    servicioPublico: Uso_Servicio[];
    sub: Subscription;
    index: number;

    registroNomenclaturaDatasource: MatTableDataSource<ActaArchivos>;
    registroFachadaDatasource: MatTableDataSource<ActaArchivos>;
    registroFotograficoDatasource: MatTableDataSource<ActaArchivos>;

    columnasTablaFotos = ['consecutivoFoto', 'nombreFoto', 'fotos', 'acciones'];
    minFotosNomenclatura = 1;
    minFotosFachada = 1;
    minFotosRegistro = 1;
    maxFotosNomenclatura = 1;
    maxFotosFachada = 1;
    maxFotosRegistro = 7;

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

        this.items = [];
        for (var i = 0; i < this.data.mantenimiento.actasVecindad[this.index].usoActual.length; i++) {
            this.items.push(this.data.mantenimiento.actasVecindad[this.index].usoActual[i].item);
        }
        this.acta.usos = this.items;

        this.items = [];
        for (var i = 0; i < this.data.mantenimiento.actasVecindad[this.index].serviciosPublicos.length; i++) {
            this.items.push(this.data.mantenimiento.actasVecindad[this.index].serviciosPublicos[i].item);
        }
        this.acta.servicios = this.items;

        this.registroNomenclaturaDatasource = new MatTableDataSource(this.data.mantenimiento.actasVecindad[this.index].registroNomenclatura);
        this.registroFachadaDatasource = new MatTableDataSource(this.data.mantenimiento.actasVecindad[this.index].registroFachada);
        this.registroFotograficoDatasource = new MatTableDataSource(this.data.mantenimiento.actasVecindad[this.index].registroFotografico);

        this.form = this.formBuilder.group({
            id: [null],
            noActaVecindad: [null],
            volanteEntregado: [null, Validators.compose([Validators.required])],
            tipoIntervencion: [null, Validators.compose([Validators.required])],
            otroTipoIntervencion: [null, Validators.compose([Validators.maxLength(100)])],
            fecha: [null],
            localidad: [null],
            upla: [null],
            barrio: [null],
            civ: [null],
            pk: [null],
            propietario: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
            telefono: [null, Validators.compose([Validators.max(9999999), Validators.pattern("^[0-9]*$")])],
            movil: [null, Validators.compose([Validators.max(9999999999), Validators.pattern("^[0-9]*$")])],
            direccion: [null, Validators.compose([Validators.required, Validators.maxLength(300)])],
            noPisosPredio: [null, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$"), Validators.max(999)])],
            estratoPredio: [null, Validators.compose([Validators.required])],
            servicios: [null, Validators.compose([Validators.required])],
            usos: [null, Validators.compose([Validators.required])],
            personasConDiscapacidad: [null, Validators.compose([Validators.required])],
            tieneGaraje: [null, Validators.compose([Validators.required])],
            fachadaEstructurada: [null, Validators.compose([Validators.required])],
            fachadaParedes: [null, Validators.compose([Validators.required])],
            fachadaVentanaPuertas: [null, Validators.compose([Validators.required])],
            fachadaCerramiento: [null, Validators.compose([Validators.required])],
            publicoConfinamiento: [null, Validators.compose([Validators.required])],
            publicoRecubrimiento: [null, Validators.compose([Validators.required])],
            publicoRampaAcceso: [null, Validators.compose([Validators.required])],

            descripcionAfectacionfachadaEstructurada: [null, Validators.compose([Validators.maxLength(500)])],
            descripcionAfectacionfachadaParedes: [null, Validators.compose([Validators.maxLength(500)])],
            descripcionAfectacionfachadaVentanaPuertas: [null, Validators.compose([Validators.maxLength(500)])],
            descripcionAfectacionfachadaCerramiento: [null, Validators.compose([Validators.maxLength(500)])],
            descripcionAfectacionpublicoConfinamiento: [null, Validators.compose([Validators.maxLength(500)])],
            descripcionAfectacionpublicoRecubrimiento: [null, Validators.compose([Validators.maxLength(500)])],
            descripcionAfectacionpublicoRampaAcceso: [null, Validators.compose([Validators.maxLength(500)])],

            socialNombre: [null],
            socialIdentificacion: [null],
            socialFirma: [null],
            habitanteNombre: [null],
            habitantelIdentificacion: [null],
            habitantelFirma: [null],
            tecnicoNombre: [null],
            tecnicoIdentificacion: [null],
            tecnicoFirma: [null],
            interventoriaNombre: [null],
            interventoriaIdentificacion: [null],
            interventoriaFirma: [null],
            descripcionPredio: [null, Validators.compose([Validators.required, Validators.maxLength(5000)])],
            registroNomenclatura: [null, Validators.compose([Validators.required, CountMaxElementsValidator(this.maxFotosNomenclatura),
            CountMinElementsValidator(this.minFotosNomenclatura)])],
            registroFachada: [null, Validators.compose([Validators.required, CountMaxElementsValidator(this.maxFotosFachada),
            CountMinElementsValidator(this.minFotosFachada)])],
            registroFotografico: [null, Validators.compose([Validators.required, CountMaxElementsValidator(this.maxFotosRegistro),
            CountMinElementsValidator(this.minFotosRegistro)])],
            aprobado: [null],
            adjunto: [null],
        });
    }

    /** Método encargado de inicializar el componente */
    ngOnInit() {
        this.clone = JSON.parse(JSON.stringify(this.acta));
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
                this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
                    duration: 5000,
                    panelClass: ['success-snackbar']
                });
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
        this.registros();
        this.validarOtros(this.form);
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

    validarOtros(anyForm: FormGroup) {
        if (anyForm.controls['tipoIntervencion'].valid) {
            if (anyForm.controls['tipoIntervencion'].value.descripcion == 'OTRO') {
                anyForm.controls['otroTipoIntervencion'].setValidators([Validators.required, Validators.maxLength(100)]);
            } else {
                anyForm.controls['otroTipoIntervencion'].setValue(null);
                anyForm.controls['otroTipoIntervencion'].clearValidators();
            }
        }

        if (anyForm.controls['fachadaEstructurada'].valid &&
            anyForm.controls['fachadaParedes'].valid &&
            anyForm.controls['fachadaVentanaPuertas'].valid &&
            anyForm.controls['fachadaCerramiento'].valid &&
            anyForm.controls['publicoConfinamiento'].valid &&
            anyForm.controls['publicoRecubrimiento'].valid &&
            anyForm.controls['publicoRampaAcceso'].valid
        ) {

            if (anyForm.get('fachadaEstructurada').value.descripcion === 'CON AFECTACIÓN') {
                anyForm.get('descripcionAfectacionfachadaEstructurada')
                    .setValidators([Validators.required, Validators.maxLength(500)]);
            } else {
                anyForm.get('descripcionAfectacionfachadaEstructurada').setValue(null);
                anyForm.get('descripcionAfectacionfachadaEstructurada').clearValidators();
                this.acta.descripcionAfectacionfachadaEstructurada = null;
            }

            if (anyForm.get('fachadaParedes').value.descripcion === 'CON AFECTACIÓN') {
                anyForm.get('descripcionAfectacionfachadaParedes')
                    .setValidators([Validators.required, Validators.maxLength(500)]);
            } else {
                anyForm.get('descripcionAfectacionfachadaParedes').setValue(null);
                anyForm.get('descripcionAfectacionfachadaParedes').clearValidators();
                this.acta.descripcionAfectacionfachadaParedes = null;
            }

            if (anyForm.get('fachadaVentanaPuertas').value.descripcion === 'CON AFECTACIÓN') {
                anyForm.get('descripcionAfectacionfachadaVentanaPuertas')
                    .setValidators([Validators.required, Validators.maxLength(500)]);
            } else {
                anyForm.get('descripcionAfectacionfachadaVentanaPuertas').setValue(null);
                anyForm.get('descripcionAfectacionfachadaVentanaPuertas').clearValidators();
                this.acta.descripcionAfectacionfachadaVentanaPuertas = null;
            }

            if (anyForm.get('fachadaCerramiento').value.descripcion === 'CON AFECTACIÓN') {
                anyForm.get('descripcionAfectacionfachadaCerramiento')
                    .setValidators([Validators.required, Validators.maxLength(500)]);
            } else {
                anyForm.get('descripcionAfectacionfachadaCerramiento').setValue(null);
                anyForm.get('descripcionAfectacionfachadaCerramiento').clearValidators();
                this.acta.descripcionAfectacionfachadaCerramiento = null;
            }

            if (anyForm.get('publicoConfinamiento').value.descripcion === 'CON AFECTACIÓN') {
                anyForm.get('descripcionAfectacionpublicoConfinamiento')
                    .setValidators([Validators.required, Validators.maxLength(500)]);
            } else {
                anyForm.get('descripcionAfectacionpublicoConfinamiento').setValue(null);
                anyForm.get('descripcionAfectacionpublicoConfinamiento').clearValidators();
                this.acta.descripcionAfectacionpublicoConfinamiento = null;
            }

            if (anyForm.get('publicoRecubrimiento').value.descripcion === 'CON AFECTACIÓN') {
                anyForm.get('descripcionAfectacionpublicoRecubrimiento')
                    .setValidators([Validators.required, Validators.maxLength(500)]);
            } else {
                anyForm.get('descripcionAfectacionpublicoRecubrimiento').setValue(null);
                anyForm.get('descripcionAfectacionpublicoRecubrimiento').clearValidators();
                this.acta.descripcionAfectacionpublicoRecubrimiento = null;
            }

            if (anyForm.get('publicoRampaAcceso').value.descripcion === 'CON AFECTACIÓN') {
                anyForm.get('descripcionAfectacionpublicoRampaAcceso')
                    .setValidators([Validators.required, Validators.maxLength(500)]);
            } else {
                anyForm.get('descripcionAfectacionpublicoRampaAcceso').setValue(null);
                anyForm.get('descripcionAfectacionpublicoRampaAcceso').clearValidators();
                this.acta.descripcionAfectacionpublicoRampaAcceso = null;
            }

        }
    }

    registros() {
        this.items = this.acta.usos;
        this.servicioPublico = [];
        for (var i = 0; i < this.items.length; i++) {
            this.servicioPublico.push(new Uso_Servicio());
            this.servicioPublico[i].item = this.items[i];
        }
        this.acta.usoActual = this.servicioPublico;

        this.items = this.acta.servicios;
        this.usoActual = [];
        for (var i = 0; i < this.items.length; i++) {
            this.usoActual.push(new Uso_Servicio());
            this.usoActual[i].item = this.items[i];
        }
        this.acta.serviciosPublicos = this.usoActual;
    }

    addFotos(fieldComponent: string): void {
        var dataSource = fieldComponent + "Datasource";
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'edit-modalbox';
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            fotos: this.acta[fieldComponent],
            datasource: this[dataSource],
            foto: new ActaArchivos()
        };
        dialogConfig.width = '70%';
        const dialogRef = this.dialog.open(FotosComponent, dialogConfig);
    }

    removeFoto(index: number, fieldComponent: string) {
        var dataSource = fieldComponent + "Datasource";
        this.acta[fieldComponent].splice(index, 1);
        this[dataSource].data = this.acta[fieldComponent];
        switch (fieldComponent) {
            case "registroNomenclatura":
                this.form.get('registroNomenclatura').setValue(this.acta.registroNomenclatura);
                break;
            case "registroFachada":
                this.form.get('registroFachada').setValue(this.acta.registroNomenclatura);
                break;
            case "registroFotografico":
                this.form.get('registroFotografico').setValue(this.acta.registroNomenclatura);
                break;
        }
    }
}