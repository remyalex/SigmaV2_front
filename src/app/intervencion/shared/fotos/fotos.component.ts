import { CONST_ADMINISTRACION_AUDITORIA } from './../../../administracion/auditoria/auditoria.constant';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IntervencionFoto } from '../../models/intervencionFoto.model';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html'
})
export class FotosComponent implements OnInit {

  form: FormGroup;
  fotos: IntervencionFoto[];
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: MatTableDataSource<IntervencionFoto>;
  foto: IntervencionFoto = new IntervencionFoto();
  /** Objeto usado para notificar diferencias entre modelo y componentes */
  clone = new IntervencionFoto;
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_AUDITORIA;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dialogRef: MatDialogRef<FotosComponent>,
    @Inject(MAT_DIALOG_DATA) data: {
      'fotos': IntervencionFoto[],
      'datasource': MatTableDataSource<IntervencionFoto>,
      'foto': IntervencionFoto },
    formBuilder: FormBuilder,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService
  ) {
    const formato = 'DD-MM-YYYY';
    this.fotos = data.fotos;
    this.dataSource = data.datasource;
    this.foto = data.foto;

    if (!this.foto.id) {
      this.foto.fechaRegistro = this.utilitiesService.convertDateToString(new Date(), formato);
    }

    this.form = formBuilder.group({
      'archivo': [null, Validators.compose([Validators.required])]
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.clone = JSON.parse(JSON.stringify(this.foto));
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
        if (this.foto.id > 0) {
          setTimeout(_ => {
            this.foto.archivo = this.clone.archivo;
          }, 1);
        }
        this.dialogRef.close();
      }
    });

  }

   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    if (this.form.valid) {
      if (!this.foto.id) {
        let numFoto = 1;
        if (this.fotos.length > 0) {
          numFoto = this.fotos[this.fotos.length - 1].numeroFoto + 1;
        }
        this.foto.numeroFoto = numFoto;
      }
      this.dialogRef.close({code: 1, foto: JSON.parse(JSON.stringify(this.foto)) });
    }
  }

}
