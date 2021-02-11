export class AsignarConductoresMaquinaria {
    public activo = true;


    public id: number;
    public pk: number;
    public civ: number;
    public cantidad: number;
    public personasContacto: string;
    public fechaRetiro: number;
    public horaRetiro: string;
    public quienRecibe: string;
    public cantidadDespachada: number;
    public capacidadDespachar: number;
    public fechaReprogramacion: number;
    public turno: any;
    public tipoMaterial: any;
    public observaciones: string;
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}

export class AsignarConductoresMaquinariaDetalles {
    public activo = true;


    public numeroVale: number;
    public planta: string;
    public temperatura: number;
    public asentamiento: number;
    public numeroMovil: number;
    public horaEntrada: string;
    public horaLlegada: string;
    public horaSalida: string;
    public cantidad: number;
    public conductor: string;

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}


export class RegistrarVale {
    public activo = true;


    public numeroVale: number;
    public planta: any;
    public temperatura: number;
    public asentamiento: string;
    public numeroMovil: number;
    public horaEntrada: string;
    public horaLlegada: string;
    public horaSalida: string;
    public cantidad: string;
    public conductor: any;
    public formula: any;
    public jefeBascula: any;
    public tipoVale: any;
    public persona: any;


    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}