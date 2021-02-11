import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class DiagnosticoUnidadMuestraModel {

    public id: number;
    public consecutivo: number = 0;
    public activo = true;
    public ancho: number;
    public area: number;
    public abscisaInicial: number;
    public abscisaFinal: number;
    public numeroLosas: number;
    public pci: number;
    public registrosDependientes: boolean  = false;
}
