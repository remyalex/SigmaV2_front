import { Archivo } from 'src/app/workflow/models/archivo';
import { CierreAmbientalArchivoModel } from './cierre.ambiental.archivo.model';

export class CierreAmbientalModel {

    public id: number;
    public activo: boolean;
    public otroTipoIntervencion: string;
    public fechaCierre: string;
    public escombros: number;
    public destinoEscombros: any;
    public retiroProteccion: boolean;
    public retiroProteccionSelect: any;

    public libreResiduos: boolean;
    public libreResiduosSelect: any;
    public registroFotograficoLibreResiduos: Array<CierreAmbientalArchivoModel> = [];

    public sumideros: boolean;
    public sumiderosSelect: any;
    public registroFotograficoSumideros: Array<CierreAmbientalArchivoModel> = [];

    public senalizacion: boolean;
    public senalizacionSelect: any;
    public registroFotograficoSenalizacion: Array<CierreAmbientalArchivoModel> = [];

    public registroFotograficoVistaGeneral: Array<CierreAmbientalArchivoModel> = [];

    public transicionEjecutada: boolean = false;
    public mantenimiento: { id: number };    
}
