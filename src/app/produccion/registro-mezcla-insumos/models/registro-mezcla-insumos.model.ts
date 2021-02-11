export class SolicitudMezclaInsumos {
    public activo: boolean = true;
    public id: number;
    public pk: number;
    public civ: number;
    public cantidad: number;
    public personasContacto: string;
    public fechaRetiro: number;
    public horaRetiro: string
    public quienRecibe: string;
    public cantidadDespachada: number;
    public capacidadDespachar: number;
    public fechaReprogramacion: number;
    public turno: any;
    public tipoMaterial: any;
    public observaciones: string;
	  public SolicitudMezclaInsumosDetalles: SolicitudMezclaInsumosDetalles;
    public RegistrarVale: RegistrarVale;

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}

export class SolicitudMezclaInsumosDetalles {
    public activo: boolean = true;
    public numeroVale: number;
    public planta: string;
    public temperatura: number;
    public asentamiento: number;
    public movil: string;
    public horaEntrada: string;
    public horaLlegada: string;
    public horaSalida: string;
    public cantidad: number;
    public conductor: string;

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}


export class RegistrarVale {
    public activo: boolean = true;
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


export class EditarVale {
  public activo: boolean = true;
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
  public idPersona: any;
  public idFormula: any;

  /** Método encargado de crear uns instancia vacía del componente */
constructor() { }
}