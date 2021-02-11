import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
import { Mail } from '../models/mail.model';
import { Observable } from 'rxjs';

@Injectable()
export class MailService {

    private resourceUrl: string;

    private httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        private _http: HttpClient,
        private _settings: AppSettings
    ) {
        this.resourceUrl = _settings.settings.hostApi + '/api/mail';
    }


    sendMailAsignacionMaquinaria(mail: Mail): Observable<boolean> {
        return this._http.post<boolean>(`${this.resourceUrl}/sendMailAsignacionMaquinaria`, mail, this.httpOptions);
    }
}
