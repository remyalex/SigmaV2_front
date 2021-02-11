import { ListaItem } from '../../listas-items/models/listas-items.model';
import { Lugar } from '../../lugar/models/lugar.model';
import { EquipoMantenimiento } from 'src/app/produccion/equipo-mantenimiento/models/equipo-mantenimiento.models';

/** Clase que define las propiedades del elemento Equipo */
export class Equipo {

    /** Identificador único de registro en la base de datos */
    public id: number;
    /** Permite saber si el registro se encuentra activo en el sistema */
    public activo = true;
    /** Año/modelo del equipo */
    public anioModelo: ListaItem;
    /** Área a la que pertenece el equipo */
    public area: ListaItem;
    /** cantidad de pasajeros máxima para el equipo*/
    public cantidadPasajeros: number;
    /** Valor del cilindraje del equipo */
    public cilindraje: number;
    /** Case a la que pertenece el equipo */
    public claseEquipo: ListaItem;
    /** Color del equipo */
    public color: string;
    /** Disponibilidades del equipo */
    public disponibilidades: any;
    /** Estado de equipo */
    public estadoEquipo: ListaItem;
    /** Fecha desde la cual estará habilitado el equipo */
    public fechaDesde: string;
    /** Fecha hasta la cual estará habilitado el equipo */
    public fechaHasta: string;
    /** Objeto para procesamiento de la fecha desde del equipo */
    public fechaDesdeDate: any;
    /** Objeto para procesamiento de la fecha hasta del equipo */
    public fechaHastaDate: any;
    /** Fecha en la que se debería realizar el siguiente mantenimiento */
    public fechaSiguienteMantenimiento: string;
    /** Fecha en la que se realizó el último mantenimiento */
    public fechaUltimoMantenimiento: string;
    /** Objeto para procesamiento de la fecha del siguiente mantenimiento  */
    public fechaSiguienteMantenimientoDate: any;
    /** Objeto para procesamiento de la fecha del último mantenimiento  */
    public fechaUltimoMantenimientoDate: any;
    /** Hora final de la programación asignada al equipo */
    public horaFinProgramacion: string;
    /** Hora inicial de la programación asignada al equipo */
    public horaInicioProgramacion: string;
    /** Hora prevista para la realización del mantenimiento */
    public horasMantenimiento: number;
    /** Kilometraje en el cual se debe realizar el siguiente mantenimiento */
    public kilometrosMantenimiento: number;
    /** Línea a la que pertenece el equipo */
    public linea: string;
    /** Línea a la que pertenece la maquinaria */
    public lineaMaquinaria: ListaItem;
    /** Lugar en el cual se encuentra registrado el equipo*/
    public lugar: Lugar;
    /** Marca del equipo */
    public marcaEquipo: ListaItem;
    /** Número del movil cuando el equipo es un vehículo */
    public movil: string;
    /** Número del chasis del equipo */
    public numeroChasis: string;
    /** Número interno del equipo */
    public numeroInterno: string;
    /** Número serie del motor del equipo*/
    public numeroMotor: string;
    /** Orígen al que pertenece el Equipo */
    public origenEquipo: ListaItem;
    /** Indicador para saber si al equipo le aplica el pico y placa */
    public picoYPlaca: any;
    /** Número de placa del equipo */
    public placa: string;
    /** Número de placa relacionada con el inventario para el equipo */
    public placaInventario: string;
    /** Plazo en el cual se debe realizar el mantenimiento del equipo*/
    public plazoMantenimiento: number;
    /** Tipo de combustible que utiliza el equipo*/
    public tipoCombustible: ListaItem;
    /** Tipo al cual pertenece el equipo */
    public equipoTipo: ListaItem;
    /** Toneladas de carga del vehículo */
    public toneladas: number;

    public numeroContrato: string;

    public contratista: string;

    public esMaquinariaProduccion = false;

    /** Listado de mantenimientos realizados al equipo */
    public equipoMantenimientos: EquipoMantenimiento[];

    /**
    * Método encargado de construir una instancia de componente
    */
    constructor() { }
}





