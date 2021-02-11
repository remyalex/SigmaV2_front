import { Rol } from 'src/app/administracion/rol/models/rol.model';

export class Eventorol {
    public activo: boolean = true;
    public evento: string;
    public eventoValor: string;
    public fechaDesde: string;
    public fechaDesdeDate: string;
    public fechaHasta: string;
    public fechaHastaDate: string;
    public id: number;
    public rol: Rol;
    public rolValor: string;
    public valorPermitido = {
        'id': null,
        'valor': null
    };
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
