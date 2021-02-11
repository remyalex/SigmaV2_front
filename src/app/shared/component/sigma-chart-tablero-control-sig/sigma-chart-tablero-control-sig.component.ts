import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { EstadisticaUsuarioModel } from 'src/app/administracion/estadisticausuario/models/estadisticaUsuario.model';
import { EstadisticaUsuarioService } from 'src/app/administracion/estadisticausuario/services/estadisticaUsuario.service';
import { UtilitiesService } from '../../services/utilities.service';
import { MatSnackBar } from '@angular/material';
import { Chart } from 'chart.js';
import { ChartTableroControService } from './services/chart-tablero-control.service';
import { ChartCriteria } from './models/chart-criteria';
import { ChartDefinition } from './models/chartDefinition';

/** Componente encargado de gestionar el componente tablero */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-chart-tablero-control-sig',
  templateUrl: './sigma-chart-tablero-control-sig.component.html',
  styleUrls: ['./sigma-chart-tablero-control-sig.component.scss']
})
export class SigmaChartTableroControlSigComponent implements OnInit, AfterViewInit {

  /** Variable usada para recibir Id en la invocación del componente */
  @Input() idChart: string;
  /** Variable usada para recibir título en la invocación del componente */
  @Input() title: string;
  /** Variable usada para recibir nombre en la invocación del componente */
  @Input() chartName: string;
  /** Variable usada para recibir el criterio en la invocación del componente */
  @Input() criteriaChart: ChartCriteria;

  public chart: Chart;
  public data: any;
  public estadisticasUsuario: EstadisticaUsuarioModel[] = [];
  /**
   * Variable bandera con la cual se identifica si el componente
   * se encuentra realizando algun procesamiento de información
   */
  processing = false;


  /**
  * Método encargado de construir una instancia de la clase
  * @param _utilitiesService Componente de utilidades de peticiones a servicios
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param _servicio Servicio usado en el componente para gestionar las peticiones
  */
  constructor(
    private _utilitiesService: UtilitiesService,
    private snackBar: MatSnackBar,
    private _servicio: ChartTableroControService
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
  ngAfterViewInit() {
    this.buildChart();
  }

  /** Método encargado de construir los caracteres recibidos */
  buildChart() {
    this._servicio.getDataChartEstrategia(this.criteriaChart, this.title + ' - ' + this.chartName).subscribe((datos: ChartDefinition) => {
      for (const dato of datos.data.datasets) {
        if (dato.type === null) {
          dato.type = undefined;
          dato.fill = undefined;
          dato.borderColor = undefined;
        }
      }
      this.chart = new Chart('canvas' + this.idChart, {
        type: datos.type,
        data: datos.data,
        options: {
          responsive: true,
          title: {
            display: true,
            text: this.chartName
          },
          scales: {
            yAxes: [{
              stacked: datos.options.ystacked,
              scaleLabel: {
                display: true,
                labelString: datos.options.yaxesLabel
              }
            }],
            xAxes: [{
              stacked: datos.options.xstacked,
              scaleLabel: {
                display: true,
                labelString: datos.options.xaxesLabel
              }
            }]
          }
        }
      });
    });
  }

}
