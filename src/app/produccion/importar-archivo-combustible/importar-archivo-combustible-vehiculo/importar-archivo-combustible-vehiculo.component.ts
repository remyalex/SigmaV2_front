import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImportarExcelModel } from 'src/app/shared/models/importar.excel.model';
import { ImportarExcelRespuestaModel } from 'src/app/shared/models/importar.excel.respuesta.model';
import { RecursoDisponiblidadInfo } from 'src/app/administracion/personadisponibilidad/models/recursodisponibilidadimport.model';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { MatTableDataSource, MatPaginator, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { RowResult } from 'src/app/shared/models/importar.row.result.model';
import { ImportarDisponibilidadEquipoComponent } from 'src/app/workflow/forms/solicitud/shared/importar-disponibilidad-equipo/importar-disponibilidad-equipo.component';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_PRODUCCION_IMPORTAR_COMBUSTIBLE_VEHICULO } from '../importar-archivo-combustible.constant';
import { ArchivoCombustible } from '../models/archivo-combustible.model';
import { ListaCriteria } from 'src/app/administracion/listas/models/lista-criteria.model';
import { ListasService } from 'src/app/administracion/listas/services/listas.service';
import { CargueConsumoCombustible } from '../models/cargue-consumo-combustible.model';
import { Archivo } from 'src/app/workflow/models/archivo.model';
import { Messages } from '../models/messages.model';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { formatDate, DatePipe } from '@angular/common';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { ImportarArchivoCombustibleService } from '../services/importar-archivo-combustible.service';

@Component({
  selector: 'app-importar-archivo-combustible-vehiculo',
  templateUrl: './importar-archivo-combustible-vehiculo.component.html'
})
export class ImportarArchivoCombustibleVehiculoComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_IMPORTAR_COMBUSTIBLE_VEHICULO;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  archivoCombustible: ArchivoCombustible;
  cargueConsumoCombustible: CargueConsumoCombustible[];
  archivoId: Archivo;
  mensajes: Messages;
  hayInconsistencias: boolean = false;

  //  workflowService: WorkflowService;
  commonService: ImportarArchivoCombustibleService;

  processing: Boolean;
  finished = false;

  disableSubmit = true;
  criteriaList: ListaCriteria;
  /**  Fuente de conjunto de datos para manejo de datos a exportar en la grilla */
  dataSourceExport: MatTableDataSource<CargueConsumoCombustible>;
  /** Columnas de los datos que se exportarán a presionar el botón exportar del componente*/
  dataExport: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    formBuilder: FormBuilder,
    private dialog: MatDialog,
    commonService: ImportarArchivoCombustibleService,
    //    workflowService: WorkflowService,
    private servicioListas: ListasService,
    private excelService: ExcelService,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService
  ) {
    this.commonService = commonService;
    //    this.workflowService = workflowService;
    this.form = formBuilder.group({
      'archivoId': [null, Validators.compose([Validators.required])],
    });
    this.processing = false;
    this.archivoCombustible = new ArchivoCombustible();
    this.criteriaList = new ListaCriteria();
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.criteriaList.nombre = 'ADMINISTRACION_TIPO_CARGUE';
    this.criteriaList.descripcion = 'TIPO_CARGUE_COMBUSTIBLE_VEHICULOS_AUTOMOTORES';

    this.servicioListas.listByNombreItem(this.criteriaList.nombre, this.criteriaList.descripcion).subscribe(
      data => {
        this.archivoCombustible.tipoCargue = data;
      }
    );
  }

  import() {
    this.disableSubmit = true;
    this.processing = true;
    this.archivoCombustible.archivo = this.archivoId;
    this.commonService.importarArchivo(this.archivoCombustible).subscribe(
      data => {
        this.cargueConsumoCombustible = data;
        this.processing = false;
        this.finished = true;
        this.verResultado();
      },
      error => {
        this.processing = false;
        this.finished = true;
      });

    this.archivoId = null;
  }

  verResultado() {
    this.mensajes = new Messages();

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.hayInconsistencias = false;
    for (let i = 0; i < this.cargueConsumoCombustible.length; i++) {
      if (this.cargueConsumoCombustible[i].tipoInconsistencia != null && this.cargueConsumoCombustible[i].tipoInconsistencia != '') {
        this.hayInconsistencias = true;
        break;
      }
    }

    if (this.hayInconsistencias) {
      this.mensajes.titulo = this.constants.tituloInconsistencia;
      this.mensajes.mensaje = this.constants.mensajeInconsistencia;
      dialogConfig.data = this.mensajes;

      const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);
      dialogRef.beforeClosed().subscribe(val => {
        if (val === 1) {
          this.onSubmit();
          this.descargarInconsistencias(this.cargueConsumoCombustible);
        }
      });
    } else if (this.cargueConsumoCombustible.length == 0){
      this.mensajes.titulo = this.constants.tituloInconsistencia;
      this.mensajes.mensaje = this.constants.mensajeInconsistencia;
      dialogConfig.data = this.mensajes;
      const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

      dialogRef.beforeClosed().subscribe(val => {
        if (val === 1) {
          this.descargarInconsistencias(this.cargueConsumoCombustible);
        }
      });

    } else {
      this.mensajes.titulo = this.constants.tituloCargue;
      this.mensajes.mensaje = this.constants.mensajeCargue;
      dialogConfig.data = this.mensajes;
      const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

      dialogRef.beforeClosed().subscribe(val => {
        if (val === 1) {
          this.onSubmit();
        }
      });

    }

  }

  descargarInconsistencias(cargueConsumoCombustible: CargueConsumoCombustible[]) {
    console.log('INCONSISTENCIAS');
    this.exportAsXLSX();
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */
   onSubmit() {
    console.log('CORRECTO');
    this.archivoCombustible.cargueConsumoCombustible = this.cargueConsumoCombustible;
    this.commonService.procesarArchivo(this.archivoCombustible).subscribe(
      data => {
        if (!this.hayInconsistencias) {
          this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
        }
      },
      error => {
        this.disableSubmit = false;
        this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

  activarProceso(event) {
    if (event == undefined || event == null || !event.id) {
      this.disableSubmit = true;
    } else {
      this.disableSubmit = false;
    }
  }


  exportAsXLSX(): void {

    this.dataSourceExport = new MatTableDataSource<CargueConsumoCombustible>(this.cargueConsumoCombustible);

    const content = this.dataSourceExport.data.map((cargue: CargueConsumoCombustible) => {
      return {
        chip: cargue.numeroChip != null ? cargue.numeroChip : '',
        tiquete: cargue.numTiquete != null ? cargue.numTiquete : '',
        fecha: cargue.fechaSuministro != null ? this.datePipe.transform(cargue.fechaSuministro, 'dd/MM/yyyy') : '',
        placa: cargue.numeroPlaca != null ? cargue.numeroPlaca : '',
        tipoCombustible: cargue.tipoCombustible != null ? cargue.tipoCombustible : '',
        cantidad: cargue.cantidad != null ? cargue.cantidad : '',
        kms: cargue.kmsTanqueo != null ? cargue.kmsTanqueo : '',
        valor: cargue.valorCombustible != null ? cargue.valorCombustible : '',
        inconsistencia: cargue.tipoInconsistencia != null ? cargue.tipoInconsistencia : ''
      };
    });

    const headers = [{
      chip: 'No. Chip',
      tiquete: 'No. Tiquete',
      fecha: 'Fecha Suministro',
      placa: 'No. de Placa',
      tipoCombustible: 'Tipo Combustible',
      cantidad: 'Cantidad',
      kms: 'Kms Tanqueo',
      valor: 'Valor Combustible',
      inconsistencia: 'Inconsistencia'
    }];


    this.dataExport = [...headers, ...content];
    const order = ['chip', 'tiquete', 'fecha', 'placa', 'tipoCombustible', 'cantidad', 'kms', 'valor', 'inconsistencia'];
    this.excelService.exportAsExcelFileCustom(this.dataExport, 'CargueConsumoCombustible', true, order);
  }

}


