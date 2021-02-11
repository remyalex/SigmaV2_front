import { AppSettings } from 'src/app/app.settings';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  @Injectable({
    providedIn: 'root'
  })
export class ProgCalendarioEquipoService {

    private resourceUrl: string;
    private resourceInforme: string;

    constructor(
        private http: HttpClient,
        private appSettings: AppSettings,
        private dataGeneric: DataGenericService,
      ) {
        this.resourceUrl = appSettings.settings.hostApi + '/api/intervencion/progcalendarioequipo';
        this.resourceInforme = appSettings.settings.hostApi + '/api/mejoramiento/mantenimiento';
      }

      // tslint:disable-next-line: max-line-length
      asignarEquiposAProgramacionDiaria(progCalendariosEquiId_equiposId: any, inicio: string, fin: string, observacion: string, programacionDiariaId: number): Observable<boolean> {
        // tslint:disable-next-line: max-line-length
        return this.http.post<boolean>(`${this.resourceUrl}/asignarEquiposAProgramacionDiaria/${inicio}/${fin}/${observacion}/${programacionDiariaId}`, progCalendariosEquiId_equiposId, httpOptions );
      }

      cancelarProgramacionEquipos(programacionesId: number[], motivo: string): Observable<boolean> {
        return this.http.post<boolean>(`${this.resourceUrl}/cancelarProgramacionEquipos/` + motivo, programacionesId, httpOptions );
      }


}
