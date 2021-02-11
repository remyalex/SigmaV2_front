import { CONST_SHARED } from 'src/app/shared/constantes-shared';

/** 
*  Constantes con valores de URL´s relacionadas con el componente 
*/
export const PATHS = {
    // path_complemento: '',
};

/**
 * Hommologación de las constantes de permisos usados por el componente 
 * con los asignados en la base de datos
 */
export const PERMISOS = {
    // permiso_intervencion_complemento: '',
};

/**
 * Declaración de constantes de etiquetas propias usadas en el componente
 */
export const CONST_CONSOLIDADO_PROGRAMACION_DIARIA_TRABAJO = {

    criterioUrl: "/api/administracion/lista/CRITERIOS_CONS_PROG_DIARIA_TRABAJO/items",
    jornadasUrl: "/api/administracion/lista/TAB_CONSOLIDADO_DIARIO_OBRA_ID_TIPO_JORNADA/items",
    zonaUrl: "/api/administracion/lista/ZONA/items",
    localidadUrl: "/api/administracion/lista/LOCALIDAD/items",
    barrioUrl: "/api/administracion/lista/BARRIO/items",
    directorObraUrl: "",
    ingenieroResidenteUrl: "",
    ingenieroApoyoUrl: "",
    estrategiaUrl: "",
    tipoIntervencionUrl: "",
    actividadUrl: "",
    tipoMaquinariaUrl: "/api/administracion/lista/TIPO_MAQUINARIA/items",
    origenMezclaUrl: "/api/administracion/lista/PRODUCCION_ORIGEN_MEZCLA/items",
    tipoMaterialUrl: "/api/administracion/lista/TIPO_MATERIAL/items",
    claseMaterialUrl: "/api/administracion/lista/CLASE_MATERIAL/items",
    inspectoresUrl: "/api/administracion/lista/INSPECTOR/items",
    tipoCuadrillaUrl: "/api/administracion/lista/TIPO_CUADRILLA/items",
    tipoPersonalUrl: "/api/administracion/lista/TIPO_PERSONAL/items",
    equipoUrl: "/api/administracion/lista/ADMINISTRACION_EQUIPO_TIPO_EQUIPO/items",
    deseaEnviarProduccion: "¿Está seguro de enviar la información a producción ?",
    msjTipoMaterialIgual: "La información a enviar a producción debe ser de un solo tipo de material",
    msjJornadaIgual: "La información a enviar a producción debe ser de una sola jornada",
    msjFechaIgual: "La información a enviar a producción debe ser de una sola fecha",
    msjInfoYaEnviada: "Información ya ha sido enviada",

    labels: {
        title: "Consolidado de trabajo diario",

        criterio: "Criterio",
        fechaProgramacion: "Fecha de programación diaria",
        jornada: "Jornada",
        zona: "Zona",
        localidad: "Localidad",
        barrio: "Barrio",
        pk: "PK",
        civ: "CIV",
        directorObra: "Director(a) de obra",
        ingenieroResidente: "Ingeniero(a) residente",
        ingenieroApoyo: "Ingeniero(a) de apoyo",
        estrategia: "Estrategia de intervernción",
        tipoIntervencion: "Tipo de intervención",
        actividad: "Actividad",
        tipoMaquinaria: "Tipo de maquinaria",
        origenMezcla: "Origen de la mezcla",
        tipoMaterial: "Tipo de material",
        claseMaterial: "Clase de material",
        inspector: "Inspector",

        consultarButton: "Consultar",
        cancelarButton: "Cancelar",
    },

    ...CONST_SHARED,
    ...PATHS,
    ...PERMISOS,
};