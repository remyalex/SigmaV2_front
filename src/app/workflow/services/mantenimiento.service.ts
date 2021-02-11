import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { MantenimientoCriteria } from '../criterials/mantenimiento-criteria.model';
import { WorkflowMantenimientoModel } from '../models/workflow-mantenimiento.model';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {
  listCalendars(path: any) {
    throw new Error("Method not implemented.");
  }

  private resourceUrl: string;


  /**
  * Método encargado de construir una instancia
  */
  constructor(private http: HttpClient, private appSettings: AppSettings, private dataGeneric: DataGenericService) {
    this.resourceUrl = appSettings.settings.hostApi + '/api/mejoramiento/mantenimiento';
  }

  updateList(mantenimientos: WorkflowMantenimientoModel[]): Observable<CollectionResponse<WorkflowMantenimientoModel>> {
    return this.http.put<CollectionResponse<WorkflowMantenimientoModel>>(this.resourceUrl + '/list', mantenimientos, httpOptions);
  }

  /**
   * Método encargado de invocar la busqueda de mantenimientos que
   * correspondan con los criterios indicados como parámetros
   *
   * @param criteria Objeto con los campos y valores por los
   * cuales se realizará la búsqueda según el formulario de busqueda
   * del componente SigmaGrid.
   */
  search(criteria: MantenimientoCriteria): Observable<CollectionResponse<WorkflowMantenimientoModel>> {
    return this.http.get<CollectionResponse<WorkflowMantenimientoModel>>(this.resourceUrl + '/search?' + criteria.getUrlParameters());
  }

  searchProgram(criteria: MantenimientoCriteria): Observable<CollectionResponse<WorkflowMantenimientoModel>> {
    // tslint:disable-next-line: max-line-length
    return this.http.get<CollectionResponse<WorkflowMantenimientoModel>>(this.resourceUrl + '/search/programVisit?' + criteria.getUrlParameters());
  }

  detailByPk(pk: number): Observable<WorkflowMantenimientoModel> {
    console.log('*********************************PK='+pk);
    console.log('****       PK=' + pk + '********');
    console.log('*********************************PK='+pk);
    if( pk !== undefined) {
     return this.http.get<WorkflowMantenimientoModel>(this.resourceUrl + '/' + pk);
    }
  }

  allByPK(pk: number): Observable<Array<WorkflowMantenimientoModel>> {
    return this.http.get<Array<WorkflowMantenimientoModel>>(this.resourceUrl + '/allByPK/' + pk);
  }

  mantenimientoById(id: number): Observable<WorkflowMantenimientoModel> {
    return this.http.get<WorkflowMantenimientoModel>(this.resourceUrl + '/mantenimientoById/' + id);
  }

  exportar(): Observable<WorkflowMantenimientoModel> {
    return this.http.get<WorkflowMantenimientoModel>(this.resourceUrl + '/download/Listas-ListasItem.xlsx');
  }

  exportarPDF(mantenimiento_id: number, urlImagenMapa: string, reporte: string): Observable<any> {
    const path = this.resourceUrl + '/' + mantenimiento_id + '/' + reporte + '/' + urlImagenMapa + '/exportPDF';
    return this.http.get(path, {
      responseType: 'arraybuffer', observe: 'response'
    });
  }

  exportarPDFFormularioOrigen(mantenimiento_id: number, urlImagenMapa: string, reporte: string, formularioOrigen): Observable<any> {
    const path = this.resourceUrl + '/' + mantenimiento_id + '/' + reporte + '/' + urlImagenMapa + '/' + formularioOrigen + '/exportPDF';
    return this.http.get(path, {
      responseType: 'arraybuffer', observe: 'response'
    });
  }

  versionarPDF(mantenimiento_id: number, urlImagenMapa: string, reporte: string, nombreArchivo: string,
    listaTipoDoc: string, itemTipoDoc: string, listaEstadoDoc: string, itemEstadoDoc: string, formularioOrigen: string): Observable<any> {
    const path = this.resourceUrl + '/' + mantenimiento_id + '/' + reporte + '/' + nombreArchivo + '/' + urlImagenMapa + '/' +
      listaTipoDoc + '/' + itemTipoDoc + '/' + listaEstadoDoc + '/' + itemEstadoDoc + '/' + formularioOrigen + '/versionDocumento';
    return this.http.get(path, {
      responseType: 'arraybuffer', observe: 'response'
    });
  }

  versionarPDFTran(mantenimiento_id: number, urlImagenMapa: string, reporte: string, nombreArchivo: string, 
    itemTipoDoc: number, itemEstadoDoc : number, formularioOrigen: string): Observable<any> {
    const path = this.resourceUrl + '/' + mantenimiento_id + '/' + reporte + '/' + nombreArchivo + '/' + urlImagenMapa + '/' + 
    itemTipoDoc + '/' + itemEstadoDoc + '/' + formularioOrigen + '/versionDocumentoTran';
    return this.http.get(path, {
      responseType: 'arraybuffer', observe: 'response'
    });
  }

  generarPDF(mantenimiento_id: number, urlImagenMapa: string, reporte: string) {
    if (reporte == null || reporte === '') {
      reporte = 'reporteVisitaDiagnostico';
    }
    this.exportarPDF(mantenimiento_id, urlImagenMapa, reporte).subscribe(data => {
      const body = data;
      const type = body.headers.get('Content-Type');
      const a = document.createElement('a');
      document.body.appendChild(a);
      const blob = new Blob([body.body], { type: type });
      const url = window.URL.createObjectURL(blob);
      let nombreArchivo = '';
      a.href = url;
      switch (reporte) {
        case 'reporteVisitaDiagnostico':
          nombreArchivo = 'actaVisitaTecnica_';
          break;
        case 'reporteVisitaIntervencion':
          nombreArchivo = 'fichaVisitaIntervencion_';
          break;
        default:
          nombreArchivo = reporte + '_';
          break;
      }
      a.download = nombreArchivo + mantenimiento_id + '.pdf';
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 0);
    },
      error => {
        console.log('Error: ' + error);
      });

  }

  generarPDFConFormularioOrigen(mantenimiento_id: number, urlImagenMapa: string, reporte: string, formularioOrigen) {
    if (reporte == null || reporte === '') {
      reporte = 'reporteVisitaDiagnostico';
    }
    this.exportarPDFFormularioOrigen(mantenimiento_id, urlImagenMapa, reporte, formularioOrigen).subscribe(data => {
      const body = data;
      const type = body.headers.get('Content-Type');
      const a = document.createElement('a');
      document.body.appendChild(a);
      const blob = new Blob([body.body], { type: type });
      const url = window.URL.createObjectURL(blob);
      let nombreArchivo = '';
      a.href = url;
      switch (reporte) {
        case 'reporteVisitaDiagnostico':
          nombreArchivo = 'actaVisitaTecnica_';
          break;
        case 'reporteVisitaIntervencion':
          nombreArchivo = 'fichaVisitaIntervencion_';
          break;
        default:
          nombreArchivo = reporte + '_';
          break;
      }
      a.download = nombreArchivo + mantenimiento_id + '.pdf';
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 0);
    },
      error => {
        console.log('Error: ' + error);
      });

  }

  versionarDocumentoTran(mantenimiento_id: number, urlImagenMapa: string, reporte: string, nombreArchivo: string,
    itemTipoDoc: number, itemEstadoDoc : number, formularioOrigen: string) {
    if (reporte == null || reporte === '') {
    reporte = 'reporteVisitaDiagnostico';
    }
    this.versionarPDFTran(mantenimiento_id, urlImagenMapa, reporte, nombreArchivo, 
    itemTipoDoc, itemEstadoDoc, formularioOrigen).subscribe(data => {
    },
    error => {
      console.log('Error: ' + error);
    });

  }

generarHistoricoPDF(mantenimientoDocumento_id: number, nombreArchivo: string) {
    this.exportarHistoricoPDF(mantenimientoDocumento_id).subscribe(data => {
      const body = data;
      const keys = body.headers.keys();
      const type = body.headers.get('Content-Type');
      const a = document.createElement('a');
      document.body.appendChild(a);
      const blob = new Blob([body.body], { type: type });
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = nombreArchivo;
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 0);
    },
      error => {
        console.log('Error: ' + error);
      });

  }

  exportarHistoricoPDF(mantenimientoDocumento_id: number): Observable<any> {
    const path = this.resourceUrl + '/' + mantenimientoDocumento_id + '/exportHistoricoPDF';
    return this.http.get(path, {
      //      responseType: 'arraybuffer', observe: 'response', headers: {header: 'Content-Disposition' }
      responseType: 'arraybuffer', observe: 'response'
    });
  }
  
}
