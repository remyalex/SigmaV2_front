import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({
    providedIn: 'root'
})
export class DashboardViewService {

    constructor(private genericService: DataGenericService) {
    }
    public getComponent(path: string) {
        return AppService.getComponent(path);
    }
}