import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActaVolanteModel } from '../models/acta-volante.model';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { ActaVolanteService } from '../services/acta-volante.service';
import { Router } from '@angular/router';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE } from '../registrar-acta-vecindad-volante.constant';
import { Archivo } from 'src/app/workflow/models/archivo.model';
import { ActaVolanteArchivoModel } from '../models/acta-volante-archivo.model';

@Component({
  selector: 'app-archivo-acta-volante',
  templateUrl: './archivo-acta-volante.component.html'
})
export class ArchivoActaVolanteComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  actaVolante: ActaVolanteModel = new ActaVolanteModel();
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = new ActaVolanteModel;
  snackBar: MatSnackBar;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialogRef: MatDialogRef<ArchivoActaVolanteComponent>,
    formBuilder: FormBuilder,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private servicioActa: ActaVolanteService,
    private router: Router,
    private utilitiesServices: UtilitiesService,
    snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) data: ActaVolanteModel,
  ) {
    const formato = 'DD-MM-YYYY';
    this.actaVolante = data;
    this.snackBar = snackBar;
    if (this.actaVolante.actaVolanteArchivo == null) {
      this.actaVolante.actaVolanteArchivo = new ActaVolanteArchivoModel();
      this.actaVolante.actaVolanteArchivo.archivo = new Archivo();
    }
    this.form = formBuilder.group({
      archivo: [null, Validators.compose([Validators.required])]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.actaVolante));
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        if (this.actaVolante.id > 0) {
          setTimeout(_ => {
            this.actaVolante.actaVolanteArchivo.archivo = this.clone.actaVolanteArchivo.archivo;
          }, 1);
        }
        this.dialogRef.close();
      }
    });

  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    if (this.form.valid) {
      this.servicioActa.update(this.actaVolante).subscribe(
        data => {
          this.snackBar.open(this.constants.successSave, 'X', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close();
        },
        error => {
          this.disableSubmit = false;
          this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
        }
      );
      //        this.dialogRef.close();
    }
  }

}
