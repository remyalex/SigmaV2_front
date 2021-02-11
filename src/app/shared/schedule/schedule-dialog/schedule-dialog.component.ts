import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/** Componente encargado de gestionar las fechas del componente */
@Component({
  selector: 'app-schedule-dialog',
  templateUrl: './schedule-dialog.component.html'
})
export class ScheduleDialogComponent implements OnInit {
  public form: FormGroup;

  /**
  * Método encargado de construir una instancia del componente
  * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
  * @param data Información a procesar
  * @param formBuilder Componente usado para Agrupar elementos en el formulario
  */
  constructor(
    public dialogRef: MatDialogRef<ScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      'title': ['', Validators.required],
      'start': ['', Validators.required],
      'end': '',
      'isEdit': false
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    if (this.data) {
      this.form.patchValue({
        'title': this.data.title,
        'start': this.data.start,
        'end': this.data.end,
        'isEdit': true
      })
    }
  }

  /** Método encargado de gestionar el cierre del dialog del componente */
  close(): void {
    this.dialogRef.close();
  }

}