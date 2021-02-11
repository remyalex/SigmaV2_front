import { VisitaPredisenoApiqueModel } from 'src/app/workflow/models/visita.prediseno.apique.model';
import { VisitaPredisenoAforoModel } from 'src/app/workflow/models/visita.prediseno.aforo.model';
import { SolicitudAforoModel } from 'src/app/workflow/models/solicitud-aforo.model';
import { SolicitudApiqueModel } from 'src/app/workflow/models/solicitud-apique.model';

export class Predisenio {

    public id: number;
    public requiereApique: String;
    public requiereAforo: String;
    public solicitudesAdicionales: Boolean;
    public esViableIntervencion: Boolean;
    public observacionSolicitud: String;
    public observacionIntervencion: String;
    public observacionGestion: String;
    public levantamientoTopografico: Boolean;
    public modulacionLosas: Boolean;
    public activo: Boolean;
    public apiques: Array<VisitaPredisenoApiqueModel>;
    public aforos: Array<VisitaPredisenoAforoModel>;
    public solicitudAforo: SolicitudAforoModel;
    public solicitudApique: SolicitudApiqueModel;

    constructor() {
        this.id = null;
        this.requiereApique = null;
        this.requiereAforo = null;
        this.solicitudesAdicionales = null;
        this.esViableIntervencion = null;
        this.observacionIntervencion = null;
        this.observacionGestion = null;
        this.levantamientoTopografico = null;
        this.modulacionLosas = null;
        this.activo = true;
        this.apiques = [];
    }
}