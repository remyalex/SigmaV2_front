import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SigmaConfirmComponent } from 'src/app/shared/sigma-confirm/sigma-confirm.component';
import { DiagnosticoFotoModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.foto.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { CONST_WORKFLOW_DIAGNOSTICO } from '../diagnostico.constants';

/** Componente encargado de gestionar las fotos en el sistema */
@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html'
})
export class FotosComponent implements OnInit {

  /** Formulario contenedor del componente */
  form: FormGroup;
  /** Constantes a usar en el componente */
  constants = CONST_WORKFLOW_DIAGNOSTICO;
  /** Lista de objetos de tipo modelo */
  fotos: DiagnosticoFotoModel[];
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  dataSource: MatTableDataSource<DiagnosticoFotoModel>;
  /** Variable encargada de encapsular las propiedades del objeto de tipo modelo */
  foto: DiagnosticoFotoModel = new DiagnosticoFotoModel();

  /** Clón del objeto que se va a modificar información */
  clone = new DiagnosticoFotoModel;
  /**
   * Bandera que permite identificar si el formualrio se
   * encuentra procesando alguna petición
   * */
  procesando = false;


  /**
   * Método encargado de construir una instancia de componente
   *
   * @param data Información a procesar
   * @param dialogRef Referencia al componente dialog que invoco la funcionalidad
   * @param formBuilder Componente usado para Agrupar elementos en el formulario
   * @param dialog Componente gráfico usado para presentar cuadros de dialogo
   * @param utilitiesService Componente de utilidades de peticiones a servicios
   */
  constructor(
    private dialogRef: MatDialogRef<FotosComponent>,
    @Inject(MAT_DIALOG_DATA) data: { 'fotos': DiagnosticoFotoModel[],
    'datasource': MatTableDataSource<DiagnosticoFotoModel>, 'foto': DiagnosticoFotoModel },
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
    this.procesando = true;
    const _this = this;
    if (_this.form.valid && _this.procesando) {
      if (!_this.foto.id) {
        _this.fotos.push(_this.foto);
      }
      _this.dataSource.data = _this.fotos;
      _this.dialogRef.close();
    }
    _this.procesando = false;
  }
}
