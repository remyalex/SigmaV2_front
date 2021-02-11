import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { CONST_SEND_MAIL } from './models/sigma-send-mail.constants';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SigmaConfirmComponent } from '../../sigma-confirm/sigma-confirm.component';
import { Archivo } from 'src/app/workflow/models/archivo.model';
import { Mail } from './models/mail.model';
import { MailService } from './services/mail.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-send-mail',
  templateUrl: './sigma-send-mail.component.html'
})
export class SigmaSendMailComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_SEND_MAIL;

  titulo: string;
  emails: Array<{value: string, name: string}> = [];
  emailsCount = 0;
  /** Variable usada para agrupar los elementos del formulario */
  form: FormGroup;
  mail: Mail;

  constructor(
    public dialogRef: MatDialogRef<SigmaSendMailComponent>,
    @Inject(MAT_DIALOG_DATA) data: {
      'titulo': string,
      'asunto': string,
      'mensaje': string,
      'mantenimientosId': number[],
      'attacheds': any;
    },
    private dialog: MatDialog,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private sendMail: MailService,
  ) {
    this.titulo = this.constants.titulo;
    this.mail = new Mail();
    this.mail.subject = this.constants.asunto;
    if (data) {
      if (data.titulo !== undefined) {
        this.titulo = data.titulo;
      }
      if (data.asunto !== undefined) {
        this.mail.subject = data.asunto;
      }
      if (data.mensaje !== undefined) {
        this.mail.body = data.mensaje;
      }
      this.mail.mantenimientosId = data.mantenimientosId;
      if (data.attacheds) {
        const reader = new FileReader();
        let base64data;
        reader.readAsDataURL(data.attacheds);
        this.mail.attacheds = reader.result;
        reader.onloadend = function() {
          base64data = reader.result;
          console.log(base64data);
        };
      }
    }

    this.form = this.formBuilder.group({});
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

  addMail() {
    this.emails.push({value: '', name: 'email-' + this.emailsCount.toString()});
    const validators = [Validators.required, Validators.maxLength(60), Validators.email];
    this.form.addControl('email-' + (this.emailsCount).toString() , new FormControl('', validators));
    this.emailsCount++;
  }

  deleteMail(key: number, nameControl) {
    this.emails.splice(key, 1);
    this.form.removeControl(nameControl);
  }

  /** Método encargado de gestionar el cierre del dialog*/
  close() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(
      val => {
        if (val === 1) {
          this.dialogRef.close(0);
        }
      }
    );
  }

  validar(): boolean {
    return this.emails.length > 0 && this.form.valid;
  }

  enviar () {
    if (this.mail.subject !== '') {
      if (this.mail.body !== '') {
        this.mail.to = [];
        for (const correo of this.emails) {
          this.mail.to.push(correo.value);
        }
        this.sendMail.sendMailAsignacionMaquinaria(this.mail).subscribe(response => {
          this.showMessageAlert('E-mail se envió correctamente', 'success-snackbar');
          this.dialogRef.close(0);
        }, error => {
          this.showMessageAlert('Error al hacer el envió del E-mail', 'error-snackbar');
        });
      } else {
        this.showMessageAlert('El cuerpo del mensaje es requerido', 'error-snackbar');
      }
    } else {
      this.showMessageAlert('El asunto es requerido', 'error-snackbar');
    }
  }

  showMessageAlert(message: string, clase: string) {
    this.snackBar.open(message , 'X', {
      duration: 10000,
      panelClass: [clase]
    });
  }

}
