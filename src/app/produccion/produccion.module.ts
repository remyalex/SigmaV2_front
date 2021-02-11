import { EquipofallaModule } from './equipo-falla/equipo-falla.module';
import { InsumoExistenciaModule } from './insumo-existencia/insumoExistencia.module';
import { RegistrarValePlantaModule } from './registrar-vale-planta/registrarValePlanta.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PRODUCCION_ROUTES } from './produccion.routing';
import { SolicitudEnsayosModule } from './solicitud-ensayos/solicitud-ensayos.module';
import { FormulaMezclaLaboratorioModule } from './registrar-formulas-mezcla-laboratorio/registrar-formulas-mezcla-laboratorio.module';
import { CargueResultadosLaboratorioModule } from './cargue-resultados-laboratorio/cargue-resultados-laboratorio.module';
import { SharedModule } from '../shared/shared.module';
import { SigmaSendMailComponent } from '../shared/component/sigma-send-mail/sigma-send-mail.component';
// tslint:disable-next-line: max-line-length
import { AsignarMaquinariaDisponibleASolicitudesModule } from './asignar-maquinaria-disponible-a-solicitudes/asignar-maquinaria-disponible-a-solicitudes.module';
// tslint:disable-next-line: max-line-length
import { ImportarArchivoCombustibleModule } from './importar-archivo-combustible/importar-archivo-combustible.module';
import { EstadoMaquinariaPropioModule } from './estado-maquinaria-propio/estado-maquinaria-propio.module';
import { PlanillaOperacionModule } from './planilla-operacion/planilla-operacion.module';
import { TarjetaOperacionModule } from './tarjeta-operacion/tarjeta-operacion.module';
import { PersonalPlantaModule } from './personal-planta/personal-planta.module';
import { RegistroMezclaInsumosModule } from './registro-mezcla-insumos/registro-mezcla-insumos.module';
// tslint:disable-next-line: max-line-length
import { RegistrarMateriasPrimasFormulaComponent } from './registrar-insumos-de-formula-mezcla/registrar-materias-primas-formula/registrar-materias-primas-formula.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeguridadModule } from '../seguridad/seguridad.module';
import { MatDialogModule } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { RegistroControlCalidadAMezclaProducidaEnPlantaModule } from './registro-control-calidad-a-mezcla-producida-en-planta/registro-control-calidad-a-mezcla-producida-en-planta.module';
// tslint:disable-next-line: max-line-length
import { RegistrarInsumoFormulaMezclaEditComponent } from './registrar-insumos-de-formula-mezcla/registrar-insumos-de-formula-mezcla-edit/registrar-insumos-de-formula-mezcla-edit.component';
// tslint:disable-next-line: max-line-length
import { RegistrarInsumoFormulaMezclaDetailComponent } from './registrar-insumos-de-formula-mezcla/registrar-insumos-de-formula-mezcla-detail/registrar-insumos-de-formula-mezcla-detail.component';
import { MaquinariaModule } from './maquinaria/maquinaria.module';
import { MantenimientosProgramadosModule } from './mantenimientos-programados/mantenimientos-programados.module';
import { RegistrarInsumosFormulaMezclaModule } from './registrar-insumos-de-formula-mezcla/registrar-insumos-de-formula-mezcla.module';
import { ProduccionMezclaModule } from './produccion-mezcla/produccion-mezcla.module';
import { AsignarConductoresMaquinariaModule } from './asignar-conductores-maquinaria/asignar-conductores-maquinaria.module';
import { RegistroMezclaProducidaComponent } from './registro-mezcla-producida/registro-mezcla-producida.component';



	


@NgModule({
  declarations: [
    RegistrarMateriasPrimasFormulaComponent,
    RegistroMezclaProducidaComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    SeguridadModule,
    SharedModule,
    CommonModule,
    EquipofallaModule,
    MaquinariaModule,
    SolicitudEnsayosModule,
    RegistrarValePlantaModule,
    InsumoExistenciaModule,
    FormulaMezclaLaboratorioModule,
    CargueResultadosLaboratorioModule,
    AsignarMaquinariaDisponibleASolicitudesModule,
    ImportarArchivoCombustibleModule,
    RegistroControlCalidadAMezclaProducidaEnPlantaModule,
    EstadoMaquinariaPropioModule,
    PlanillaOperacionModule,
    TarjetaOperacionModule,
    PersonalPlantaModule,
    RegistroMezclaInsumosModule,
    AsignarConductoresMaquinariaModule,
    RegistrarInsumosFormulaMezclaModule,
    FormulaMezclaLaboratorioModule,
    MantenimientosProgramadosModule,
    ProduccionMezclaModule,
    RouterModule.forChild(PRODUCCION_ROUTES),
  ],
  entryComponents: [
    SigmaSendMailComponent,
    RegistrarMateriasPrimasFormulaComponent
  ],
  exports: [
    RegistrarMateriasPrimasFormulaComponent,
    RegistrarInsumoFormulaMezclaEditComponent,
    RegistrarInsumoFormulaMezclaDetailComponent,
  ]
})
export class ProduccionModule { }
