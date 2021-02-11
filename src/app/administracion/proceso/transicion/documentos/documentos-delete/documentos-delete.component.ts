import { Proceso } from '../../../models/proceso.model';
import { Documento } from '../models/documento.model';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_DOCUMENTO } from '../documentos.constant';
import { ProcesoService } from '../../../services/proceso.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { TransicionModel } from '../../../models/transicion.model';

/** Componente encargado de gestionar la eliminación de un documento de transición */
@Component({
  selector: 'sigma-administracion-documentos-delete',
  templateUrl: './documentos-delete.component.html'
})
export class DocumentosDeleteComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_DOCUMENTO;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  proceso: Proceso;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo transiciones */
  transicion: TransicionModel;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo de documentos */
  documentoToDelete: Documento;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  /** Bandera usada para ocultar el botón guardar */
  disabled = false;


  /**
  * Método encargado de construir una instancia de la clase
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  * @param data Información a procesar
  * @param fb Componente usado para Agrupar elementos en el formulario
  * @param snackBar Componente usado para abrir un recuadro modal
  * @param dialogRef Componente gráfico usado para presentar cuadros de dialogo
  * @param utilitiesServices Componente de utilidades de peticiones a servicios
  */
  constructor(
    private dialogRef: MatDialogRef<DocumentosDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any, //transicionModel,
    private servicio: ProcesoService,
    private snackBar: MatSnackBar,
    private utilitiesServices: UtilitiesService
  ) {
    this.proceso = data.proceso;
    this.transicion = data.transicion;
    this.documentoToDelete = data.documento; //.id
    this.form = fb.group({ id: [this.documentoToDelete.id, Validators.required] }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close (){
    this.dialogRef.close(0);
  }
   /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.disabled = true;
    for (let actDoc = 0; actDoc < this.transicion.transicionEstadoDocumento.length; actDoc++) {
      if (this.transicion.transicionEstadoDocumento[actDoc].id === this.documentoToDelete.id) {
        this.transicion.transicionEstadoDocumento.splice(actDoc, 1);
      }
    }
    this.addCondicionTransicion();
    this.servicio.update(this.proceso).subscribe(
      (data: Proceso) => {
        this.servicio.sendNewDataSelection(data);
        this.dialogRef.close(this.form.value);
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

  /** Método encargado de adicionar una condicion a la transición */
  addCondicionTransicion() {
    // tslint:disable-next-line: forin
    for (const transition in this.proceso.transiciones) {
      // tslint:disable-next-line: max-line-length
      this.proceso.transiciones[transition].condicion = this.proceso.transiciones[transition].condiciones;
    }
  }
}
