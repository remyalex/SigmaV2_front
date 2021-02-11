import { Component, OnInit } from '@angular/core';
import { CONST_PRODUCCION_MAQUINARIA } from '../maquinaria.constant';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm, ValidatorFn, AbstractControl } from '@angular/forms';
import { Maquinaria } from '../models/maquinaria.model';
import { MaquinariaService } from '../services/maquinaria.service';
import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';
import { MatSnackBar, MatDialogConfig, MatDialog, ErrorStateMatcher } from '@angular/material';
import { Router } from '@angular/router';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import * as moment from 'moment';
import { MaquinariaDatasource } from '../services/maquinaria.datasource';
import { MaquinariaCriteria } from '../models/maquinaria-criteria.model';
import { EquipoDatasource } from 'src/app/administracion/equipo/services/equipo.datasource';
import { EquipoCriteria } from 'src/app/administracion/equipo/models/equipo-criteria.model';
import { EquipoService } from 'src/app/administracion/equipo/services/equipo.service';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

export function placaInventarioExiste(placaInventarioExists: boolean): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return placaInventarioExists ? { 'existe': placaInventarioExists } : {};
  };
}

@Component({
  selector: 'sigma-crear-maquinaria',
  templateUrl: './crear-maquinaria.component.html',
  styleUrls: ['./crear-maquinaria.component.scss']
})

export class CrearMaquinariaComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_MAQUINARIA;
  anios: number[];
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  equipo: any = {};
  estadoEquipo: ListaItem;
  origenEquipo: ListaItem;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;

  dataSource: EquipoDatasource;
  /**  Criterios de busqueda por los cuales filtrara la grilla del componente */
  criteria = new EquipoCriteria();
  placaInventarioExists = false;

  newMaquinaria: Equipo = new Equipo();

  lastPlacaInventario: {
    placa: string;
    exists: boolean;
  } = { exists: false, placa: '' };

  placaInventarioExiste = () => {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return this.placaInventarioExists ? { 'existe': this.placaInventarioExists } : {};
    };
  }



  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private fb: FormBuilder,
    private servicio: EquipoService,
    private snackBar: MatSnackBar,
    private router: Router,
    private utilitiesService: UtilitiesService,
    private dialog: MatDialog,
    private genericServices: DataGenericService
  ) {
    this.dataSource = new EquipoDatasource(this.servicio);
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {

    this.genericServices.list(this.constants.path_administracion_estadoEquipo_activo).subscribe(
      (data: any) => {
        this.estadoEquipo = data;
      }
    );

    this.genericServices.list(this.constants.path_administracion_equipo_origenEquipo_alquilado).subscribe(
      (data: any) => {
        this.origenEquipo = data;
      }
    );

    this.form = this.fb.group({
      placaInventario: [null, [Validators.required,
      Validators.maxLength(10),
      Validators.pattern('[0-9a-zA-ZñÑ\\s]+'),
      this.placaInventarioExiste()]],
      clase: [null, Validators.compose([Validators.required])],
      tipo: [null, Validators.compose([Validators.required])],
      marca: [null, Validators.compose([Validators.required])],
      lugar: [null, Validators.compose([Validators.required])],
      linea: [null],
      anio: [null, Validators.compose([Validators.required])],
      numeroContrato: [null, [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern('[0-9a-zA-ZñÑ\\s]+')]],
      contratista: [null, [Validators.required, Validators.maxLength(100), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]+')]]
    });
    this.getAnios();
  }

  /** Método encargado de validar datos de entrada al solicitar
    * almacenamiento de información al método save
    */

  onSubmit() {
    this.markAndValidateAllInputs(this.form);
    this.disableSubmit = true;
    if (this.form.valid) {
      this.disableSubmit = true;
      this.save();
    } else {
      this.disableSubmit = false;
      this.snackBar.open('Favor revise el formulario', 'X', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  save() {
    this.newMaquinaria.placaInventario = this.form.get('placaInventario').value;
    this.newMaquinaria.numeroContrato = this.form.get('numeroContrato').value;
    this.newMaquinaria.contratista =  this.form.get('contratista').value;
    this.newMaquinaria.estadoEquipo = this.estadoEquipo;
    this.newMaquinaria.origenEquipo = this.origenEquipo;
    this.newMaquinaria.esMaquinariaProduccion = true;

    if (this.newMaquinaria.lineaMaquinaria !== undefined && this.newMaquinaria.lineaMaquinaria !== null) {
       this.newMaquinaria.linea = this.newMaquinaria.lineaMaquinaria.descripcion;
    }

    this.servicio.create(this.newMaquinaria).subscribe(
      data => {
        this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        const urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'list');
        this.router.navigate([urlBack]);
      },
      error => {
        this.disableSubmit = false;
        this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }


  // }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    // tslint:disable-next-line: forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  setTipo(_id: string) {
    this.equipo.equipoTipo = _id;
  }

  /** Método encargado de devolver a la página principal el componente */
  onBack(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val == 1) {
          const urlBack = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 1], 'list')
          this.router.navigate([urlBack]);
        }
      }
    );
  }

  getAnios() {
    this.anios = [];
    const currentYear = (new Date()).getFullYear();
    for (let i = currentYear; i >= 1980; i--) {
      this.anios.push(i);
    }
  }


  getErrorMessage(control: string) {
    const messages = [];
    let message = '';
    if (this.form.get(control).hasError('required')) {
      messages.push(this.constants.campoRequerido);
    }
    if (this.form.get(control).hasError('maxlength')) {
      messages.push(`Máximo ${this.form.getError('maxlength', control).requiredLength} caracteres`);
    }
    if (this.form.get(control).hasError('pattern')) {
      messages.push(this.constants.corregirInformacion);
    }
    if (this.form.get(control).hasError('existe')) {
      messages.push(this.constants.placaInventarioExistsError);
    }

    for (let i = 0; i < messages.length; i++) {
      if (i !== 0) {
        message = message + ' - ';
      }
      message = message + messages[i];
    }

    return message;
  }

  updatePlacaInventario(event) {
    this.placaInventarioExists = false;
  }
}

