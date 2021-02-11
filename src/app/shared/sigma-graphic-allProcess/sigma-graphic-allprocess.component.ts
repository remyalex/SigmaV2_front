import { OnInit, OnDestroy, Component, Inject } from '@angular/core';

import {
  VisEdges,
  VisNetworkData,
  VisNetworkOptions,
  VisNetworkService,
  VisNode,
  VisNodes
} from 'ngx-vis/components/network';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Proceso } from 'src/app/administracion/proceso/models/proceso.model';
import { WorkflowActividadModel } from 'src/app/workflow/models/workflow-actividad.model';
import { from } from 'rxjs';

class ExampleNetworkData implements VisNetworkData {
  public nodes: VisNodes;
  public edges: VisEdges;
}

/**
 * Componente usado para estandarizar el campo de graphic
 * de todos los procesos
 * en todos los formularios del sistema
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-graphic-allprocess',
  templateUrl: './sigma-graphic-allprocess.component.html',
  styleUrls: ['./sigma-graphic-allprocess.component.scss']
})
export class SigmaGraphicAllProcessComponent implements OnInit, OnDestroy {

  /** variable publica tipo String */
  public visNetwork = 'networkId1';
  /** objeto a usar en el componente */
  public visNetworkData: ExampleNetworkData;
  /** objeto a usar en el componente */
  public visNetworkOptions: VisNetworkOptions;
  /** Lista de tipo Proceso a usar en el componente */
  procesosArray: Array<Proceso>;
  allActividad: Array<any>;
  /** objeto que recibe data enviada al componente */
  proceso: Proceso;
  color: any;

  /**
   * Método encargado de construir una instancia de componente
   *
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param data Información a procesar
   * @param visNetworkService Servicio de eventos del gráfico para el componente
   */
  public constructor(
    private dialogRef: MatDialogRef<SigmaGraphicAllProcessComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private visNetworkService: VisNetworkService) {
    this.procesosArray = data.procesos;
    this.proceso = data.proceso;
  }

  /** Método encargado de inicializar las redes a usar en el componente */
  public networkInitialized(): void {
    // now we can use the service to register on events
    this.visNetworkService.on(this.visNetwork, 'click');

    // open your console/dev tools to see the click params
    this.visNetworkService.click
      .subscribe((eventData: any[]) => {
        if (eventData[0] === this.visNetwork) {
          console.log(eventData[1]);
        }
      });
  }

  /** Método encargado de inicializar el componente */
  public ngOnInit(): void {

    this.allActividad = [];
    const nodos = Array<any>();
    this.color = this.getRandomColor();
    this.procesosArray.forEach(proceso => {
      proceso.actividades.forEach(a => {
        this.allActividad.push(a);
      });
    });

    this.procesosArray.forEach(proceso => {
      if (this.excludeProceso(proceso)) {
        proceso.actividades.forEach(a => {
          let nodo = {};
          const act = a['nombre'].search(/inicio|final|fin/gi);
          if (act >= 0) {
            nodo = {
              id: a['id'],
              label: a['nombre'],
              title: a['descripcion'],
              shape: 'elipse',
              color: this.color,
              font: {
                color: 'white'
              }
            };
          } else {
            nodo = {
              id: a['id'],
              label: a['nombre'],
              title: a['descripcion'],
              font: {
                color: 'white'
              }
            };
          }
          nodos.push(nodo);
        });
      }
    });

    const transiciones = Array<any>();
    this.procesosArray.forEach(proceso => {
      if (this.excludeProceso(proceso)) {
        proceso.transiciones.forEach(t => {
          transiciones.push({ from: t['actividadInicial']['id'], to: t['actividadFinal']['id'] });
        });
      }
    });


    this.allActividad.forEach(a => {
      transiciones.forEach(transicion => {
        if (a['id'] === transicion['from'] || a['id'] === transicion['to']) {
          let nodo = {};
          const act = a['nombre'].search(/inicio|final|fin/gi);
          if (act >= 0) {
            nodo = {
              id: a['id'],
              label: a['nombre'],
              title: a['descripcion'],
              shape: 'elipse',
              color: this.color,
              font: {
                color: 'white'
              }
            };
          } else {
            nodo = {
              id: a['id'],
              label: a['nombre'],
              title: a['descripcion'],
              font: {
                color: 'white'
              }
            };
          }
          nodos.push(nodo);
        }
      });
    });


    const nodosNotRepeat = {};
    const nodosUnicos = nodos.filter(function (e) {
      return nodosNotRepeat[e.id] ? false : (nodosNotRepeat[e.id] = true);
    });

    const nodes = new VisNodes(nodosUnicos);

    const edges = new VisEdges(transiciones);

    this.visNetworkData = {
      nodes,
      edges,
    };

    this.visNetworkOptions = {
      edges: {
        arrows: 'to',
        color: 'red',
        font: '12px arial #ff0000',
        scaling: {
          label: true,
        },
        shadow: true,
        smooth: true,
      },
      nodes: {
        shape: 'box',
        widthConstraint: {
          minimum: 100,
          maximum: 100
        }
      },
      // layout: {
      //   randomSeed: undefined,
      //   improvedLayout: true,
      //   hierarchical: {
      //     enabled: true,
      //     levelSeparation: 150,
      //     nodeSpacing: 100,
      //     treeSpacing: 0,
      //     blockShifting: false,
      //     edgeMinimization: false,
      //     parentCentralization: true,
      //     direction: 'LR',        // UD, DU, LR, RL
      //     sortMethod: 'directed'   // hubsize, directed
      //   }
      // }
    };
  }

  excludeActividades(a: any): boolean {
    let response = true;
    const excluceArray = [22, 30, 65, 31, 87, 64, 57, 84, 55, 45, 47, 44, 46, 83, 32, 34];
    // tslint:disable-next-line: max-line-length
    if (excluceArray.includes(a['id'])) {
      response = false;
    }

    return response;
  }

  excludeProceso(proceso: any): boolean {
    let response = true;

    if (this.proceso && this.proceso.nombre === 'produccion') {
      const isProcesos = ['produccion'];
      // tslint:disable-next-line: max-line-length
      response = this.filterMultipleProcess(isProcesos, proceso);
    } else if (this.proceso && this.proceso.nombre === 'intervencion') {
      const isProcesos = ['intervencion'];
      // tslint:disable-next-line: max-line-length
      response = this.filterMultipleProcess(isProcesos, proceso);
    } else if (this.proceso && this.proceso.nombre === 'planificacion') {
      const isProcesos = ['planificacion'];
      // tslint:disable-next-line: max-line-length
      response = this.filterMultipleProcess(isProcesos, proceso);
    } else if (this.proceso && this.proceso.nombre === 'social') {
      const isProcesos = ['social'];
      // tslint:disable-next-line: max-line-length
      response = this.filterMultipleProcess(isProcesos, proceso);
    } else if (this.proceso && this.proceso.nombre === 'ambiental') {
      const isProcesos = ['ambiental'];
      // tslint:disable-next-line: max-line-length
      response = this.filterMultipleProcess(isProcesos, proceso);
    } else if (this.proceso && this.proceso.nombre === 'ambientalSST') {
      const isProcesos = ['ambientalSST'];
      // tslint:disable-next-line: max-line-length
      response = this.filterMultipleProcess(isProcesos, proceso);
    }

    return response;
  }

  filterMultipleProcess(isProcesos, proceso: any) {
    let response = true;
    // tslint:disable-next-line: max-line-length
    if (!isProcesos.includes(proceso['nombre'])) {
      response = false;
    }
    return response;
  }

  /** Método encargado de retornar valor de color random */
  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  public /** Método que se ejecuta una vez invocada la destrucción del componente */
  ngOnDestroy(): void {
    this.visNetworkService.off(this.visNetwork, 'click');
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close();
  }

}