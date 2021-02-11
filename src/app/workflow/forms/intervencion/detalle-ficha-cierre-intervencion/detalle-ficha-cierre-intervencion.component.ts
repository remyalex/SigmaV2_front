import { Component, OnInit, Input } from '@angular/core';
import { DETALLE_CIERRE_INTERVENCION_CONSTANTS } from './detalle-cierre-intervencion.constants';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { ProfileService } from 'src/app/seguridad/services/profile.service';
import { MatTableDataSource } from '@angular/material';
import { Archivo } from 'src/app/workflow/models/archivo.model';
import { IntervencionFoto } from 'src/app/intervencion/models/intervencionFoto.model';

@Component({
  selector: 'detalle-ficha-cierre-intervencion',
  templateUrl: './detalle-ficha-cierre-intervencion.component.html',
  styleUrls: ['./detalle-ficha-cierre-intervencion.component.scss']
})
export class DetalleFichaCierreIntervencionComponent implements OnInit {

  @Input() mantenimiento: WorkflowMantenimientoModel;
  numeroHuecos = 0;
  numeroLosas = 0;
  tipoMaterial = '';
  cantidadMaterial = '';
  tipoIntervencion = '';
  perfil = '';
  /** Constantes a usar en el componente */
  constants = DETALLE_CIERRE_INTERVENCION_CONSTANTS;
  fotosDatasourceAntesActDiagSi: MatTableDataSource<Archivo> = new MatTableDataSource<Archivo>();
  fotosDatasourceAntesActDiagNo: MatTableDataSource<IntervencionFoto> = new MatTableDataSource<IntervencionFoto>();
  fotosDatasourceDespues: MatTableDataSource<Archivo> = new MatTableDataSource<Archivo>();
  // columns = ['numeroFoto', 'fechaRegistro', 'nombreFoto', 'fotos', 'acciones'];
  /** Listado de nombre de las columnas que se presentarán en la grilla  */
  columns = ['fotos'];

  constructor(private profileService: ProfileService) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    if (this.mantenimiento.intervenciones.length > 0) {
      if (this.mantenimiento.intervenciones[0].chequeos.length > 0) {
        this.fotosDatasourceAntesActDiagSi.data = this.mantenimiento.intervenciones[0].chequeos[0].fotos;
      }
    } else {
      this.fotosDatasourceAntesActDiagNo.data = this.mantenimiento.intervenciones[0].fotos;
    }
    this.fotosDatasourceDespues.data = [];
    this.initData();
  }

  initData() {
    // pendiente definir numeroLosas
    this.mantenimiento.diagnostico.muestreos.forEach(m => {
      this.numeroLosas = this.numeroLosas + m.numeroLosas;
      this.numeroHuecos = this.numeroLosas;
    });

    this.tipoMaterial = ' ';
    // pendiente confirmar información de cuadrillas}

    if (this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal !== null) {
      this.tipoIntervencion = this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal.descripcion;
    } else {
      // pendiente definir cuando son varias fallas
      this.tipoIntervencion = this.mantenimiento.diagnostico.fallas[0].tipoIntervencion.descripcion;
    }
  }
}
