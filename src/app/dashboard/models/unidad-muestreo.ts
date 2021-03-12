import { Falla } from "./falla";

export class UnidadMuestreo {
  idUnidadMuestreo: number;
  indiceUnidad: number;
  tabMantenimientoVial: number;
  abscisaInicial: number;
  abscisaFinal: number;
  area: number;
  ancho: number;
  pci: number;
  tabFallas: Falla[];

  constructor (index, idSolicitudSeleccionada) {
    this.indiceUnidad = index;
    this.tabMantenimientoVial = idSolicitudSeleccionada;
    this.tabFallas = new Array<Falla>();
  }
}
