import { CONST_CONSULTAR_PROGRAMACION_PERIODICA } from './../consultar-programacion.constants';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogConfig, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';

@Component({
  selector: 'app-consultar-view',
  templateUrl: './consultar-view.component.html'
})
export class ConsultarViewComponent implements OnInit {

  constants = CONST_CONSULTAR_PROGRAMACION_PERIODICA;

  /** Variable usada para recibir id en la invocación del componente */
  // tslint:disable-next-line: no-input-rename
  @Input('idArchivo') idArchivo: number;

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ConsultarViewComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.idArchivo = data;
  }

  ngOnInit() {
  }

  onBack() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(SigmaConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe(val => {
      if (val === 1) {
        this.dialogRef.close(0);
      }
    });
  }

}
