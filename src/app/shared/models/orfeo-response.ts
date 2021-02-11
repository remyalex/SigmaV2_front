
export class OrfeoResponse{
    ///public content: T[];
    public radicacion: Radicacion;
    public asignacion: Asignacion;
    public remitente: Remitente;
    public archivo: Archivo;
}


export class Radicacion {
    public tipo: string;
    public fechaRadicacion: Date;
    public fechaVencimiento: Date;
    public numeroRadicado: string;
    public asunto: string;
    public dependenciaAsignada: string;
    public fechaGeneracionDocumento: Date;
    public resumen: string;
    public requiereRespuesta: boolean;
    public estado: string;
}

export class Asignacion {
    public nombresUsuarioAsignado: string;
    public apellidosUsuarioAsignado: string;
    public tipoDocumentoIdentidadAsignado: string;
    public numeroDocumentoIdentidadAsignado: string;
}

export class Remitente {
    public tipoPersonaRemitente: string;
    public nombresRemitente: string;
    public apellidosRemitente: string;
    public tipoDocumentoIdentidadRemitente: string;
    public numeroDocumentoIdentidadRemitente: string;
}

export class Archivo {
    public nombreArchivo: string;
    public urlDescarga: string;
    public tipoDocumento: string;
    public formato: string;
}

