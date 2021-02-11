import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { DocService } from '../services/sigma-actividad-documentos.services';
import { Documento } from 'src/app/administracion/proceso/transicion/documentos/models/documento.model';
import { CONST_ADMINISTRACION_DOCUMENTO } from 'src/app/administracion/proceso/transicion/documentos/documentos.constant';

/** Componente encargado de gestionar la eliminación de documento de actividad */
@Component({
  selector: 'app-sigma-actividad-documentos-delete',
  templateUrl: './sigma-actividad-documentos-delete.component.html'
})
export class SigmaActividadDocumentosDeleteComponent implements OnInit {

  /** Formulario contenedor del componente */
  form: FormGroup;
  /** Bandera usada para ocultar el botón guardar */
  disabled = false;
  /** Objeto del mantenimiento que se procesará en el componente */
  docToDelete;
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_DOCUMENTO;

   /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param utilitiesServices Componente de utilidades de peticiones a servicios
  */
  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private servicio: DocService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<SigmaActividadDocumentosDeleteComponent>,
    private utilitiesServices: UtilitiesService
  ) {
    this.docToDelete = data.documento;
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog*/
  close() {
    this.dialogRef.close(0);
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.delete(this.docToDelete.id).subscribe(
      (data: Documento) => {
        this.servicio.updateDocList(data);
        this.dialogRef.close(0);
        this.snackBar.open('¡Se elimino el elemento!', 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.disabled = false;
        this.utilitiesServices.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

}
