import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { ProgCalendarioEquipoService } from '../services/progcalendarioequipo.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { ProgramacionDiariaTrabajo } from 'src/app/workflow/forms/intervencion/registro-programacion-diaria-trabajo/programacion-diaria-trabajo.model';
import { ProgramacionDiariaTrabajoMaquinaria } from 'src/app/workflow/forms/intervencion/registro-programacion-diaria-trabajo/programacion-diaria-trabajo-maquinaria.model';
import { EquipodisponibilidadService } from 'src/app/administracion/equipodisponibilidad/services/equipodisponibilidad.service';
import { ConfirmacionComponent } from '../confirmacion/confirmacion.component';
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-asignar-maquinaria-admin',
  templateUrl: './asignar-maquinaria-admin.component.html'
})
export class AsignarMaquinariaAdminComponent implements OnInit {

  @Input() programacionDiaria: ProgramacionDiariaTrabajo;
  @Output() cancel = new EventEmitter();

  dataSource: MatTableDataSource<ProgramacionDiariaTrabajoMaquinaria> = new MatTableDataSource<ProgramacionDiariaTrabajoMaquinaria>([]);

  @ViewChild(MatPaginator) set matPaginator(paginadorResidentes: MatPaginator) {
    this.dataSource.paginator = paginadorResidentes;
  }
  @ViewChild(MatSort) set matSort(sortResidentes: MatSort) {
    this.dataSource.sort = sortResidentes;
  }

  columns = ['numero', 'tipo', 'clasificacion', 'fechaInicial', 'fechaEntrega', 'jornada', 'Observacion', 'asignacion'];

  urlEquipodisponibilidad = '/api/administracion/equipo/equipoDisponible';
  observacion: string;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private utilitiesServices: UtilitiesService,
    private snackBar: MatSnackBar,
    private progCalendarioEquipoService: ProgCalendarioEquipoService,
    private dialog: MatDialog,
    private disponibilidadService: EquipodisponibilidadService

  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    for (const maquinaria of this.programacionDiaria.maquinaria) {
      maquinaria.programacionDiariaTrabajo = this.programacionDiaria;
      if (maquinaria.equipoCalendarios.length > 0) {
        // Trae el equipo asignado a partir de su disponibilidad
        this.disponibilidadService.detail(maquinaria.equipoCalendarios[0].disponibilidad.id).subscribe(disponibilidad => {
          maquinaria.equipo = disponibilidad.equipo;
          maquinaria.equipoAnterior = disponibilidad.equipo;
        });
      }
    }
    this.dataSource.data = this.programacionDiaria.maquinaria;
  }

  asignar() {
    const equiposId = {};
    const equiposSeleccionadosId = [];
    const programacionesCancelar = [];
    let apruebaSeleccion = true;
    for (const maquinaria of this.programacionDiaria.maquinaria) {
      // Valida que tenga una maquinaria asignada sin tener una previamente asignada
      if (maquinaria.equipo && maquinaria.equipoAnterior === undefined ) {
        equiposId[maquinaria.id] = maquinaria.equipo.id;
        if (equiposSeleccionadosId.includes(maquinaria.equipo.id)) {
          this.showMessageAlert('Equipo ' + maquinaria.equipo.numeroInterno + ' seleccionado mas de una vez', 'error-snackbar');
          apruebaSeleccion = false;
        } else {
          equiposSeleccionadosId.push(maquinaria.equipo.id);
        }
        // si tenia asignada una maquinaria y la cambio, se debe cancelar la maquinaria anterior
      } else if (maquinaria.equipo && maquinaria.equipoAnterior && maquinaria.equipo.id !== maquinaria.equipoAnterior.id) {
        equiposId[maquinaria.id] = maquinaria.equipo.id;
        if (equiposSeleccionadosId.includes(maquinaria.equipo.id)) {
          this.showMessageAlert('Equipo ' + maquinaria.equipo.numeroInterno + ' seleccionado mas de una vez', 'error-snackbar');
          apruebaSeleccion = false;
        } else {
          equiposSeleccionadosId.push(maquinaria.equipo.id);
          programacionesCancelar.push(maquinaria.id);
        }
        // en caso de tener una maquinaria previamente asignada pero desea dejarla sin asignacion
      }  else if (maquinaria.equipo === undefined && maquinaria.equipoCalendarios.length > 0) {
        programacionesCancelar.push(maquinaria.id);
      }
    }

    if (apruebaSeleccion) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'custom-modalbox';
      dialogConfig.width = '30%';
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      const dialogRef = this.dialog.open(ConfirmacionComponent, dialogConfig);
  
      dialogRef.beforeClosed().subscribe(
        response => {
          if (response.accion === 1) {
            this.observacion = response.observacion;
            // si aprueba la validacion para poder asignar, primero se ejecutan las cancelaciones de
            // las maquinarias que se hayan cambiado en caso de haberlas
            if (programacionesCancelar.length > 0) {
              this.progCalendarioEquipoService.cancelarProgramacionEquipos(
                programacionesCancelar, 'modificación en la asignación. Observacion: ' + this.observacion).subscribe(res => {
                this.confirmarAsignacion(equiposId);
              }, error => {
                this.utilitiesServices.formErrorMessages(error, null, this.snackBar);
              });
            } else {
              this.confirmarAsignacion(equiposId);
            }
          }
        }
      );
    }
  }

  confirmarAsignacion(equiposId: any) {
    const inicio = this.programacionDiaria.fechaProgramacion;
    let fin = this.utilitiesServices.convertStringToDate(inicio);
    fin = this.utilitiesServices.addDays(fin, 1);
    this.progCalendarioEquipoService.asignarEquiposAProgramacionDiaria(
      equiposId,
      inicio,
      this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(fin),
      this.observacion,
      this.programacionDiaria.id
        ).subscribe(responseAsignacion => {
          this.showMessageAlert('La asignación se realizo de manera exitosa', 'success-snackbar');
          this.cancel.emit();
      }, error => {
        this.utilitiesServices.formErrorMessages(error, null, this.snackBar);
      });
  }

  irAGridMantenimientos() {
    this.cancel.emit();
  }

  getUrlParaSelectTipoMaquinaria(maquinaria: ProgramacionDiariaTrabajoMaquinaria) {
    let fin = this.utilitiesServices.convertStringToDate(maquinaria.programacionDiariaTrabajo.fechaProgramacion);
    fin = this.utilitiesServices.addDays(fin, 1);
    return this.urlEquipodisponibilidad + '/' + maquinaria.tipoMaquinaria.id + '/'
      + maquinaria.programacionDiariaTrabajo.jornada.id + '/' 
      + maquinaria.programacionDiariaTrabajo.fechaProgramacion + '/' + this.utilitiesServices.getFechaFormatServer_dd_mm_yyyy(fin);
  }


  showMessageAlert(message: string, clase: string) {
    this.snackBar.open(message , 'X', {
      duration: 10000,
      panelClass: [clase]
    });
  }


}
