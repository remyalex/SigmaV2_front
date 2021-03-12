import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { TokenStorageService } from "src/app/seguridad/services/token-storage.service";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { AppSettings } from "src/app/app.settings";
import { Observable } from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'events'
};
@Injectable({
    providedIn: 'root'
})
export class DashboardViewService {
  mvsUrl: string;

    constructor(private http: HttpClient, private appSettings: AppSettings, private tokenStorage: TokenStorageService) {
      this.mvsUrl = appSettings.settings.hostApi2 + '/api/mantenimientovial/insertar';
    }
    public getComponent(path: string) {
        return AppService.getComponent(path);
    }
    public getUser() {
        return this.tokenStorage.getUsuario();
    }
    public postMV(userInfo: string): Observable<any> {
      return this.http.post<any>(this.mvsUrl, userInfo, httpOptions);
    }
}
