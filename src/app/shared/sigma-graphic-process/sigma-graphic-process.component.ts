import { OnInit, OnDestroy, Component, Inject } from '@angular/core';

import {
  VisEdges,
  VisNetworkData,
  VisNetworkOptions,
  VisNetworkService,
  VisNode,
  VisNodes
} from '../../../../node_modules/ngx-vis/components/network';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Proceso } from 'src/app/administracion/proceso/models/proceso.model';
import { WorkflowActividadModel } from 'src/app/workflow/models/workflow-actividad.model';

class ExampleNetworkData implements VisNetworkData {
  public nodes: VisNodes;
  public edges: VisEdges;
}

/**
 * Componente usado para estandarizar el campo de graphic
 * en todos los formularios del sistema
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-graphic-process',
  templateUrl: './sigma-graphic-process.component.html',
  styleUrls: ['./sigma-graphic-process.component.scss']
})
export class SigmaGraphicProcessComponent implements OnInit, OnDestroy {

  /** variable publica tipo String */
  public visNetwork = 'networkId1';
  /** objeto a usar en el componente */
  public visNetworkData: ExampleNetworkData;
  /** objeto a usar en el componente */
  public visNetworkOptions: VisNetworkOptions;
  /** objeto que recibe data enviada al componente */
  proceso: Proceso;
  /** variable que recibe valor de color random */
  color: any;

  /**
   * Método encargado de construir una instancia de componente
   *
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param data Información a procesar
   * @param visNetworkService Servicio de eventos del gráfico para el componente
   */
  public constructor(
    private dialogRef: MatDialogRef<SigmaGraphicProcessComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private visNetworkService: VisNetworkService) {
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

    const nodos = Array<any>();
    this.color = this.getRandomColor();
    this.proceso.actividades.forEach(a => {
      let nodo = {};
        // tslint:disable-next-line: triple-equals
        if (a['id'] == 1 || a['nombre'] == 'Fin') {
          nodo = { id: a['id'], label: a['nombre'], title: a['descripcion'], color: this.color, shape: 'ellipse', mass: 5 };
        } else {
          nodo = { id: a['id'], label: a['nombre'], title: a['descripcion'] };
        }
        nodos.push(nodo);
    });

    const nodes = new VisNodes(nodos);

    const transiciones = Array<any>();
    this.proceso.transiciones.forEach(t => {
      transiciones.push({ from: t['actividadInicial']['id'], to: t['actividadFinal']['id'] });
    });

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
        smooth: {
          enabled: true,
          type: 'discrete',
          forceDirection: true,
          roundness: 0
        }

      },
      nodes: {
        shape: 'box',
        widthConstraint: {
          minimum: 100,
          maximum: 100
        }
      },
      physics: {
        enabled: true,
        hierarchicalRepulsion: {
          centralGravity: 0.0,
          nodeDistance: 140,
          springLength: 100
        },
        solver: 'hierarchicalRepulsion'
      }
    };
  }

  excludeActividades(a: any): boolean {
    let response = true;
    const excluceArray = [22, 30, 65, 31, 87, 64, 57, 84, 55, 45, 47, 44, 46, 83, 32, 34, 52, 59, 48, 85];
    // tslint:disable-next-line: max-line-length
    if (excluceArray.includes(a['id'])) {
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
