import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { EstadisticaUsuarioService } from '../services/estadisticaUsuario.service';
import { EstadisticaUsuarioModel } from '../models/estadisticaUsuario.model';
import {Chart} from 'chart.js';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-estadistica-usuario-detail-widget',
  templateUrl: './estadistica-usuario-detail-widget.component.html'
})
export class EstadisticaUsuarioDetailWidgetComponent implements OnInit, OnDestroy {

  /** Variable usada para manejo de estadisticas */
  public chart: any = null;
  /** Variable usada para manejo de estadisticas */
  public charts: Chart [] = [];

  /**
   * Variable usada para procesamiento del conjunto
   * de datos que representan las estadisticas del usuario
   */
  public data: any [] = [];

  /** Listado de estadisticas de usuario */
  public estadisticasUsuario: EstadisticaUsuarioModel[] = [];

  /** Bandera que indica que el componente se encuentra procesando */
  processing = false;


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param _servicio Servicio usado en el componente para gestionar las peticiones
  * @param _utilitiesService Componente de utilidades de peticiones a servicios
  * @param snackBar Componente usado para abrir un recuadro modal
  */
  constructor(
    private _servicio: EstadisticaUsuarioService,
    private _utilitiesService: UtilitiesService,
    private snackBar: MatSnackBar
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.loadData();
  }

  /**
  * Método encargado de gestionar la carga de los pks
  * de la grilla al iniciar el componente.
  */
  loadData() {
    this.processing = true;
    this._servicio.detail().subscribe(data => {
      this.estadisticasUsuario = data;
      setTimeout(() => {
        this.buildChart();
      }, 1000);
      this.processing = false;

    }, error => {
      this.processing = false;
      this._utilitiesService.formErrorMessages(error, null, this.snackBar);
    });

  }

  /** Método encargado de construir los elementos de estadisticos del usuario */
  buildChart() {
    let countCharts = 0;
    for (const estadistica of this.estadisticasUsuario) {
      this.data[countCharts] = {
        datasets: [{
            data: [estadistica.pendientes, estadistica.gestionados],
            backgroundColor: [
              '#F53030',
              '#54DD21',
          ]
        }],

        labels: [
            'Abiertos',
            'Cerrados',
        ]
      };

      this.charts[countCharts] = new Chart('canvas' + countCharts, {
        type: 'pie',
        data: this.data[countCharts],

        options: {
          responsive: true,
          title: {
            display: true,
            text: estadistica.actividadNombre
        }
        }
      });
      countCharts++;
    }
  }

  /** Método que se ejecuta una vez invocada la destrucción del componente */
  ngOnDestroy() { }

}
