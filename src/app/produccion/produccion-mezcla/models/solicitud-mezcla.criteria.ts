import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
export class SolicitudMezclaCriteria {

    tipoMaterial: ListaItem;
    turno: ListaItem;
    fechaSolicitudDesde = '';
    fechaSolicitudHasta = '';
    actvidadId = 81;
    size = 10;
    page = 0;
    sortOrder = 'asc';
    sortBy = 'id';

    constructor(
        private utilitiesService: UtilitiesService
      ) {}

    public getUrlParameters() {
        const tipoMaterialId = this.tipoMaterial ? this.tipoMaterial.id : '';
        const turnoId = this.turno ? this.turno.id : '';
        if (this.fechaSolicitudDesde) {
            if (!this.fechaSolicitudHasta) {
                this.fechaSolicitudHasta = '01-01-2080';
            }
        } else if (this.fechaSolicitudHasta) {
            if (!this.fechaSolicitudDesde) {
                this.fechaSolicitudDesde = '01-01-1970';
            }
        }
        const fechaSolicitudDesde = this.fechaSolicitudDesde ? this.fechaSolicitudDesde : '';
        const fechaSolicitudHasta = this.fechaSolicitudHasta ? this.utilitiesService.getFechaMasUnDia(this.fechaSolicitudHasta) : '';
        const actvidadId = this.actvidadId;

        return 'tipoMaterialId=' + tipoMaterialId +
        '&turnoId=' + turnoId +
        '&fechaSolicitudDesde=' + fechaSolicitudDesde +
        '&fechaSolicitudHasta=' + fechaSolicitudHasta +
        '&actvidadId=' + actvidadId +
        '&page=' + this.page +
        '&size=' + this.size +
        '&sortBy=' + this.sortBy +
        '&sortOrder=' + this.sortOrder;

    }
}
