import { Archivo } from 'src/app/workflow/models/archivo.model';

export class ImportarExcelModel {
    public archivo: Archivo;
    public tipoImportacion: string;
    public data: any;
    public idAux: string;
}
