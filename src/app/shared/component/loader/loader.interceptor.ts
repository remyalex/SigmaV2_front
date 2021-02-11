import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LoaderService } from './loader.service';


@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    
    public GET = 'GET';

    constructor(
        public loaderService: LoaderService
    ) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        
        if(req.method != this.GET){
            this.loaderService.show();
        }
        
        return next.handle(req).pipe(
            finalize(() => this.loaderService.hide())
        );
    }
}