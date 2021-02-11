import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { CONST_CONSULTAR_PROGRAMACION_PERIODICA } from '../consultar-programacion.constants';
import { ConsultarProgramacionTotal } from '../models/consultarProgramacionTotales.model';
import { ConsultarProgramacionModel } from '../models/consultarProgramacion.model';

@Component({
  selector: 'app-consulta-totales',
  templateUrl: './consulta-totales.component.html'
})
export class ConsultaTotalesComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_CONSULTAR_PROGRAMACION_PERIODICA;

  totales: ConsultarProgramacionTotal[] = [];
  _data: ConsultarProgramacionModel[] = [];

  @Input() data: any;

  dataSourceTotales: any;

  columnsTotales = [
    'estadoObra', 'TotalKmImpacto', 'TotalKmLineal', 'TotalKmObra', 'diasDuracionPlaneada'
  ];

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() {
    const enEjecucion = this.initRowTotal(this.constants.enEjecucion);
    const inicio = this.initRowTotal(this.constants.inicio);
    const inicioTerminado = this.initRowTotal(this.constants.inicioTerminado);
    const terminado = this.initRowTotal(this.constants.terminado);
    this.totales.push(enEjecucion);
    this.totales.push(inicio);
    this.totales.push(inicioTerminado);
    this.totales.push(terminado);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.dataSourceTotales = new MatTableDataSource(this.totales);
    this.buildTotales();
  }

  initRowTotal(name: string) {
    const total = {
      estadoObra: name,
      totalKmImpacto: 0,
      totalKmLineal: 0,
      totalKmObra: 0,
      duracionPlaneada: 0
    };
    return total;
  }

  buildTotales() {
    this.dataSourceTotales.data.map(total => {
      total.totalKmImpacto = 0;
      total.totalKmLineal = 0;
      total.totalKmObra = 0;
      total.duracionPlaneada = 0;
    });
    this.data.map(m => {
      if (m.estadoObraNombre) {
        if (m.estadoObraNombre === this.constants.inicio) {
          this.calcular(this.constants.inicio, m);
        } else if (m.estadoObraNombre.includes('EJECUCI')) {
          this.calcular(this.constants.enEjecucion, m);
        } else if (m.estadoObraNombre === this.constants.inicioTerminado) {
          this.calcular(this.constants.inicioTerminado, m);
        } else if (m.estadoObraNombre === this.constants.terminado) {
          this.calcular(this.constants.terminado, m);
        }
      }
    });
  }

  calcular(nombre: string, m: any) {
    const total = this.totales.find(t => t.estadoObra === nombre);
    total.totalKmImpacto = total.totalKmImpacto + m.kmCarrilImpacto;
    total.totalKmLineal = total.totalKmLineal + m.kmCarrilLineal;
    total.totalKmObra = total.totalKmObra + m.kmCarrilObra;
    total.duracionPlaneada = total.duracionPlaneada + m.duracionPlaneada;
  }

  calcularKmsCarril(): number {
    let totalkms = 0;
    for (const mantenimiento of this.data) {
      totalkms = totalkms + mantenimiento.kmCarrilImpacto;
    }
    return totalkms;
  }

  calcularKms(attr: string = ""): number {
    let totalkms = 0;
    for (const mantenimiento of this.data) {
      totalkms = totalkms + mantenimiento[attr];
    }

    return totalkms;
  }

}
