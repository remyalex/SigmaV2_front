import { Archivo } from 'src/app/workflow/models/archivo';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { CierreAmbientalModel } from './cierre.ambiental.model';


export class CierreAmbientalArchivoModel {

    public id: number;
    public activo: boolean;
    public fechaRegistro: string;
    public archivo: Archivo;
    public tipoArchivo: ListaItem;
    public cierreAmbiental: { id: number };

}
