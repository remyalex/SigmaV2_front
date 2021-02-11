import { Documento } from './documento.model';
import { DisenioCapas } from '../../disenio-informacion/models/disenio-capas.model';
import { DisenioInformacion } from '../../disenio-informacion/models/disenio-informacion.model';
import { DisenioInformacionComplementaria } from '../../disenio-informacion/models/disenio-informacion-complementaria.model';
import { DisenioParametro } from '../../disenio-informacion/models/disenio-parametro.model';
import { DisenioDocumento } from './disenio-documento.model';

export class Disenio {

    public id: number;
    public apiques: number;
    public aforos: number;
    public fechaCreacionDisenio: string;
    public activo = true;
    public consultaRedes: DisenioDocumento[] = [];
    public modulacionLosas: Documento;
    public leventamientoTopografico: Documento;
    public fichaEstructural: Documento;
    public informacionDiseino: Documento;
    public otrosDocumentos: DisenioDocumento[] = [];
    public capas: DisenioCapas[] = [];
    public disenioInformacion: DisenioInformacion;
    public disenioInformacionComplementaria: DisenioInformacionComplementaria;
    public disenioParametro: DisenioParametro;

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}