import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export class SolicitudMezclaCriteria {

    fechaSolicitudDesde: string;
    fechaSolicitudHasta: string;
    fechaProgramacionDesde: string;
    fechaProgramacionHasta: string;
    tipoMaterial: ListaItem;
    jornada: ListaItem;

    constructor() {
        this.fechaSolicitudDesde = '';
        this.fechaSolicitudHasta = '';
        this.fechaProgramacionDesde = '';
        this.fechaProgramacionHasta = '';
        this.jornada = new ListaItem();
        this.tipoMaterial = new ListaItem();
    }

    getUrlParameters(): string {
        const jornadaId = this.jornada == null ? '' : this.jornada.id == null ? '' : this.jornada.id;
        const tipoMaterialId = this.tipoMaterial == null ? '' : this.tipoMaterial.id == null ? '' : this.tipoMaterial.id;
        return 'fechaSolicitudDesde=' + this.fechaSolicitudDesde + '&' +
            'fechaSolicitudHasta=' + this.fechaSolicitudHasta + '&' +
            'fechaProgramacionDesde=' + this.fechaProgramacionDesde + '&' +
            'fechaProgramacionHasta=' + this.fechaProgramacionHasta + '&' +
            'jornada=' + jornadaId + '&' +
            'tipoMaterial=' + tipoMaterialId;
    }

}