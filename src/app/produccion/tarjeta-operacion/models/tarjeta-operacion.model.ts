import { ListaItem } from '../../../administracion/listas-items/models/listas-items.model';
import { Lugar } from '../../../administracion/lugar/models/lugar.model';

export class TarjetaOperacion {

    public numeroTarjeta: number;
    public quienDespacha: string;
    public direccionSalida: string;
    public horaSalida: string;
    public kilometrajeSalida: number;
    public tipoCarga: string;
    public cantidad: number;
    public direccionLlegada: string;
    public horaLlegada: string;
    public kilometrajeLlegada: number;
    public quienRecibe: string;
    public tipoPlanilla: any;



    constructor() {

    }
}

