import { equipoConductorModule } from './equipoconductor/equipoconductor.module';
import { OrfeoModule } from './orfeo/orfeo.module';
import { FormatoModule } from './formato/formato.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ADMINISTRACION_ROUTES, AdministracionRouting} from './administracion.routing';
import { ListasModule } from './listas/listas.module';
import { MenuModule } from './menu/menu.module';
import { RolModule } from './rol/rol.module';
import { EquipoModule } from './equipo/equipo.module';
import { UsuarioModule } from './usuario/usuario.module';
import { InsumoModule } from './insumo/insumo.module';
import { TipocargueModule } from './tipocargue/tipocargue.module';
import { LugarModule } from './lugar/lugar.module';
import { TipocargueestructuraModule } from './tipocargueestructura/tipocargueestructura.module';
import { TipomantenimientoModule } from './tipomantenimiento/tipomantenimiento.module';

import { PersonaModule } from './persona/persona.module';
import { PersonanovedadModule } from './personanovedad/personanovedad.module';
import { ProcesoModule } from './proceso/proceso.module';
import { FormatoseccionModule } from './formato/formatoseccion/formatoseccion.module';
import { FormatoseccioncampoModule } from './formato/formatoseccion/formatoseccioncampo/formatoseccioncampo.module';
import { WidgetModule } from './widget/widget.module';
import { EventoModule } from './evento/evento.module';
import { AuditoriaModule } from './auditoria/auditoria.module';
import { MensajeModule } from './mensaje/mensaje.module';
import { ListasItemsModule } from './listas-items/listas-items.module';
import { GrupoModule } from './grupo/grupo.module';
import { PlanillaoperacionesModule } from './planillaoperaciones/planillaoperaciones.module';

import { RecursoModule } from './recurso/recurso.module';
import { TipofallaModule } from './tipofalla/tipofalla.module';
import { GestionarprocesosModule } from './gestionarprocesos/gestionarprocesos.module';
import { TransicioncondicionesModule } from './transicioncondiciones/transicioncondiciones.module';
import { GestionarDocumentoModule } from './gestionarDocumento/gestionarDocumento.module';
import { MiGestionModule } from './migestion/migestion.module';
import { UsuarioActividadesModule } from './usuario-actividades/usuario-actividades.module';
import { EstadisticausuarioModule } from './estadisticausuario/estadisticausuario.module';
import { TipointervencionModule } from './tipointervencion/tipointervencion.module';
import { ZonaModule } from './ubicaciones/zona/zona.module';
import { LocalidadModule } from './ubicaciones/localidad/localidad.module';
import { BarrioModule } from './ubicaciones/barrio/barrio.module';
import { UpzModule } from './ubicaciones/upz/upz.module';
import { UplaModule } from './ubicaciones/upla/upla.module';
import { CuadranteModule } from './ubicaciones/cuadrante/cuadrante.module';


@NgModule({
  exports: [
  ],
  imports: [
    CommonModule,
    AdministracionRouting,
    RouterModule.forChild(ADMINISTRACION_ROUTES),
    ListasModule,
    MenuModule,
    InsumoModule,
    UsuarioModule,
    LugarModule,
    RolModule,
    EquipoModule,
    TipocargueModule,
    TipocargueestructuraModule,
    TipointervencionModule,
    FormatoModule,
    TipomantenimientoModule,
    TipofallaModule,
    PersonaModule,
    PersonanovedadModule,
    ProcesoModule,
    PlanillaoperacionesModule,
    FormatoseccionModule,
    FormatoseccioncampoModule,
    WidgetModule,
    EventoModule,
    AuditoriaModule,
    MensajeModule,
    ListasItemsModule,
    OrfeoModule,
    RecursoModule,
    GrupoModule,
    GestionarprocesosModule,
    TransicioncondicionesModule,
    MiGestionModule,
    UsuarioActividadesModule,
    EstadisticausuarioModule,
    equipoConductorModule,
    GestionarDocumentoModule,
    ZonaModule,
    LocalidadModule,
    BarrioModule,
    UpzModule,
    UplaModule,
    CuadranteModule
  ],
  declarations: []
})
export class AdministracionModule { }
