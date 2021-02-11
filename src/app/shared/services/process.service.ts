import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
import { Proceso } from 'src/app/administracion/proceso/models/proceso.model';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
    providedIn: 'root'
})
export class ProcessService {
    private resoruceUrl: string;

    private idSubject = new BehaviorSubject({});
    public id$ = this.idSubject.asObservable();
    path_transicion: string;

    constructor(private http: HttpClient, private appSettings: AppSettings) {
        this.resoruceUrl = this.appSettings.settings.hostApi;
    }

    updateIdProcess(pk: any): void {
        this.idSubject.next(pk);
    }

    getTransicionByName(nombreProceso: string, nombreTransicion: string): Observable<any> { // pendiente
        const path = `${this.resoruceUrl}/api/administracion/procesotransicion/proceso/${nombreProceso}/nombre/${nombreTransicion}`;
        return this.http.get<Observable<any>>(path);
    }

    getProcesoTrancicionById(procesoTransicionId: number): Observable<any> { 
        return this.http.get<Proceso>(this.appSettings.settings.hostApi + `/api/administracion/procesotransicion/` + procesoTransicionId);
    }

    getLastTransicionObject(baseApi, nombreProceso, nombreTransicion) {
        const path = `${this.resoruceUrl}${baseApi}/procesos/${nombreProceso}/objeto/${nombreTransicion}`;
        return this.http.get<Observable<any>>(path);
    }

    getProceso(baseApi: string): Observable<any> {
        const path = `${this.resoruceUrl}${baseApi}/proceso`;
        return this.http.get<Observable<any>>(path);
    }

    detail (procesoId: number): Observable<Proceso> {
        return this.http.get<Proceso>(this.appSettings.settings.hostApi + `/api/administracion/proceso/` + procesoId);
    }

    getUsuariosByNameTransicion(baseApi: string, nombreProceso: string, nombreTransicion: string): Observable<any> {
        const path =
            `${this.resoruceUrl}${baseApi}/procesos/${nombreProceso}/transicion/${nombreTransicion}/usuarios`;
        return this.http.get<Observable<any>>(path);
    }

    getTransiciones(baseApi: string, objetoId: number, nombreProceso: string): Observable<any> {
        const path = `${this.resoruceUrl}${baseApi}/procesos/${nombreProceso}/transiciones/${objetoId}`;
        return this.http.get<Observable<any>>(path);
    }

    getSiguientesTransiciones(baseApi: string, nombreActividad: string, nombreProceso: string): Observable<any> {
        const path = `${this.resoruceUrl}${baseApi}/procesos/${nombreProceso}/transicionesByActividad/${nombreActividad}`;
        return this.http.get<Observable<any>>(path);
    }


    getActividades(baseApi: string, objetoId: number, nombreProceso: string): Observable<any> {
        const path = `${this.resoruceUrl}${baseApi}/procesos/${nombreProceso}/actividades/${objetoId}`;
        return this.http.get<Observable<any>>(path);
    }

    getActividadActual(baseApi: string, objetoId: number, nombreProceso: string): Observable<any> {
        const path = `${this.resoruceUrl}${baseApi}/procesos/${nombreProceso}/actividad/${objetoId}`;
        return this.http.get<Observable<any>>(path);
    }

    getUsuarios(baseApi: string, objetoId: number, nombreProceso: string, transicionId, siguientesUsuarios: Boolean): Observable<any> {
        let siguientesUsuariosLong = siguientesUsuarios == true ? 1 : 0;
        const path = `${this.resoruceUrl}${baseApi}/procesos/${nombreProceso}/objeto/${objetoId}/transicion/${transicionId}/usuarios/siguientes/${siguientesUsuariosLong}`
        return this.http.get<Observable<any>>(path);
    }

    getTransicionById(baseApi: string, id: number): Observable<any> {
        const path = `${this.resoruceUrl}${baseApi}/${id}`;
        return this.http.get<Observable<any>>(path);
    }

    getPermisoById(id: number): Observable<any> {
        const path = `${this.resoruceUrl}/api/administracion/permiso/${id}`;
        return this.http.get<Observable<any>>(path);
    }

    
    getEstadoById(estadoIdListItem: number): Observable<any> { 
        return this.http.get<Proceso>(this.appSettings.settings.hostApi + `/api/administracion/listaitem/` + estadoIdListItem);
    }


    ejecutarTransicion(baseApi: string, data: any): Observable<any> {
        const path = `${this.resoruceUrl}${baseApi}/procesos/transicion`;
        return this.http.post<Observable<any>>(path, data);
    }

    cambiarEstadoPkCapa(objetoId:any,capa:number): Observable<any> {
        return this.http.get<Observable<any>>(this.appSettings.settings.hostApi + `/api/mejoramiento/diagnostico/updateInfoMapaPKByTransicionObjeto/procesoTransicionObjetoId/` + objetoId + capa);
    }

    ejecutarTransicionMasivo(baseApi: string, data: any, dataForm: any): Observable<any> {

        const path = `${this.resoruceUrl}${baseApi}/procesos/transicion`;
        let respuestas = [];
        let errores = [];
        const unoPorUno = from(data);
        const masivoSubject = new BehaviorSubject({});
        const masivo$ = masivoSubject.asObservable();

        unoPorUno.subscribe((dataTransicion: any) => {
            const datos_enviar = { ...{ objeto: dataTransicion.id }, ...dataForm };
            this.http.post<Observable<any>>(path, datos_enviar)
                .subscribe(
                    (dataEnviada: any) => {
                        respuestas = [...respuestas, ...[dataEnviada]];
                        if ((respuestas.length + errores.length) == data.length) {
                            masivoSubject.next({ exitosos: respuestas.length, errores: errores.length });
                        }
                    },
                    error => {
                        errores = [...errores, ...[error]];
                        if ((respuestas.length + errores.length) == data.length) {
                            masivoSubject.next({ exitosos: respuestas.length, errores: errores.length });
                        }
                    }

                );
        });
        return masivo$;
    }
}
