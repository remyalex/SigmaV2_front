import { Component, OnInit, Input } from '@angular/core';
import { CONST_WORKFLOW_DIAGNOSTICO } from 'src/app/workflow/forms/diagnostico/shared/diagnostico.constants';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { MantenimientoService } from 'src/app/workflow/services/mantenimiento.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-foto-diagnostico-pk',
  templateUrl: './foto-diagnostico-pk.component.html',
  styleUrls: ['./foto-diagnostico-pk.component.scss']
})
export class FotoDiagnosticoPkComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_DIAGNOSTICO;
  /**
  * Mantenimiento para el cual se realizará el procesamiento
  * de la información */
  mantenimiento: WorkflowMantenimientoModel;
  /** Columnas a presentar en la grilla de las fechos */
  columnasTablaFotos = ['consecutivoFoto', 'nombreFoto', 'fotos'];


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param router Componente usado para redireccionar entre componentes
  * @param mantenimientoService Componente de servicios usado para gestionar los mantenimientos
  */
  constructor(
    private route: ActivatedRoute,
    private mantenimientoService: MantenimientoService
  ) {

  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('pk')) {
        this.mantenimientoService.detailByPk(Number(params.get('pk'))).subscribe(data => {
          this.mantenimiento = data;
        }, error => {
        });
      }
    });
  }

}
