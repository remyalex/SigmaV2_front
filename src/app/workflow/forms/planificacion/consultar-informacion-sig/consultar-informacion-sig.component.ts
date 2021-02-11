import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { BaseComponent } from 'src/app/workflow/extends/base-component';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { WorkflowService } from 'src/app/workflow/services/workflow-service.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar } from '@angular/material';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { DefaultSortGrid } from 'src/app/shared/models/defaultSortGrid';
import { KeyValuePair } from 'src/app/shared/models/key-value-pair.model';
import { MapService } from 'src/app/shared/services/map.service';
import { GESTIONAR_CONSULTAR_INFORMACION_SIG_CONSTANTS } from './consultar-informacion-sig.constants';
import { GridAccion } from 'src/app/shared/component/grid-mantenimientos/model/grid-accion.model';
import { environment } from 'src/environments/environment';
import { CAPAS } from '../../../../shared/visor-mapa/visor-mapa-capas';
import { WorkflowCondicionModel } from 'src/app/workflow/models/workflow-condicion.model';

/** Componente encargado de gestionar el proceso de consulta de información del sig*/
@Component({
  selector: 'app-consultar-informacion-sig',
  templateUrl: './consultar-informacion-sig.component.html'
})
export class ConsultarInformacionSIGComponent extends BaseComponent implements OnInit, OnDestroy {

  /** Variable que contiene el archivo a procesar */
  @ViewChild('inputFile') inputFile: ElementRef;
 /** Constantes a usar en el componente */
  constants = GESTIONAR_CONSULTAR_INFORMACION_SIG_CONSTANTS;
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = [
    'select',
    'pk',
    'civ',
    'estadoPk',
    'ejeVial',
    'desde',
    'hasta',
    'ancho',
    'area',
    'longitud',
    'tipoMalla',
    'tipoSeccionVial',
    'tipoSuperficie'
  ];
  /** Variable usada para notificar al componente de grilla sobre los
   * filtros que se usarán en este componente */
  filters = [
    'localidad',
    'barrio',
    'zona',
    'cuadrante',
    'pk',
    'estadoPk'
  ];

  /** Listado de acciones masivas permitidas en el formulario */
  accionesMasivas: GridAccion[] = [
    {
     nombre: 'guardarDetalle',
     label: 'Guardar Detalle',
     icono: 'get_app',
     color: 'primary'
     }
 ];

  /** Ordenamiento que de forma predeterminada realiza el
   * sistema de los registros de la grilla */
  defaultSortGrid: DefaultSortGrid = {
    sortBy: 'pk', sortOrder: 'DESC'
  };

  /** Variable usada para agrupar los resultados obtenidos
   * en varias consultas y presentar solo un listado */
  resultIntersectSelect: any;
  /** Bandera de control para saber si existe información
   * igual al realizar el cruce la las consultas */
  existeCruceInfo = true;
  /** Tipos de archivos permitidos en el componente */
  accept = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv';
  defaulFilters: KeyValuePair[] = [];
  
  /** Variable de condicion por la cual se realizará la busquedas de pks en la grilla */
  condicion: WorkflowCondicionModel;


  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param utilitiesServices Componente de utilidades de peticiones a servicios
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param excelService Servicio usado en el componente para peticiones de archivos de Excel
   * @param commonService Componente usado para invocar los servicios de mantenimiento
   * @param workflowService Componente usado para invocar los servicios de workflow
   * @param tokenStorageService Componente usado para obtener información del token del usuario
   * @param mapService Componente usado para gestionar información del mapa
   * @param formBuilder Componente usado para gestionar los elementos del formulario
   */
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
    super(
      servicio, commonService, formBuilder, workflowService, excelService,
      utilitiesServices, snackBar, tokenStorageService, mapService
    );

    this.mapService.activarCruceSigEntidades = true;
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.defaulFilters.push({key: 'permisoId', value: '1'});

    this.commonService.getCondicionByNombre('PK_PARA_CONSULTAR_INFORMACIÓN_ENTIDADES').subscribe(_condicion => {
      this.condicion = _condicion;
    });

    this.mapService.interseccionGeografica$.subscribe(resultIntersect => {
      if (resultIntersect) {
        if (resultIntersect['length'] && resultIntersect['length'] > 200) {
          this.snackBar.open('La cantidad de PK\'s a buscar es superior a 200', 'X', {
            duration: 8000, panelClass: ['error-snackbar']
          });
        } else if (JSON.stringify(resultIntersect) === '{}') {
          this.existeCruceInfo = false;
          //console.log(' {} ', this.existeCruceInfo);
          this.accionesMasivas = [];
        } else {
          this.accionesMasivas = [{
            nombre: 'guardarDetalle', label: 'Guardar Detalle', icono: 'get_app', color: 'primary' }];

          this.resultIntersectSelect = resultIntersect;
          this.existeCruceInfo = true;

        }
      }
    });


    this.excelService.jsonDataExcel$.subscribe(async dataJson => {
        if (dataJson !== null) {
            const pkExcelArray: string[] = [];
            const claves = Object.getOwnPropertyNames(dataJson);
            dataJson[claves[0]].map(pk => {
              pkExcelArray.push(pk[0]);
            });
            if ( pkExcelArray.length <= 200 ) {
                console.log(pkExcelArray);
                let _mantenimientosList: any;
                const myGrid = this.grids.toArray()[0];
                _mantenimientosList = await pkExcelArray.map(async pk => {
                  const mantenimientosModel = await this.commonService.getMantenimientoPorPK(pk).forEach(result => {
                    myGrid.addToMantenimientosSelected(result);
                  });

                  return mantenimientosModel;
                });
            } else {
              this.snackBar.open('La cantidad de PK\'s a a buscar es superior a 200', 'X', {
                duration: 8000, panelClass: ['error-snackbar']
              });
            }
        }
    });

    this.mapService.cantidadMaxPks$.subscribe(data => {
      if (data) {
        this.mensajeCantidadPk();
      }
    });

    if (typeof this.data.actividad !== 'undefined') {
      this.transicionesMasivas = this.data.actividad.transiciones.filter(t => t.esMasiva);
      this.transicionesIndividuales = this.data.actividad.transiciones.filter(t => !t.esMasiva);
      this.transicionesMasivas = [true];
      // this.columns = this.columns.filter(item => item !== 'select');
      if (this.transicionesMasivas.length > 0) {
        this.columns.unshift('select');
      }
    }


    this.mapService.getVisor().seleccionMasiva = true;
    this.mapService.getVisor().definirEscalasVisualizacion(40000);

   }

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar( event) {
      switch (event.accion) {
        case 'guardarDetalle':
          if (this.existeCruceInfo) {
            this.exportReport();
          } else {
            this.snackBar.open('No hay cruze de información geográfica', 'X', {
              duration: 8000, panelClass: ['warning-snackbar']
            });
          }
        break;
      }
  }


  /**
   * Método encarga de gestionar la exportación de los datos
   * presentados en la grilla mediante un archivo
   */
  exportReport() {
    const pkConCrucesExport = this.mapService.pkConCruces.filter((elment, index) => this.mapService.pkConCruces.indexOf(elment) === index);

    const pkInicCruceExport =
      this.mapService.pkInicialesCruces.filter((elment, index) => this.mapService.pkInicialesCruces.indexOf(elment) === index);

    const pkSinCruceExport = pkInicCruceExport.filter(f => !pkConCrucesExport.includes(f));

    const pkSinCruce: any = [];
    let countPkSinCruce = 0;
    pkSinCruceExport.map(pk => {
      pkSinCruce[countPkSinCruce] = {};
      pkSinCruce[countPkSinCruce]['pk'] = pk;
      countPkSinCruce++;
    });

    this.resultIntersectSelect['pk_sin_cruce'] = [];

    this.resultIntersectSelect['pk_sin_cruce']['attributes'] = pkSinCruce;
    this.resultIntersectSelect['pk_sin_cruce']['order'] = {pk: 'pk'};
    this.resultIntersectSelect['pk_sin_cruce']['headers'] = ['pk'];

    const nombrehojas = [];
    const orderExport = [];
    const headersExportJson = [];
    const capasExternas = CAPAS.capas_externas;
    capasExternas.forEach(capa => {
        if (this.resultIntersectSelect[capa.nombre].attributes) {
            this.resultIntersectSelect[capa.nombre].attributes =
                this.removeElementEntidadesDuplicates(this.resultIntersectSelect[capa.nombre].attributes);
        }
    });
    // tslint:disable-next-line: forin
    for (const clave in this.resultIntersectSelect) {
      nombrehojas.push(clave);
      orderExport.push(this.resultIntersectSelect[clave]['order']);
      headersExportJson.push(this.resultIntersectSelect[clave]['headers']);
    }

    this.excelService.exportAsExcelFileHojas(this.resultIntersectSelect,
      nombrehojas, 'Entidades_SIG', true, headersExportJson, orderExport);

  }

  /** Método encargado de actualizar los pk seleccionados
   * y retornar un json */
  async uploadSelectPk(event) {
    const myGrid = this.grids.toArray()[0];
    myGrid.clear();
    this.excelService.excelToJson(event);
  }

  /** Método encargado de devolver el valor del archivo adjunto */
  getValue() {
    return this.constants.adjuntarFile;
  }

  /** Método encargado de seleccionar el archivo adjunto y generar la descarga */
  selectFile() {
    this.inputFile.nativeElement.click();
  }

  mensajeCantidadPk() {
    this.snackBar.open('La cantidad de PK\'s a a buscar es superior a 200', 'X', {
      duration: 8000, panelClass: ['error-snackbar']
    });
  }

  /** Método encargado eliminar duplicados entidades */
  removeElementEntidadesDuplicates(attributesResultIntersect) {
    const uniqueArray = attributesResultIntersect.filter((dataResult, index) => {
      return index === attributesResultIntersect.findIndex(obj => {
          return JSON.stringify(obj) === JSON.stringify(dataResult);
      });
    });
    return uniqueArray;

  }

  ngOnDestroy(): void {
    this.mapService.limpiarCantidadMaxPks();
    this.mapService.activarCruceSigEntidades = false;
    super.ngOnDestroy();
  }

}
