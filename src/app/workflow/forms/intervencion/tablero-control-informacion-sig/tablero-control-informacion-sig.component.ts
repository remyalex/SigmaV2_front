import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, AfterViewChecked } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { MapService } from 'src/app/shared/services/map.service';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatSnackBar, MatSidenav, MatDialog, MatDialogConfig } from '@angular/material';
import { FiltrosComponent } from 'src/app/intervencion/tablero-control-infomacion-sig/filtros/filtros.component';
import { Localidad } from 'src/app/administracion/ubicaciones/localidad/models/localidad.model';
import { Zona } from 'src/app/administracion/ubicaciones/zona/models/zona.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { ChartCriteria } from 'src/app/shared/component/sigma-chart-tablero-control-sig/models/chart-criteria';

interface GraficaNode {
  name: string;
  checked: boolean;
  children?: GraficaNode[];
}

interface GraficaChild {
  name: string;
  checked: boolean;
}

/** Flat node with expandable and level information */
interface GraficasFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  checked: boolean;
}

@Component({
  selector: 'app-tablero-control-informacion-sig',
  templateUrl: './tablero-control-informacion-sig.component.html'
})
// tslint:disable-next-line: component-class-suffix
export class ConsultarTableroControlInformacionSIG extends BaseComponent implements OnInit, AfterViewChecked, OnDestroy {

  criteriaChart: ChartCriteria;

  mode = new FormControl('side');

  graficas_disponibles: GraficaNode[] = [
    {
      name: 'Seguimiento a la Territorialización de la Vigencia',
      checked: true,
      children: [
        {name: 'Localidades', checked: true},
        {name: 'Actividad Agrupada', checked: false},
        {name: 'Estrategia', checked: false}
      ]
    }, {
      name: 'Seguimiento Acumulado a la Programación',
      checked: true,
      children: [
        {name: 'Seguimiento a la Programación', checked: true}
      ]
    }, {
      name: 'Consumo de Mezcla',
      checked: true,
      children: [
        {name: 'Acumulado', checked: true},
        {name: 'No Acumulado', checked: false}
      ]
    }, {
      name: 'Directores',
      checked: true,
      children: [
        {name: 'Tipo Material', checked: true},
        {name: 'Numero de Segmentos', checked: false},
        {name: 'Jornada', checked: false}
      ]
    }, {
      name: 'Numero de Segmentos Ejecutados',
      checked: true,
      children: [
        {name: 'Numero de Segmentos Ejecutados', checked: true}
      ]
    }, {
      name: 'Avance Ejecución Km Carril',
      checked: true,
      children: [
        {name: 'Avance Ejecución Km Carril', checked: true}
      ]
    }, {
      name: 'Informe General de Avance',
      checked: true,
      children: [
        {name: 'Huecos', checked: true},
        {name: 'Estrategia Km Carril', checked: false},
        {name: 'Estrategia Mezcla', checked: false},
      ]
    }
  ];

  private _transformer = (node: GraficaNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      checked: node.checked,
    };
  }

  // tslint:disable-next-line: member-ordering
  treeControl = new FlatTreeControl<GraficasFlatNode>(
      node => node.level, node => node.expandable);

  // tslint:disable-next-line: member-ordering
  treeFlattener = new MatTreeFlattener(
      this._transformer,
      node => node.level,
      node => node.expandable,
      node => node.children);

  // tslint:disable-next-line: member-ordering
  dataSource2 = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  // tslint:disable-next-line: member-ordering
  nombresCapasTablero: any[];


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
    private matDialog: MatDialog
  ) {
    super(servicio, commonService, formBuilder, workflowService,
      excelService, utilitiesServices, snackBar, tokenStorageService, mapService);
      this.dataSource2.data = this.graficas_disponibles;
      // this.mapService.limpiarNobresCapasTableroControl();
      this.criteriaChart = new ChartCriteria();
  }

  hasChild = (_: number, node: GraficasFlatNode) => node.expandable;


  /** Método encargado de inicializar el componente */
  ngOnInit() {

    this.mapService.getVisor().visible = true;
    this.mapService.getVisor().seleccionMasiva = true;
    this.mapService.getVisor().ocultarRuteo();

    this.mapService.getVisor().setMapFilterForce(this.criteriaChart.getMapQuery());
    this.mapService.getVisor().seleccionMasiva = false;
    this.mapService.getVisor().ocultarControlesSeleccionMultiple();
    // this.mapService.getVisor().agregarControlesSeleccionMultiple();
    // this.mapService.getVisor().mostrarControlesSeleccionMultiple();
    this.mapService.getVisor().definirEscalasVisualizacion(100000);
    this.mapService.nombresCapasTableroControl$.subscribe(nombresCapas => {
        if (nombresCapas) {
          this.nombresCapasTablero = nombresCapas;
          // console.log('this.nombresCapasTablero');
          // console.log(this.nombresCapasTablero);
        }
    });
    this.getListaItemAnioActual();
  }

  accionCerrarSideNav() {
    // console.log(this.graficas_disponibles);
  }

  changeChecked(node: GraficaChild, event: any) {
    for (const seccion of this.graficas_disponibles) {
      if (seccion.children) {
        for (const grafica of seccion.children) {
          if (grafica.name === node.name) {
              grafica.checked = event.checked;
              break;
          }
        }
      }
    }
  }

  verFiltros() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = this.criteriaChart;
    const dialogRef = this.matDialog.open(FiltrosComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(data => {
      this.criteriaChart = data.filters;
      if (data.value === 1) {
        this.mapService.getVisor().setMapFilterForce(this.getMapFilter());
        for (const seccion of this.graficas_disponibles) {
          if (seccion.children) {
            for (const grafica of seccion.children) {
              if (grafica.checked) {
                grafica.checked = false;
                this.changeStatus(grafica);
              }
            }
          }
        }
      }
    });
  }

  limpiarMapa() {
    this.mapService.getVisor().limpiar();
  }

  async changeStatus(grafica: GraficaChild) {
    setTimeout(() => {
      grafica.checked = true;
    }, 50);
  }

  getMapFilter(): string {
    let sql = '';
    if (this.criteriaChart.getMapQuery() !== '') {
      sql = this.criteriaChart.getMapQuery();
    }
    return sql;
  }


  ngAfterViewInit() {
    this.mapService.getVisor().activarListadoCapasTableroControl();
  }

  /** Método que se ejecuta una vez invocada la destrucción del componente */
  ngOnDestroy(): void {
    this.mapService.limpiarNobresCapasTableroControl();
    this.mapService.getVisor().desactivarListadoCapasTableroControl();
  }

  getListaItemAnioActual() {
    this.commonService.getListaItemByNombreListaAndValorItem(
        'INTERVENCION_ANIO_VIGENCIA_MANTENIMIENTO', this.getAnioActual()).subscribe(item => {
      this.criteriaChart.anioVigencia = item;
    });
  }

  getAnioActual(): string {
    const date = new Date();
    return date.getFullYear().toString();
}

}
