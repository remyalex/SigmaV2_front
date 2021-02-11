import { ListaChequeoSst } from './../../workflow/models/listaChequeoSst.model';
import { ListaChequeoAmbiental } from './../../workflow/models/listaChequeoAmbiental.model';
import { IntervencionFalla } from './intervencion-falla';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { ActaVolanteModel } from 'src/app/gestion-social/registrar-acta-vecindad-volante/models/acta-volante.model';
import { ActaAficheModel } from 'src/app/gestion-social/registrar-acta-vecindad-volante/models/acta-afiche.model';
import { UsuarioInfo } from 'src/app/workflow/models/usuario-info.model';
import { IntervencionFoto } from './intervencionFoto.model';
import { Usuario } from 'src/app/administracion/usuario/models/usuario.model';
import { IntervencionChequeoModel } from './intervencion-chequeo.model';
import { CuadrillaGeneralModel } from '../registro-diario-trabajo-cuadrilla/models/cuadrilla-general.model';
import { ProgramacionDiariaTrabajo } from 'src/app/workflow/forms/intervencion/registro-programacion-diaria-trabajo/programacion-diaria-trabajo.model';
import { SolicitudMezclaInsumos } from '../../produccion/registro-mezcla-insumos/models/registro-mezcla-insumos.model';


export class Intervencion {

    public id: number;
    public nroActa: string;
    public observaciones: string;
    public fechaVisita: string;
    public activo = true;
    public mantenimiento: any;
    public tipoEjecucion: ListaItem;
    public rutaTransporte: ListaItem;
    public usuario: Usuario;
    public tipoSuperficie: ListaItem;
    public actasVolante: Array<ActaVolanteModel> = new Array<ActaVolanteModel>();
    public actasAfiche: Array<ActaAficheModel> = new Array<ActaAficheModel>();
    public fotos: IntervencionFoto[];
    public responsable: UsuarioInfo ;
    public fallas: IntervencionFalla[] = [];
    public cuadrillas: CuadrillaGeneralModel[] = [];
    public chequeos: IntervencionChequeoModel[] = [];
    public listaChequeoAmbiental: ListaChequeoAmbiental[] = [];
    public requiereActualizacionDiag: boolean;
    public listaChequeoSst: ListaChequeoSst[] = [];
    public residenteSocial: Usuario;
    public turnoResidenteSocial: ListaItem;
    public estadoGestionSocial: ListaItem;
    public residenteAmbiental: Usuario;
    public turnoResidenteAmbiental: ListaItem;
    public estadoGestionAmbiental: ListaItem;
    public residenteSST: Usuario;
    public turnoResidenteSST: ListaItem;
    public estadoGestionSST: ListaItem;
    public programacionesDiarias: ProgramacionDiariaTrabajo[];
    public solicitudMezclaInsumos: SolicitudMezclaInsumos;
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
