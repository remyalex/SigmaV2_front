import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-sigma-confirm-format-to-export',
  templateUrl: './sigma-confirm-format-to-export.component.html'
})
export class SigmaConfirmFormatToExportComponent implements OnInit {

  formatType: string;

  constructor(
     public dialogRef: MatDialogRef<SigmaConfirmFormatToExportComponent>,
  ) {
  }

  ngOnInit() {
  }

  descargar() {
    this.dialogRef.close(this.formatType);
  }

  /** Método encargado de gestionar el cierre del dialog*/
  close() {
    this.dialogRef.close(0);
  }

}
