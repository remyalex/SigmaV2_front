import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { OrfeoResponse } from '../models/orfeo-response';

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
export class DataGenericService {

  public queryList = [];

  private listQuerySubject = new BehaviorSubject({});
  public listQuery$ = this.listQuerySubject.asObservable();

  private resoruceUrl: string;

  /**
  * Método encargado de construir una instancia
  */
  constructor(private http: HttpClient, private appSettings: AppSettings) {
    this.resoruceUrl = appSettings.settings.hostApi;
  }

  /**
   * Método encargado de invocar la busqueda de mantenimientos que
   * correspondan con los criterios indicados como parámetros
   *
   * @param criteria Objeto con los campos y valores por los
   * cuales se realizará la búsqueda según el formulario de busqueda
   * del componente SigmaGrid.
   */
  search(path, params): Observable<CollectionResponse<any>> {
    return this.http.get<CollectionResponse<any>>(this.resoruceUrl + path + params);
  }

  detailAny(path: string): Observable<any> {
    return this.http.get<any>(this.resoruceUrl + path, httpOptions);
  }

  detailOrfeo(path: string): Observable<OrfeoResponse> {
    return this.http.get<OrfeoResponse>(this.resoruceUrl + path, httpOptions);
  }

  remove(path) {
    for (let i = 0; i < this.queryList.length; i++) {
      const element = this.queryList[i];
      if (element.path == path) {
        this.queryList.splice(i, 1);
      }
    }
  }

  newQuery(path: any) {
    return this.queryList.filter((query: any) => (query.path == path));
  }
  list(path: any) {
    return this.http.get<any>(this.resoruceUrl + path);
  }

  buscarListaId(path: string, id: Number): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      if (typeof path !== 'undefined') {
        const exist: any = this.newQuery(path);
        if (exist.length > 0) {
          resolve(exist[0].content.filter((data: any) => (data.id == id))[0]);
        } else {
          this.http.get<any>(this.resoruceUrl + path)
            .subscribe((data: any) => {

              const newQuery = { path: path, content: data };
              resolve(newQuery.content.filter((list: any) => (list.id == id))[0]);
            });
        }
      }
    });
    return promise;
  }

  buscarLista(path: string): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      if (typeof path !== 'undefined') {
        const exist: any = this.newQuery(path);
        if (exist.length > 0) {
          resolve(exist[0].content);
        } else {
          this.http.get<any>(this.resoruceUrl + path)
            .subscribe((data: any) => {
              const newQuery = { path: path, content: data };
              resolve(newQuery.content);
            });
        }
      }
    });
    return promise;
  }

  buscarGeneralId(path: string, absoluta = false): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      if (typeof path !== 'undefined') {
        const exist: any = this.newQuery(path);
        if (exist.length > 0) {
          resolve(exist);
        } else {
          let pathNew = this.resoruceUrl + path;
          if (absoluta) {
            pathNew = path;
          }

          this.http.get<any>(pathNew)
            .subscribe((data: any) => {
              const newQuery = { path: path, content: data };
              resolve(newQuery.content);
            },
              error => {
                resolve(undefined);
              });
        }
      }
    });
    return promise;
  }

  cacheList(path: any) {
    if (path !== '') {
      if (typeof path !== 'undefined') {
        const exist = this.newQuery(path);
        if (exist.length > 0) {
          this.listQuerySubject.next(exist[0]);
        } else {
          this.http.get<any>(this.resoruceUrl + path)
            .subscribe((data: any) => {
              const newQuery = { path: path, content: data };
              this.queryList = [...this.queryList, ...[newQuery]];
              this.listQuerySubject.next(newQuery);
            }, error => {
              const newQuery = { path: path, content: [] };
              this.queryList = [...this.queryList, ...[newQuery]];
              this.listQuerySubject.next(newQuery);
            }
          );
        }
      }
    }
  }

  NoCacheList(path: any) {
    if (path !== '') {
      if (typeof path !== 'undefined') {
          this.http.get<any>(this.resoruceUrl + path)
            .subscribe((data: any) => {
              const newQuery = { path: path, content: data };
              // this.queryList = [...this.queryList, ...[newQuery]];
              this.listQuerySubject.next(newQuery);
            }, error => {
              const newQuery = { path: path, content: [] };
              // this.queryList = [...this.queryList, ...[newQuery]];
              this.listQuerySubject.next(newQuery);
            }
          );
      }
    }
  }

  clearCacheList() {
    this.queryList = [];
  }

  removeCacheListContain(pathName: string) {
    let basePathName = pathName;
    try {
      basePathName = basePathName.replace('/api/administracion/', '');
      const item = this.queryList.filter( q => {
        const pathItem = q.path as string;
        const item = pathItem.match(pathName);
        if(item !== null) {
          return item;
        }
        return null;
      });
      const itemx = item as any;
      if (item.length > 0) {
        const index = this.queryList.findIndex( q =>{
          if ( itemx[0].path === q.path) {
            return itemx;
          }
          return null;
        });
        if (index >= 0) {
          this.queryList.splice(index, 1);
        }
      }
    } catch (error) {
      console.log('No fue posible restaurar la lista en cache');
    }
  }

  listRecords(path: Number): Observable<any[]> {
    return this.http.get<any[]>(this.resoruceUrl + '/' + path, httpOptions);
  }
}
