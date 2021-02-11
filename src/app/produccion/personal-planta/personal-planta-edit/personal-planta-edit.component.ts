import { PersonalPlanta } from './../models/personal-planta.model';
import { ViewChild, Component, Inject, OnInit, AfterViewInit, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { PlanillaOperacionEdit } from '../models/personal-planta.model';
import { PlanillaOperacionCriteria, PersonalPlantaCriteria } from '../models/personal-planta-personal.model';
import { PlanillaOperacionDatasource } from '../services/personal-planta.datasource';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { PlanillaOperacionService } from '../services/personal-planta.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_REGISTRAR_PLANILLA_OPERACION } from './../personal-planta.constant';
import * as _moment from 'moment';
// Date time completo
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeComponent } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { DatePipe } from '@angular/common';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { SelectionModel } from '@angular/cdk/collections';
import { WorkflowService } from '../../../workflow/services/workflow-service.service';
import { WorkflowMantenimientoModel } from '../../../workflow/models/workflow-mantenimiento.model';

/** Variable encargada de gestionar la propiedad momento de una hora  */
const moment = (_moment as any).default ? (_moment as any).default : _moment;
/** Constante con posibles valores de formatos de fecha/hora aceptados por el componente */
export const MY_CUSTOM_FORMATS = {
  parseInput: 'YYYY-MM-DD',
  parseInputHours: '+00 HH:mm:ss',
  fullPickerInput: 'DD/MM/YYYY HH:mm:ss',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'HH:mm',
  formatoInput: 'YYYY/MM/DD HH:mm:ss',
  formatoDateControl: 'YYYY/MM/DD HH:mm:ss'
};

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-produccion-personal-planta-edit',
  templateUrl: './personal-planta-edit.component.html',
  providers: [
    // `MomentDateTimeAdapter` can be automatically provided by importing
    // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },

    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ],
})

export class PersonalPlantaEditComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_PLANILLA_OPERACION;
  equipo: PlanillaOperacionEdit;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;
  disableEdit = true;
  clone: PlanillaOperacionEdit;
  horaInicioProgramacion: string;
  horaFinProgramacion: string;
  fechaDesde: string;
  equipo_clone: PlanillaOperacionEdit;
  datasend: any = [];
  turnoPersona: any = '';
  fechaTurno: string = '';
  usuarioId;
  dataSource1: PlanillaOperacionDatasource;
  personal = new PlanillaOperacionCriteria();
  personalExport = new PlanillaOperacionCriteria();
  selected = false;
  solicitudMaterial;
  /**  Columnas de la grilla que se van a exportar */
  dataExport: any = [];
  data: any;
  mantenimiento: any;
  transicionesMasivas = [];
  transicionesIndividuales = [];
  showTransition = false;
  pk: number;

  /** Elemento usado para gestionar la paginación de la grilla */
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  /** Elemento usado para gestionar el ordenamiento de la grilla */
  @ViewChild(MatSort)
  sort: MatSort;

  // Se agrega el código del mapa
  public selection = new SelectionModel<PlanillaOperacionCriteria>(true, []);
  /** Listado de pks seleccionados en la grilla */
  public listaPksSelect = [];
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'id',
    'persona.cargo.descripcion',
    'persona.nombres',
    'tipoDisponibilidad.valor',
    'programar',
    'observacion'
  ];

  public minDate: any = null;
  public maxDate: any = null;
  public fechaDesdeControl = new FormControl(moment(null));
  public fechaHastaControl = new FormControl(moment(null));
  public horaInicioControl = new FormControl(moment(null));
  public horaFinControl = new FormControl(moment(null));

  disableByFechaTurno = true;
  private fechaSistema = new Date();
  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private servicio: PlanillaOperacionService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PersonalPlantaEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private workflowService: WorkflowService
  ) {

    this.form = this.formBuilder.group(
      {
        turnoPersona: [null, Validators.compose([])],
        fechaTurno: [null, Validators.compose([])],
        tipoDisponibilidad: this.formBuilder.array([])
      });

    this.minDate = this.utilitiesService.convertStringToDate('2020-03-20', MY_CUSTOM_FORMATS.parseInput);
    this.form.updateValueAndValidity();
    const getDataList: any = data.id;
    this.pk = data.pk;
    //this.equipo = getDataList.content;
    this.solicitudMaterial = getDataList;
    this.getFechaSistema();
  }

  getFechaSistema() {
    this.servicio.getFechaSistema().subscribe( (data: any) => {
      this.fechaSistema = this.utilitiesService.getFechaClientFormatFix(data.fechaSistema.substring(0, 10));
    }, err => {
      this.fechaSistema = null;
      this.snackBar.open('No fue posible consultar la fecha del sistema', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    });
  }

  enabledTipoDisponibilidad(index: any, check: boolean) {
    if (check) {
      const tipos = this.form.controls.tipoDisponibilidad;
      tipos['controls'][index].get('tipoDisp').setValidators([Validators.required]);
      tipos['controls'][index].enable();
    } else {
      const tipos = this.form.controls.tipoDisponibilidad;
      tipos['controls'][index].get('tipoDisp').clearValidators();
      tipos['controls'][index].get('tipoDisp').setValue('');
      tipos['controls'][index].disable();
    }
  }

  ngOnInit() {
    // this.clone = JSON.parse(JSON.stringify(this.equipo));
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
    this.dataSource1 = new PlanillaOperacionDatasource(this.servicio);
    this.loadData();
    let perfil = window.atob(sessionStorage.getItem('payload1'));
    this.usuarioId = JSON.parse(perfil);
    this.loadMantenimientoActividad();

    this.dataSource1.equipoDataContent$.subscribe((item: PersonalPlanta[]) => {
      if (this.dataSource1.equipoData !== undefined) {
        const tipos = this.form.controls.tipoDisponibilidad as FormArray;
        tipos.controls = [];
        let i = 0;
        while (i < this.dataSource1.equipoData.content.length) {
          tipos.push(
            this.formBuilder.group({
              // tslint:disable-next-line: max-line-length
              tipoDisp: [this.dataSource1.equipoData.content[i].disponibilidad, [Validators.required]]
            })
          );
          tipos.controls[i].disable();
          i++;
        }
      }
    });
  }


  loadData(): void {
    this.dataSource1.loadData_programacion(this.personal);

    this.dataSource1.loading$.subscribe(response => {
      if (!response) {
        if (this.dataSource1.equipoData.content.length > 0) {
          this.dataSource1.equipoData.content.map((data: any) => {
            for (const index in this.listaPksSelect) {
              if (this.listaPksSelect[index].id === data.id) {
                data.programar = true;
                data.observaciones = this.listaPksSelect[index].observaciones;
              }
            }
          });
        }
      }
    });

  }

  loadMantenimiento(pk: number) {
    // tslint:disable-next-line: max-line-length
    this.servicio.detailByPk(pk).subscribe(mantenimiento => {
      this.data.mantenimiento = mantenimiento;
    });
  }

  loadMantenimientoActividad() {
    const procesoUrl = 'produccion';
    const actividadUrl = 'programar-personal-planta';
    this.showTransition = false;

    // tslint:disable-next-line: max-line-length
    this.servicio._getMantenimientoActividad(procesoUrl, actividadUrl).subscribe(mantenimientoActividad => {
      this.data = mantenimientoActividad;
      this.loadMantenimiento(this.pk);
      this.loadDataMantenimientoActividad();
    });
  }

  loadDataMantenimientoActividad() {
    if (typeof this.data.actividad !== 'undefined' &&
      typeof this.data.actividad.transiciones !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }
  }

  /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.personal.page = this.paginator.pageIndex;
      this.personal.size = this.paginator.pageSize;
      this.loadData();
    });

    this.sort.sortChange.subscribe(() => {
      this.personal.sortBy = this.sort.active;
      this.personal.sortOrder = this.sort.direction || 'asc';
      this.loadData();
    });
  }

  close() {
    this.equipo_clone = { ...this.equipo };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(value => {
      if (value == 1) {
        // tslint:disable-next-line:forin
        for (const key in this.equipo) {
          this.equipo[key] = this.clone[key];
        }
        this.dialogRef.close();
      } else {
        this.equipo = { ...this.equipo_clone };
      }
    });
  }



  save(dataLoad) {
    let payload = this.listaPksSelect;
    this.datasend = [];
    let enable = false;
    for (let i = 0; i < payload.length; i++) {
      if (payload[i].programar === true) {
        let array =
        {
          observaciones: payload[i].observaciones,
          programar: true,
          disponibilidad: { id: payload[i].disponibilidad ? payload[i].disponibilidad.id : 800490 },
          personalDisponible: { id: payload[i].id },
          solicitudTipoMaterialId: this.solicitudMaterial,
          turno: this.turnoPersona.valor,
          fecha: this.fechaTurno,
          personaId: payload[i].persona.id,
          usuarioId: this.usuarioId.id,
          nombresYapellidos: payload[i].persona.nombresYapellidos

        }
        enable = true;
        this.datasend.push(array);
      }
    }

    if (enable) {
      this.disableSubmit = true;
      this.servicio.create(this.datasend).subscribe(data => {
        this.enviada = false;
        this.showTransition = true;
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
      }, error => {
        this.disableSubmit = false;
        this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      });
    } else {
      this.snackBar.open('Favor seleccionar al menos un registro', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }


  onSubmit(dataPayload) {
    this.markAndValidateAllInputs(this.form);
    this.enviada = true;
    //this.disableSubmit = true;
    if (this.form.valid) {
      //this.disableSubmit = true;
      this.save(dataPayload);
    } else {
      this.disableSubmit = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
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
    for (let inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  setDataEquipo(atributo: any, objetoAtributo: any) {
    this.equipo[atributo] = objetoAtributo;
  }




  /**
   * Método encargado de realizar la sinconización entre mapa y grilla,
   * teniendo en cuenta los pks indicados y el pk seleccionado.
   *
   * @param datos Conjunto de Pks seleccionados en el mapa
   * @param event Conjunto de mantenimientos seleccionados en la grilla
   */
  masterToggle(datos: any, event: any) {
    if (event.checked) {
      this.listaPksSelect = [];
      if (datos.equipoSubject.value.length > 0) {
        datos.equipoSubject.value.map(data => {
          this.listaPksSelect.push(data);
          data.programar = true;
        });
      }
    } else {
      if (datos.equipoSubject.value.length > 0) {
        datos.equipoSubject.value.map(data => {
          data.programar = false;
        });
      }
    }
  }

  /**
   * Método encargado de mantener la sinconización entre los
   * pks del mapa y los de la grilla cuando se a seleccionado un pk en el mapa.
   *
   * @param filaTabla pk seleccionado a adicionar en listado de pks Seleccionados
   * @param event Evento se selección de pk en el mapa
   */
  toggleChecks(filaTabla: any, event: any, index: any) {
    this.enabledTipoDisponibilidad(index, event.checked);
    if (event.checked) {
      filaTabla.programar = true;
      this.listaPksSelect.push(filaTabla);
    } else {
      for (const index in this.listaPksSelect) {
        if (this.listaPksSelect[index].id === filaTabla.id) {
          this.listaPksSelect.splice(+index, 1);
        }
      }
    }
  }

  executeTransition() {
    this.applySingleTransitionTo();
  }

  public applySingleTransitionTo(): void {
    this.utilitiesService.scrollToTop();
    if (this.data.id) {
      this.workflowService.update(this.data).subscribe(
        data => {
          this.data = data;
          this.goHome();
        },
        error => {
          this.utilitiesService.formErrorMessages(error, null, this.snackBar);
        });
    } else {
      this
        .workflowService.create(this.data).subscribe(
          data => {
            this.data = data;
            this.goHome();
          },
          error => {
            this.utilitiesService.formErrorMessages(error, null, this.snackBar);
          });
    }
  }

  goHome() {
    this.dialogRef.close(this.form.value);
  }

  onChangeFechaTurno(event: any) {
    const fechaSeleccionada = this.utilitiesService.getFechaClientFormatFix(<string> event.substring(0, 10));
    if (fechaSeleccionada <= this.fechaSistema) {
      this.disableByFechaTurno = true;
    } else {
      this.disableByFechaTurno = false;
    }
  }

}
