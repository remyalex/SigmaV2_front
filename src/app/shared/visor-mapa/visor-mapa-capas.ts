export class VisorMapa {
  servicios: Servicios;
  accesos: Accesos;
  basemap: string;
}

export class Servicios {
  mantenimientos: string;
  webMapIdPrincipal: string;
  webMapIdAlternativo: string;
  localidad: string;
  barrio: string;
  cuadrantes: string;
  zonas: string;
  upla: string;
  ideca: string;
  idu_reservas: string;
  idu_seguimiento_intervencion: string;
  idu_seguimiento_disenio: string;
  idu_licenciaExcavacionPredios: string;
  idu_LicenciaExcavacionTramos: string;
  idu_LicenciaExcavacionPG: string;
  idu_PolizasContratosTramos: string;
  idu_PolizasUrbanizadoresTramos: string;
  idu_PolizasContratosArea: string;
  pmt_infraestructura_comite: string;
  pmt_infraestructura_tramo: string;
  pmt_servicios_publicos_tramo: string;
  pmt_obras_servicios_publicos_punto: string;
  pmt_obras_infraestructura_parques: string;
  pmt_evento: string;
  pmt_desvio: string;
  sitp_implementacion: string;
  sitp_rutas_habiles_zonales: string;
  sitp_rutas_zonales_provisional: string;
  ruteo: string;
}

export class Accesos {
  webMapDispPKsId: string;
  webMapUMV: string;
}

export class CapaExterna {
  nombre: string;
  propietario: string;
  descripcion: string;
  url: string;
}

export class CapasAmbientalesExternas {
  censoArbolado: CapaAmbientalExterna;
  espacioPublicoIDUPlaza: CapaAmbientalExterna;
  espacioPublicoIDUPompeyano: CapaAmbientalExterna;
  censoSumiderosAlcantarillado: CapaAmbientalExterna;
  censoSumiderosPluvial: CapaAmbientalExterna;
  censoPublicoIDU: CapaAmbientalExterna;
}

export class CapaAmbientalExterna {
  nombre: string;
  propietario: string;
  descripcion: string;
  campoIdentificador: string;
  url: string;
}

export class Capas {
  visor_mapa: VisorMapa;
  capas_externas: CapaExterna[];
  capas_ambientales_externas: CapasAmbientalesExternas;
}

export let CAPAS: Capas;

export class CapasHandler {
  setCapas(capas: Capas) {
    CAPAS = capas;
    return CAPAS;
  }
}



