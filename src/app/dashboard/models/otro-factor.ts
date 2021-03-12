export class OtroFactor {
  idOtroFactor: number;
  idTipoOtroFactor: number;
  auditoriaUsuario: string;
  auditoriaFecha: number;
  tabMantenimientoVial: number;

  constructor (tabMantenimientoVialIn) {
      this.tabMantenimientoVial = tabMantenimientoVialIn;
  }
}
