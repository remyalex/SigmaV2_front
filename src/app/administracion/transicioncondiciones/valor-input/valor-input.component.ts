import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ListasService } from '../../listas/services/listas.service';
import { ActividadService } from '../../proceso/actividad/services/actividad.service';
import { TipointervencionService } from '../../tipointervencion/services/tipointervencion.service';
import { BarrioService } from '../../ubicaciones/barrio/services/barrio.service';
import { LocalidadService } from '../../ubicaciones/localidad/services/localidad.service';
import { ZonaService } from '../../ubicaciones/zona/services/zona.service';
import { UpzService } from '../../ubicaciones/upz/services/upz.service';
import { CuadranteService } from '../../ubicaciones/cuadrante/services/cuadrante.service';

/**
 * Componente ecncargado de gestionar las acciones de
 * ingreso del valor en el campo del formulario
 **/
@Component({
  selector: 'app-valor-input',
  templateUrl: './valor-input.component.html'
})
export class ValorInputComponent implements OnInit {

  /** Tipo del dato a procesar */
  tipo: string;
  /** Listas a usar en el componente */
  listas;
  /** Listado de items a presentar en caso de listas */
  listasItem;
  /** Valor numerico del texto ingresado por el componente */
  valorNumber;
  /** Valor cadena del texto ingresado por el componente */
  valorString;
  /** Listado de actividad pendiente */
  listaActividad;
  /** Listado de tipos de intervención */
  listaTipoIntervencion;
  /** Listado de localidades */
  listaLocalidad;
  /** Listado de zonas */
  listaZona;
  /** Listado de upzs */
  listaUpz;
  /** Listado de Cuadrantes */
  listaCuadrante;
  /** Listado de barrios */
  listaBarrio;

  /** Valor procesado ingresado por el usuario y notificado a otro componente */
  @Output() valor = new EventEmitter();


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param listasService Apuntador para llamado a las acciones del servicio de listas
  * @param actividadServices Apuntador para llamado a las acciones Servicio actividades del sistema
  * @param tipointervencionService Servicio de tipos de intervención del sistema
  */
  constructor(
    private listasService: ListasService,
    private actividadServices: ActividadService,
    private tipointervencionService: TipointervencionService,
    private barrioService: BarrioService,
    private localidadService: LocalidadService,
    private zonaService: ZonaService,
    private upzService: UpzService,
    private cuadranteService: CuadranteService
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Metodo invocado al momento de realizar un cambio del valor en el input del formulario
  *
  * @param atributo Objeto de atributo con las propiedades modificadas
  */
  chooseInput(atributo: any) {
    if (atributo) {
      this.tipo = atributo.tipo;

      switch (atributo.tipo) {

        case 'LISTA_BARRIO':
          this.barrioService.list().subscribe(lista => {
            this.listaBarrio = lista.sort(function (a, b) {
              if (a.nombre > b.nombre) {
                return 1;
              }
              if (a.nombre < b.nombre) {
                return -1;
              }
              return 0;
            });
          });
          break;

        case 'LISTA_ZONA':
          this.zonaService.list().subscribe(lista => {
            this.listaZona = lista.sort(function (a, b) {
              if (a.nombre > b.nombre) {
                return 1;
              }
              if (a.nombre < b.nombre) {
                return -1;
              }
              return 0;
            });
          });
          break;

        case 'LISTA_LOCALIDAD':
          this.localidadService.list().subscribe(lista => {
              this.listaLocalidad = lista.sort(function (a, b) {
                if (a.nombre > b.nombre) {
                  return 1;
                }
                if (a.nombre < b.nombre) {
                  return -1;
                }
                return 0;
              });
          });
          break;

        case 'LISTA_UPZ':
          this.upzService.list().subscribe(lista => {
                this.listaUpz = lista.sort(function (a, b) {
                  if (a.nombre > b.nombre) {
                    return 1;
                  }
                  if (a.nombre < b.nombre) {
                    return -1;
                  }
                  return 0;
                });
          });
          break;

        case 'LISTA_CUADRANTE':
          this.cuadranteService.list().subscribe(lista => {
                  this.listaCuadrante = lista.sort(function (a, b) {
                    if (a.nombre > b.nombre) {
                      return 1;
                    }
                    if (a.nombre < b.nombre) {
                      return -1;
                    }
                    return 0;
                  });
          });
          break;

        case 'LISTA_ACTIVIDAD':
          this.actividadServices.list().subscribe(lista => {

            this.listaActividad = lista.sort(function (a, b) {
              if (a.descripcion > b.descripcion) {
                return 1;
              }
              if (a.descripcion < b.descripcion) {
                return -1;
              }
              return 0;
            });
          });
          break;

        case 'LISTA_TIPO_INTERVENCION':
          this.tipointervencionService.list().subscribe(lista => {

            lista.forEach(element => {
              element.descripcion += ' - ' + element.tipoSuperficie.descripcion;
            });
            this.listaTipoIntervencion = lista.sort(function (a, b) {
              if (a.descripcion > b.descripcion) {
                return 1;
              }
              if (a.descripcion < b.descripcion) {
                return -1;
              }
              return 0;
            });
          });
          break;

        default:
          this.listasService.list().subscribe(
            listas => {
              this.listas = listas.sort(function (a, b) {
                if (a.nombre > b.nombre) {
                  return 1;
                }
                if (a.nombre < b.nombre) {
                  return -1;
                }
                return 0;
              });
            });
          break;
      }

    }
  }

  /**
   * Método invocado al momento de realizar el cambio de la
   * selección de un valor de lista en el componente
   *
   * @param lista Lista en la cual se realizo la selección del valor por el usuario
   **/
  chargeListaItem(lista) {
    this.listasService.listByNombre(lista.nombre).subscribe(
      listaItem => {
        this.listasItem = listaItem.sort(function (a, b) {
          if (a.descripcion > b.descripcion) {
            return 1;
          }
          if (a.descripcion < b.descripcion) {
            return -1;
          }
          return 0;
        });
      });
  }

  /**
  * Método encargado de asignar al modelo el valor modificado en el formulario
  *
  * @param event evento con el valor seleccionado por el usuario
  **/
  setValor(event) {
    this.valor.emit(event);
  }

  /**
    * Método encargado de asignar al modelo el valor de fecha modificado en el formulario
    *
    * @param date fecha seleccionada por el usuario
    **/
  setDate(date) {
    if (date) {
      const dateString = date._i.date + '/0' + (date._i.month + 1) + '/' + date._i.year;
      this.setValor(dateString);
    }
  }

  /** Método encargado de limpiar los datos del formulario de consulta */
  clear() {
    this.valorNumber = '';
    this.valorString = '';
    this.listas = [];
    this.listasItem = [];
  }
}
