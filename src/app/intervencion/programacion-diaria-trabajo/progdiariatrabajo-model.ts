import { IntervencionEncabezado } from '../visitatecnicaverificacion/visita-verificacion-admin/models/intervencionEncabezado.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { Equipocalendario } from 'src/app/administracion/equipodisponibilidad/models/equipocalendario.model';
import { Personacalendario } from 'src/app/administracion/personacalendario/models/personacalendario.model';
import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';

export class ProgDiariaTrabajoTotalMaterial {
    tipoMaterial: ListaItem;
    claseMaterial: ListaItem;
    cantidad: number;
}

export class ProgDiariaTrabajoConsolidado {
    programacion: ProgDiariaTrabajo;
    values: string[] = [];
}

export class ProgDiariaTrabajoConsolidadoColumn {
    name: string;
    label: string;
}

/**
 * Representa los criterios de búsqueda para el consolidado
 */
export class ProgDiariaTrabajoCriteriosBusqueda {
    criterio: ListaItem;
    fechaProgramacion: string;
    jornada: ListaItem;
    zona: ListaItem;
    localidad: ListaItem;
    barrio: ListaItem;
    pk: string;
    civ: string;
    directorObra: ListaItem;
    ingenieroResidente: ListaItem;
    ingenieroApoyo: ListaItem;
    estrategia: ListaItem;
    tipoIntervencion: ListaItem;
    actividad: ListaItem;
    tipoMaquinaria: ListaItem;
    origenMezcla: ListaItem;
    tipoMaterial: ListaItem;
    claseMaterial: ListaItem;
    inspector: ListaItem;
}

/**
 * Representa los criterios de búsqueda a manera de Criteria
 */
export class ProgDiariaTrabajoCriteriosBusquedaCriteria {
    public criterio: string = '';
    public fechaProgramacion: string = '';
    public jornada: string = '';
    public zona: string = '';
    public localidad: string = '';
    public barrio: string = '';
    public pk: string = '';
    public civ: string = '';
    public directorObra: string = '';
    public ingenieroResidente: string = '';
    public ingenieroApoyo: string = '';
    public estrategia: string = '';
    public tipoIntervencion: string = '';
    public actividad: string = '';
    public tipoMaquinaria: string = '';
    public origenMezcla: string = '';
    public tipoMaterial: string = '';
    public claseMaterial: string = '';
    public inspector: string = '';

    public page: number = 0;
    public size: number = 10;
    public sortBy: string = 'fechaProgramacion';
    public sortOrder: string = 'asc';

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

    /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {
        return (
            'fechaProgramacion=' + this.fechaProgramacion +
            '&jornada=' + this.jornada +
            '&localidad=' + this.localidad +
            '&zona=' + this.zona +
            '&barrio=' + this.barrio +
            '&pk=' + this.pk +
            '&civ=' + this.civ +
            '&directorObra=' + this.directorObra +
            '&ingenieroResidente=' + this.ingenieroResidente +
            '&ingenieroApoyo=' + this.ingenieroApoyo +
            '&estrategia=' + this.estrategia +
            '&tipoIntervencion=' + this.tipoIntervencion +
            '&actividad=' + this.actividad +
            '&tipoMaquinaria=' + this.tipoMaquinaria +
            '&origenMezcla=' + this.origenMezcla +
            '&tipoMaterial=' + this.tipoMaterial +
            '&claseMaterial=' + this.claseMaterial +
            '&inspector=' + this.inspector +
            '&page=' + this.page +
            '&size=' + this.size +
            '&sortBy=' + this.sortBy +
            '&sortOrder=' + this.sortOrder
        );
    }
}


/**
 * Representación de la programación diaria de trabajo
 */
export class ProgDiariaTrabajo {

    /* CAMPOS PERSISTENTES */
    id: number;
    activo: boolean;
    fechaCreacion: string;
    jornada: ListaItem;
    fechaProgramacion: string;
    intervencion: IntervencionEncabezado;
    inspector1: ListaItem;
    inspector2: ListaItem;
    inspector3: ListaItem;
    observaciones: string;

    /* COLECCIONES PERSISTENTES */
    personal: ProgDiariaTrabajoPersonal[] = [];
    maquinaria: ProgDiariaTrabajoMaquinaria[] = [];
    material: ProgDiariaTrabajoMaterial[] = [];
    equipo: ProgDiariaTrabajoEquipo[] = [];

    /* VARIABLES EXCLUSIVAS PARA LA VISTA */
    estrategia: string;
    localidad: string;
    barrio: string;
    ejeVial: string;
    ejeVialDesde: string;
    ejeVialHasta: string;
    actividad: string;
    civ: string;
    pk: string;
    tipoIntervencion: string;
    residenteObra: string;
    residenteObraTelefono: string;
    directorObra: string;
    directorObraTelefono: string;
    estadoProgramacionDiaria: string;

}

/**
 * Representación del personal asociado a la programación diaria de trabajo
 */
export class ProgDiariaTrabajoPersonal {
    id: number;
    activo: boolean;
    progDiariaTrabajo: ProgDiariaTrabajo;
    PersonaCalendario: Personacalendario;
    personal: ListaItem;
    tipoCuadrilla: ListaItem;
    cantidadPersonalInspector = 0;
}

/**
 * Representación de la maquinaria asociada a la programación diaria de trabajo
 */
export class ProgDiariaTrabajoMaquinaria {
    id: number;
    activo: boolean;
    progDiariaTrabajo: ProgDiariaTrabajo;
    equipoCalendarios: Equipocalendario[];
    tipoMaquinaria: ListaItem;
    hora: string;
    idMaquinaria: string;

    equipo: Equipo; // Atributo usado unicamente en el front
}

/**
 * Representación del material asociado a la programación diaria de trabajo
 */
export class ProgDiariaTrabajoMaterial {
    id: number;
    activo: boolean;
    progDiariaTrabajo: ProgDiariaTrabajo;

    origenMezcla: ListaItem;
    tipoMaterial: ListaItem;
    claseMaterial: ListaItem;
    cantidad: number;
    hora: string;
}

/**
 * Representación del equipo asociado a la programación diaria de trabajo
 */
export class ProgDiariaTrabajoEquipo {
    id: number;
    activo: boolean;
    progDiariaTrabajo: ProgDiariaTrabajo;
    equipo: ListaItem;
    cantidad: number;
    hora: string;
}
