import { CuadrillaObservacionArchivolModel } from './cuadrilla-observacion-archivo.model';

export class CuadrillaObservacionGeneralModel {

    id: number;
    observaciones: string;
    activo: boolean;
    obsArchivos: CuadrillaObservacionArchivolModel[];

    constructor() {
    }
}
