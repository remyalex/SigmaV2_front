import { ListaItem } from '../../../administracion/listas-items/models/listas-items.model';
import { Lugar } from '../../../administracion/lugar/models/lugar.model';

export class Equipo {
    
    public id: number;
    public activo = true;
    public anioModelo: ListaItem;
    public area: ListaItem;
    public cantidadPasajeros: number;
    public cilindraje: number;
    public claseEquipo: ListaItem;
    public color: string;
    public disponibilidades: any;
    public estadoEquipo: ListaItem;
    public fechaDesde: string;
    public fechaHasta: string;
    public lugar: Lugar;
    public marcaEquipo: ListaItem;
    public movil: string;
    public numeroChasis: string;
    public numeroInterno: string;
    public numeroMotor: string;
    public origenEquipo: ListaItem;
    public picoYPlaca: any;
    public placa: string;
    public placaInventario: string;
    public plazoMantenimiento: number;
    public tipoCombustible: ListaItem;
    public equipoTipo: ListaItem;
    public toneladas: number;

    constructor() {

    }
}





