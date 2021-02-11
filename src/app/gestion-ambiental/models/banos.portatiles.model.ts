import { ArchivoModel } from 'src/app/administracion/formato/models/formato.model';

export class BanosPortatilesModel {
    public id: number;
    public activo: boolean;
    public transicionEjecutada: boolean;
    public fechaLlegada: String;
    public horaLlegada: String;
    public fechaRetiro: String;
    public horaRetiro: String;
    public direccion: String;
    public firma: ArchivoModel;
    public mantenimiento: { id: number };

}
