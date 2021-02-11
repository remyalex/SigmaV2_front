export class PlanillaOperacionEdit {
    public id?: number;
    public numeroTarjeta?: number;
    public fechaOperacion?: number;
    public varibleControl?: string;
    public lecturaInicial?: string;
    public lecturaFinal?: string;
    public kmsInicial?: string;
    public kmsFinal?: string;
    public horaInicial?: any;
    public horaFinal?: any;
    public activo?: boolean;
    public eliminado?: number;
    public equipoConductor?: any;
    public actividades?: Actividades [];
    public tipoTarjeta?: TipoTarjeta;
    public placa?: string;
    public numeroInterno?: number;
    public estadoMaquinaria?: any;
    public tipoVehiculoId?: any;
    public estadoMaquinariaId: number;
    public totalHoras: string = '';

    constructor() {}
}

export class TipoTarjeta {
    public id?: number;
    public valor?: string;
    public descripcion?: string;
    public activo?: boolean;
    public registrosDependientes?: boolean;

    constructor() { }
}

export class PlanillaOperacion {
    public id?: number;
    public numeroTarjeta?: number;
    public fechaOperacion?: number;
    public varibleControl?: string;
    public lecturaInicial?: string;
    public lecturaFinal?: string;
    public kmsInicial?: string;
    public kmsFinal?: string;
    public horaInicial?: any;
    public horaFinal?: any;
    public activo?: boolean;
    public eliminado?: number;
    public equipoConductor?: any;
    public actividades?: Actividades [];
    public tipoTarjeta?: TipoTarjeta;
    public placa?: string;
    public numeroInterno?: number;
    public estadoMaquinaria?: any;
    public tipoVehiculoId?: any;
    public estadoMaquinariaId: number;
    public totalHoras: string = '';

    constructor() {}
}

export class Actividades {

    public nombreItem?: string;
    public descripcion?: string;
    public calificacion?: string;
    public variableControl?: string;
    public lecturaInicial?: string;
    public lecturaFinal?: string;
    public activo?: boolean = true;
    public eliminado?: 18000000;
    public observacion?: string

    constructor() { }
}












