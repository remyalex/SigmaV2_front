import { Component, OnInit, Inject, KeyValueDiffers, KeyValueDiffer } from '@angular/core';
import { CONST_ADMINISTRACION_MANTENIMIENTO } from '../mantenimiento.constant';
import { GrupoService } from '../../services/grupo.service';
import { MatDialogConfig, MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { Router } from '@angular/router';
import { GrupoModel } from '../../models/grupo.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';

/** Componente encargado de adicionar un mantenimiento nuevo*/
@Component({
  selector: 'sigma-administracion-grupo-mantenimiento-add',
  templateUrl: './mantenimiento-add.component.html'
})
export class MantenimientoAddComponent implements OnInit {

  /** Formulario contenedor del componente */
  form: FormGroup;
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_MANTENIMIENTO;
  /** Objeto de modelo que agrupara la información del mantenimiento a procesar */
  newMantAdd: WorkflowMantenimientoModel = new WorkflowMantenimientoModel();
  /** Objeto de modelo que agrupa la infromación del grupo a procesar */
  public grupoData: GrupoModel;
  /** Bandera que permite saber si se ha enviado una petición al servicio */
  enviada = false;
  /** Bandera que permite saber si el botón de sumbit se encuentra deshabilitado */
  disableSubmit = true;

  /** Variable usada para procesar el mensaje que se presentará al usuario */
  mensaje = '';

  /** Objeto usado para notificar diferencias entre modelo y componentes */
  public clone = GrupoModel;

  /**
   * Método encargado de construir una instancia de componente
   *
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param router Componente usado para redireccionar entre componentes
   * @param data Información a procesar
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param differs Elemento usado para mantener la información clonada.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) grupoData: GrupoModel,
    private servicio: GrupoService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private differs: KeyValueDiffers,
    private dialogRef: MatDialogRef<MantenimientoAddComponent>,
    private formBuilder: FormBuilder
  ) {
    this.grupoData = grupoData;
    this.form = formBuilder.group({
      'observacion': [{ value: null, disabled: true }, Validators.compose([Validators.maxLength(600)])],
      'estadoRegistro': [{ value: null, disabled: true }]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.grupoData));
  }

  /** Método encargado de asignar el pk seleccionado como nuevo mantenimiento */
  itemSeleccionado(itemSelected) {
    this.disableSubmit = false;
    this.newMantAdd = itemSelected;
    this.form.get('observacion').enable();
    this.form.get('estadoRegistro').enable();
    console.log(itemSelected);
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.dialogRef.close(0);
      }
    });
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    if (this.form.valid) {
      this.disableSubmit = true;
      this.newMantAdd.grupoActivo = true;
      let temp = JSON.parse(JSON.stringify(this.grupoData));
      temp.mantenimientos.push(this.newMantAdd);
      this.servicio.update(temp).subscribe(
        data => {
          this.servicio.updateGroupList(temp);
          this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(1);
        },
        error => {
          this.disableSubmit = false;
          let descripcionError = '';
          try {
            descripcionError = error.error[0].message;
          } catch (error) {
            if (error.erro === undefined) {
              descripcionError = error.message;
            } else {
              descripcionError = error.error.message;
            }
          }
          this.snackBar.open( descripcionError, 'X', {
            duration: 10000,
            panelClass: ['error-snackbar']
          });
        }
      );
    }
  }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  private markAndValidateAllInputs(anyForm: FormGroup) {
    for (let inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }
}
