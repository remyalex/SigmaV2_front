import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { Localidad } from 'src/app/administracion/ubicaciones/localidad/models/localidad.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ChartCriteria } from 'src/app/shared/component/sigma-chart-tablero-control-sig/models/chart-criteria';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { filter } from 'rxjs/internal/operators/filter';
import { SigmaFormSelectComponent } from 'src/app/shared/component/sigma-form-select/sigma-form-select.component';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html'
})
export class FiltrosComponent implements OnInit, AfterViewInit {

  criteriaChart: ChartCriteria;
  localidadesExcluidas: string[] = [];
  localidadesAll: Localidad[] = [];
  clone: any;

  @ViewChild('selectLocalidades') selectLocalidades: SigmaFormSelectComponent;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialogRef: MatDialogRef<FiltrosComponent>,
    private _servicioGeneral: DataGenericService,
    @Inject(MAT_DIALOG_DATA) public data: ChartCriteria
  ) {
    this.criteriaChart = new ChartCriteria();
    this.clone = JSON.parse(JSON.stringify(this.data));
  }


  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.getLocalidadesAll();
  }

  aplicarFiltros() {
    this.dialogRef.close({filters: this.criteriaChart, value: 1});
  }

  cambioZona(event: any) {
    this.localidadesExcluidas = [];
    if (this.criteriaChart.zonas.length > 0) {
      const localidadesToShow: Localidad[] = [];
      for (const localidad of this.localidadesAll) {
        for (const zona of this.criteriaChart.zonas) {
          if (localidad.zona !== null && localidad.zona.id === zona.id) {
            if (!localidadesToShow.includes(localidad)) {
              localidadesToShow.push(localidad);
            }
          }
        }
      }
      for (const localidad of this.localidadesAll) {
        if (!localidadesToShow.includes(localidad)) {
          this.localidadesExcluidas.push(localidad.nombre);
        }
      }
    }
    this.getSelectOptions();
  }

  async getSelectOptions() {
    setTimeout(() => {
      this.selectLocalidades.getOptions();
    }, 50);
  }

  getLocalidadesAll() {
    this._servicioGeneral.cacheList('/api/administracion/ubicaciones/localidad');
    this._servicioGeneral.listQuery$
      .pipe(
        filter((data: any) => (data.path === '/api/administracion/ubicaciones/localidad'))
      )
      .subscribe((data: any) => {
        data.content.sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.localidadesAll = data.content;
        this.setData();
      });
  }

  setData() {
    setTimeout(() => {
      this.criteriaChart = this.data;
    }, 500);
  }

  ngAfterViewInit() {

  }

  atras() {
    const filters = new ChartCriteria();
    // tslint:disable-next-line: forin
    for (const item in this.clone) {
      filters[item] = this.clone[item];
    }
    this.dialogRef.close({filters: filters, value: 0});
  }

}
