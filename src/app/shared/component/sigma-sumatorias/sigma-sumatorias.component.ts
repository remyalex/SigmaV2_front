import { Component, OnInit, Input } from '@angular/core';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { BehaviorSubject } from 'rxjs';

/** Componente encargado de gestionar las sumatorias */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-sumatorias',
  templateUrl: './sigma-sumatorias.component.html'
})
export class SigmaSumatoriasComponent implements OnInit {

  /** Variables tratamiento de datos */
  public dataActividadesAgrupadas = {};
  /** variable publica encagada de realizar la 
   * sumatoria de kilometro carril impacto por Pk */
  public totalkms = 0;
  // public totalKmImpacto: any = '';
  // public totalAgrupacion: any = '';

  // Elementos a mostrar
  /** Variable usada para recibir valor booleano para mostrar la actividad agrupada */
  @Input() showActividadAgrupada = false;
  /** Variable usada para recibir valor booleano para mostrar el conteo de items */
  @Input() showCountItems = false;
  /** Variable usada para recibir valor booleano para mostrar la sumatoria de km Carril */
  @Input() showKmCarril = false;
  /** Variable usada para recibir valor booleano para mostrar la sumatoria de km Lineal */
  @Input() showKmLineal = false;
  /** Variable usada para recibir valor booleano para mostrar la sumatoria de km Obra*/
  @Input() showKmObra = false;
  /** Variable usada para recibir valor booleano para mostrar el total de dias de duración planeada*/
  @Input() showTotalDiasDuracionPlaneada = false;
  /** Variable usada para recibir valor booleano para mostrar el total de numero de cuadrilla */
  @Input() showTotalNoCuadrilla = false;

  /** Variable usada para recibir lista de Pks seleccionados en la invocación del componente */
  @Input() listaPksSelect: WorkflowMantenimientoModel[] = [];

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de inicializar el componente */
  ngOnInit() { }

  /** Método encargado de calcular la sumatoria de Km Carril
   * retornando valor numerico
  */
  calcularKmsCarril(): number {
    let totalkms = 0;
    for (const mantenimiento of this.listaPksSelect) {
      totalkms = totalkms + mantenimiento.kmCarrilImpacto;
    }
    return totalkms;
  }

  /** Método encargado de calcular la sumatoria de Kms
   * retornando valor numerico
   * @param attr objeto tipo String
  */
  calcularKms(attr: string = ""): number {
    let totalkms = 0;
    for (const mantenimiento of this.listaPksSelect) {
      totalkms = totalkms + mantenimiento[attr];
    }

    return totalkms;
  }

  /** Método encargado de calcular el total de días de duración planeada
   * retornando valor numerico
  */
  calcularCuadrilla(): number {
    let resultado = 0.0;
    let duracionPlaneada = 0.0;
    let nuemeroDias = 0.0;
    for (const mantenimiento of this.listaPksSelect) {
      if (mantenimiento.duracionPlaneada !== null && mantenimiento.duracionPlaneada !== undefined) {
        duracionPlaneada += mantenimiento.duracionPlaneada;
      }
      if (mantenimiento.numeroDiasLaborales !== null && mantenimiento.numeroDiasLaborales !== undefined) {
        nuemeroDias += mantenimiento.numeroDiasLaborales;
      }
    }

    if (nuemeroDias !== 0) {
      resultado = duracionPlaneada / nuemeroDias;
    }

    return Math.ceil(resultado);
  }

  /** Método encargado de calcular y retonar los Items agrupados
   * @param data objeto contiene lista de pks seleccionados
   */
  calcularItemsAgrupados(data): any {
    let totalAgrupacion: any;
    this.dataActividadesAgrupadas = {};
    if (typeof data !== 'undefined') {
      if (data.length > 0) {
        data.map((row) => {
          const kmCarrilItem = row.kmCarrilImpacto;
          if (row.actividadAgrupada !== null && kmCarrilItem > 0) {
            const sigla = row.actividadAgrupada;
            const kmCarril = parseFloat(kmCarrilItem.toString());
            let cantidadSiglas: number = kmCarril;
            if (typeof this.dataActividadesAgrupadas[sigla] !== 'undefined') {
              cantidadSiglas += this.dataActividadesAgrupadas[sigla];
            }
            cantidadSiglas = Number(cantidadSiglas.toFixed(3));
            this.dataActividadesAgrupadas[sigla] = cantidadSiglas;
          }
        }, error => { }
        );

        const actividadesOrdenadas = this.sortOnKeys(this.dataActividadesAgrupadas);
        totalAgrupacion = actividadesOrdenadas.reduce((accumulator, pk) => {
          return accumulator + pk;
        }, '');

      } else {
        this.dataActividadesAgrupadas = [];
        totalAgrupacion = '';
      }
    }
    return totalAgrupacion;
  }

  /** Método encargado de ordenar objetos enviados por parámetro
   * retornando objeto
   * @param dict objeto a ordenar
   */
  sortOnKeys(dict) {
    const sorted = [];
    // tslint:disable-next-line:forin
    for (const key in dict) {
      sorted[sorted.length] = key + ' : ' + dict[key] + '; ';
    }
    sorted.sort();
    return sorted;
  }
}
