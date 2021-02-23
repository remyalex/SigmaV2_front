import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { TokenStorageService } from '../services/token-storage.service';
import { AppSettings } from 'src/app/app.settings';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private urlApp: string;
    private urlApp2: string;

    constructor(private token: TokenStorageService,
        private appSettings: AppSettings) {

        this.urlApp = appSettings.settings.hostApi;
        this.urlApp2 = appSettings.settings.hostApi2;
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        let authReq = req;
        if (req.method === 'POST') {
          authReq = req.clone({
            headers:  req.headers.set('Access-Control-Allow-Origin', '*')
          });
        }
        const token = this.token.getToken();
        if (token != null) {
            //TODO: Include or merge/unify hostApi & hostApi2
            if (req.url.indexOf(this.urlApp) > -1 || req.url.indexOf(this.urlApp2) > -1) {
                authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
            }
            /*TODO:

            */
        }
        return next.handle(authReq);
    }
}

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
