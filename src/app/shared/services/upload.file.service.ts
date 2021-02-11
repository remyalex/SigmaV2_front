import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { AppSettings } from 'src/app/app.settings';
import { Archivo } from 'src/app/workflow/models/archivo.model';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' })
};

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptionsApp = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({
  providedIn: 'root'
})

export class UploadFileService {

  private resoruceUrl: string;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings
  ) {
    this.resoruceUrl = appSettings.settings.hostApi;
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.resoruceUrl + '/api/administracion/archivo/upload', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  uploadFileB64(file: string): Observable<Archivo> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Archivo>(this.resoruceUrl + '/api/administracion/archivo/uploadFoto', file, httpOptionsApp);
  }

  download(id: number): Observable<any> {
    return this.http.get(this.resoruceUrl + `/api/administracion/archivo/download/${id}`, {
      responseType: 'arraybuffer', observe: 'response'
    });
  }

  detail(id: number): Observable<any> {
    return this.http.get(this.resoruceUrl + `/api/administracion/archivo/${id}`);
  }

  getFile(file: number): Observable<any[]> {
    let download = this.download(file);
    let detail = this.detail(file);

    // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
    return forkJoin([download, detail]);
  }

}
