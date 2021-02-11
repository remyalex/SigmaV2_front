import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Evento } from '../models/evento.model';
import { EventoService } from '../services/evento.service';
import { MatSnackBar } from '@angular/material';
import { CONST_ADMINISTRACION_EVENTO } from './../evento.constant';
import { EventousuarioService } from '../eventousuario/services/eventousuario.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';

/** Clase encargada de la eliminacion de eventos */
@Component({
  selector: 'sigma-administracion-evento-delete',
  templateUrl: './evento-delete.component.html'
})
export class EventoDeleteComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EVENTO;
  /** Objeto usado para enviar al servicio de CRUD*/
  evento: Evento;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;

  /**
   * Bandera usada para mantener habilitado o desabilitado el botón
   * submit del formulario
   **/
  disableSubmit = false;


  /**
   * Método encargado de construir una instancia de componente
   *
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param fb Componente usado para Agrupar elementos en el formulario
   * @param data Información a procesar
   * @param servicio Servicio usado en el componente para gestionar las peticiones
   * @param snackBar Componente usado para abrir un recuadro modal
   * @param servicioEventousuario servicio para peticioes del modulo
   * @param utilitiesService Componente de utilidades de peticiones a servicios
  */
  constructor(
    private dialogRef: MatDialogRef<EventoDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: Evento,
    private servicio: EventoService,
    private snackBar: MatSnackBar,
    private servicioEventousuario: EventousuarioService,
    private utilitiesService: UtilitiesService
  ) {
    this.evento = data;
    this.form = fb.group( { id: [this.evento.id, Validators.required] }
    );
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.servicioEventousuario.changeNoticeEventoUsuario$.subscribe(
      userData$ => {
        this.servicio.detail(this.evento.id).subscribe( updateData => {
          this.evento.eventosUsuario = updateData.eventosUsuario;
        });
      });
  }

  /** Método encargado de gestionar el cierre del dialog*/
  close() {
    this.dialogRef.close(0);
  }

  /** Método encargado de realizar solicitud de almacenamiento de información al servicio*/
  save() {
    this.servicio.delete(this.evento.id).subscribe(
      data => {
        this.servicio.updateEventData('updateList');
        this.dialogRef.close(this.form.value);
        this.snackBar.open(this.constants.deleteSuccess, 'X', {
          duration: 10000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.disableSubmit = false;
        this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }

}
