import { Archivo } from 'src/app/workflow/models/archivo.model';


export class Mail {
    public subject: string;
    public to: string [] = [];
    public body: string;
    public mantenimientosId: number[] = [];
    public attacheds: any;

    constructor() {}
}
