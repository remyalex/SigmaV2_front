import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Tipocargueestructura } from '../models/tipocargueestructura.model';
import { TipocargueestructuraService } from '../services/tipocargueestructura.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_TIPOCARGUEESTRUCTURA } from './../tipocargueestructura.constant';
import { Tipocargue } from '../../tipocargue/models/tipocargue.model';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar la eliminación de un tipoCargueEstructura */
@Component({
  selector: 'sigma-administracion-tipocargueestructura-delete',
  templateUrl: './tipocargueestructura-delete.component.html'
})
export class TipocargueestructuraDeleteComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOCARGUEESTRUCTURA;
  /** Objeto usado para enviar al servicio de CRUD*/
  tipocargueestructura: Tipocargueestructura;
  /** Objeto usado para enviar al servicio de CRUD*/
  tipoCargue: Tipocargue;
  /** variable tipo numerica que recibe valor por data */
  key: number;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;

  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  */
  constructor(
    private dialogRef: MatDialogRef<TipocargueestructuraDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Tipocargueestructura,
    private servicio: TipocargueestructuraService,
    private snackBar: MatSnackBar,
    private dataGenericService:  DataGenericService
  ) {
    this.tipocargueestructura = data['tipocargueestructura'];
    this.key = data['key'];
    this.tipoCargue = this.servicio.tipoCargue;
    this.form = fb.group({ id: [this.tipocargueestructura.id, Validators.required] }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close() {
    this.dialogRef.close(0);
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.tipoCargue.estructuras.splice(this.key, 1);
    this.servicio.updateTipoCargue(this.tipoCargue).subscribe(
      data => {
        this.servicio.updateTipoCargueClone(this.tipoCargue);
        this.dataGenericService.removeCacheListContain(this.constants.path_administracion_tipocargueestructura);
        this.dialogRef.close(this.form.value);
        this.snackBar.open(this.constants.deleteSuccess, 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.snackBar.open(this.constants.deleteSuccess, 'X', {
          duration: 10000,
          panelClass: ['error-snackbar']
        }
        );
      }
    );
  }

}
