import { MapService } from './../../../../shared/services/map.service';
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { FormComponent } from 'src/app/workflow/interfaces/workflow-forms.interface';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';

@Component({
  selector: 'app-editar-resultados-apiques',
  templateUrl: './editar-resultados-apiques.component.html'
})
export class EditarResultadosApiquesComponent extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy, FormComponent {


  columns = [
    'select',
    'pk',
    'origen',
    'zonaNombre',
    'localidadNombre',
    'barrioNombre',
    'cuadranteNombre',
    'calzadaArea',
    'calzadaLongitud',
    'acciones'
  ];


  // Constructor del componente
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
  ) {

    // Invocación del constructor padre
    super(servicio, commonService, formBuilder, workflowService,
      excelService, utilitiesServices, snackBar, tokenStorageService, mapService);

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.initDataSource();
    this.loadData();
  }

  elementToRow(element: WorkflowMantenimientoModel): any {
    const kmCarril: number = element.kmCarrilImpacto;
    return {
      pk: element.pk,
      origen: element.origen != null ? element.origen.descripcion : '',
      zonaNombre: element.zona != null ? element.zona.nombre : '',
      localidadNombre: element.localidad != null ? element.localidad.nombre : '',
      barrioNombre: element.barrio != null ? element.barrio.nombre : '',
      cuadranteNombre: element.cuadrante != null ? element.cuadrante.nombre : '',
      calzadaArea: element.area,
      calzadaLongitud: element.longitud
    };
  }

  export() {
    const headers = [{
      pk: 'PK',
      origen: 'origen',
      zonaNombre: 'zona',
      localidadNombre: 'localidad',
      barrioNombre: 'barrio',
      cuadranteNombre: 'cuadrante',
      calzadaArea: 'area',
      calzadaLongitud: 'longitud'
    }];

    const order = [
      'pk',
      'origen',
      'zonaNombre',
      'localidadNombre',
      'barrioNombre',
      'cuadranteNombre',
      'calzadaArea',
      'calzadaLongitud',
    ];

    this.exportToExcel(headers, order);
  }

}
