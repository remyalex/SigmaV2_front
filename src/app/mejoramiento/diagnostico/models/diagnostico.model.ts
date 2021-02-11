import { DiagnosticoEncabezadoModel } from './diagnostico.encabezado.model';
import { DiagnosticoPriorizacionModel } from './diagnostico.priorizacion.model';
import { DiagnosticoFactorModel } from './diagnostico.factor.model';
import { DiagnosticoUnidadMuestraModel } from './diagnostico.unidadMuestreo.model';
import { DiagnosticoFallaModel } from './diagnostico.falla.model';
import { DiagnosticoFotoModel } from './diagnostico.foto.model';

export class DiagnosticoModel {
    public id: number;
    public encabezado: DiagnosticoEncabezadoModel;
    public priorizacion: DiagnosticoPriorizacionModel;
    public factores: DiagnosticoFactorModel[] = [];
    public fotos: DiagnosticoFotoModel[] = [];
    public muestreos: DiagnosticoUnidadMuestraModel[] = [];
    public fallas: DiagnosticoFallaModel[] = [];
    public activo: Boolean = true;
    public observacion: string;
}
