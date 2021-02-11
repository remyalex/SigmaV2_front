import { FormGroup, Validators } from '@angular/forms';
import { CONST_WORKFLOW_DIAGNOSTICO } from '../diagnostico.constants';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { MatTableDataSource } from '@angular/material';
import { DiagnosticoFallaModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.falla.model';
import { DiagnosticoUnidadMuestraModel } from 'src/app/mejoramiento/diagnostico/models/diagnostico.unidadMuestreo.model';
import { MaxDecimalValue } from 'src/app/shared/form/number.validator';

export class BaseFallas {
  public form: FormGroup;
  /** Constantes a usar en el componente */
  public constants = CONST_WORKFLOW_DIAGNOSTICO;
  public mantenimiento: WorkflowMantenimientoModel;
  /**  Fuente de conjunto de datos para manejo de grilla del componente */
  public dataSource: MatTableDataSource<DiagnosticoFallaModel>;
  public falla: DiagnosticoFallaModel = new DiagnosticoFallaModel();
  public labelLongitud = this.constants.longitud;
  public labelAncho = this.constants.ancho;

  public visibilityAnchoFalla: Boolean = true;
  public visibilityUnidadMuestreo: Boolean = true;

  public visibilityTipoFalla: Boolean = true;
  public visibilityTipoSuperficie: Boolean = true;
  public visibilityLongitudFalla: Boolean = true;
  public visibilityAnchoLosasFalla: Boolean = true;
  public visibilityLongitudLosasFalla: Boolean = true;
  public visibilityNumeroLosas: Boolean = false;
  public visibilityTipoIntervencionFalla: Boolean = true;
  public mensajeFalla = this.constants.mensajeAreaUnidad;

  public path_tipo_falla: string;
  public path_tipo_intervencion: string;
  public listado_muestras: DiagnosticoUnidadMuestraModel[];

  cambioUnidad(UnidadMuestreo: any, areaFallaExistente: number) {

    if (areaFallaExistente === undefined || areaFallaExistente === null) {
      areaFallaExistente = 0;
    }

    if (typeof UnidadMuestreo === 'undefined' || UnidadMuestreo === null) {
      return;
    }

    const areaUnidad = UnidadMuestreo.area;
    let sumaAreas = 0;

    const seleccionada = UnidadMuestreo.area;
    if (seleccionada != null) {
      if (
        this.mantenimiento.diagnostico.fallas.filter(
          (f) =>
            f.unidadMuestreo != null &&
            f.unidadMuestreo.id === UnidadMuestreo.id
        ).length > 0
      ) {
        sumaAreas = this.mantenimiento.diagnostico.fallas
          .filter(
            (f) =>
              f.unidadMuestreo != null &&
              f.unidadMuestreo.id === UnidadMuestreo.id
          )
          .map((o) => o.area)
          .reduce((a, c) => a + c);
      }
      const areavalida: number = parseFloat(
        (areaUnidad - sumaAreas + areaFallaExistente).toFixed(4)
      );

      this.form
        .get('areaFalla')
        .setValidators([Validators.required, Validators.max(areavalida)]);
      this.form.get('areaFalla').updateValueAndValidity();
    }

    if (
      this.mantenimiento.tipoSuperficie != null &&
      typeof this.mantenimiento.tipoSuperficie.descripcion !== 'undefined'
    ) {
      switch (this.mantenimiento.tipoSuperficie.descripcion) {
        case 'RÍGIDO':
          this.calculoValidacionNumeroLosasNoExcedaMuestreo();
          break;
      }
    }
    this.validarNumeroLosasxUnidadesMuestreo();
  }

  calculoValidacionNumeroLosasNoExcedaMuestreo() {
    this.form.get('numeroLosasFalla').validator = <any>(
      Validators.compose([
        Validators.required,
        Validators.min(0.01),
        Validators.max(this.falla.unidadMuestreo.numeroLosas),
        MaxDecimalValue(10, 2),
      ])
    );
    this.form.get('numeroLosasFalla').updateValueAndValidity();
  }

  cambioTipoFalla(TipoFalla: any) {
    if (typeof TipoFalla === 'undefined' || TipoFalla === null) {
      return;
    }

    if (
      this.mantenimiento.tipoSuperficie &&
      this.mantenimiento.tipoSuperficie.descripcion === 'MIXTOS'
    ) {
      let sumaAreas = 0;
      let sumaLosas = 0;

      if (this.mantenimiento.area != null) {
        if (this.mantenimiento.diagnostico.fallas.length > 0) {
          sumaAreas = this.mantenimiento.diagnostico.fallas
            .map((o) => o.area)
            .reduce((a, c) => a + c);
          this.mantenimiento.diagnostico.fallas.forEach((f) => {
            if (f.numeroLosas) {
              sumaLosas = sumaLosas + Number(f.numeroLosas);
            }
          });
        }
        const areavalida: number = parseFloat(
          (this.mantenimiento.area - sumaAreas).toFixed(4)
        );
        this.form
          .get('areaFalla')
          .setValidators([Validators.required, Validators.max(areavalida)]);
        this.form.get('areaFalla').updateValueAndValidity();
      }
    }

    if (
      TipoFalla.tipoSuperficie &&
      TipoFalla.tipoSuperficie.descripcion &&
      TipoFalla.tipoSuperficie.descripcion === 'RÍGIDO'
    ) {
      this.calculoValidacionNumeroLosasNoExcedaMuestreo();
      this.visibilityNumeroLosas = true;
      this.labelLongitud = this.constants.longitudLosa;
      this.labelAncho = this.constants.anchoLosa;
    } else {
      this.form.get('numeroLosasFalla').clearValidators();
      this.visibilityNumeroLosas = false;
      this.labelLongitud = this.constants.longitud;
      this.labelAncho = this.constants.ancho;
      this.falla.numeroLosas = null;
    }
    this.calcularAreaFalla();
  }

  calcularAreaFalla() {
    if (
      typeof this.falla.longitud !== 'undefined' &&
      typeof this.falla.ancho !== 'undefined' &&
      this.falla.longitud != null &&
      this.falla.ancho != null
    ) {
      this.falla.area = this.falla.ancho * this.falla.longitud;
    }

    if (
      typeof this.falla.longitudLosa !== 'undefined' &&
      typeof this.falla.anchoLosa !== 'undefined' &&
      this.falla.longitudLosa != null &&
      this.falla.anchoLosa != null
    ) {
      this.falla.area = this.falla.anchoLosa * this.falla.longitudLosa;
    }

    if (
      typeof this.falla.numeroLosas !== 'undefined' &&
      this.falla.numeroLosas != null
    ) {
      this.falla.area = this.falla.area * this.falla.numeroLosas;
    }

    if (typeof this.falla.area !== 'undefined' && this.falla.area != null) {
      this.falla.area = parseFloat(parseFloat(this.falla.area + '').toFixed(2));
    }
    this.validarNumeroLosasxUnidadesMuestreo();
  }

  validarNumeroLosasxUnidadesMuestreo() {
    let countNumLosas = 0;
    let unidadMuestreoNumeroLosas = 0;
    let editValidator = false;
    if (this.falla.unidadMuestreo && this.dataSource.data.length > 0) {
      if (this.falla.numeroLosas) {
        countNumLosas = this.falla.numeroLosas;
      }
      /*recorrer la lista de fallas creadas, evaluar la unidad de muestreo y 
      realizar la sumatoria las losas de las fallas actuales*/
      for (const fallas of this.dataSource.data) {
        if (this.falla.unidadMuestreo.id === fallas.unidadMuestreo.id) {
          unidadMuestreoNumeroLosas = this.falla.unidadMuestreo.numeroLosas;
          editValidator = true;
          if (this.falla !== fallas) {
            countNumLosas = Number(countNumLosas) + Number(fallas.numeroLosas);
          }
        }
      }

      //Validar si la sumatoria de las Losas supera las de Unidad de muestreo
      if (unidadMuestreoNumeroLosas < countNumLosas && editValidator) {
        countNumLosas = countNumLosas - this.falla.numeroLosas;
        let aux = unidadMuestreoNumeroLosas - countNumLosas;
        if (aux <= 0) {
          aux = 0;
        }
        //Set Validators max 'numeroLosasFalla'
        this.form.get('numeroLosasFalla').validator = <any>(
          Validators.compose([
            Validators.required,
            Validators.min(0.01),
            Validators.max(aux),
            MaxDecimalValue(10, 2),
          ])
        );
        this.form.get('numeroLosasFalla').updateValueAndValidity();
      }
    }
  }

  obtenerAbreviaturaIntervencion(): string {
    let abreviatura: string;

    if (
      this.mantenimiento.diagnostico == null ||
      this.mantenimiento.diagnostico.encabezado == null ||
      this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal == null ||
      this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal
        .descripcion == null
    ) {
      return '0';
    }

    switch (
    this.mantenimiento.diagnostico.encabezado.tipoIntervencionTotal
      .descripcion
    ) {
      case 'MP / Cambio de Carpeta':
        abreviatura = 'BA';
        break;
      default:
        abreviatura = '0';
        break;
    }
    return abreviatura;
  }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  public markAndValidateAllInputs(anyForm: FormGroup) {
    // tslint:disable-next-line:forin
    for (const inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }

  validateNumber(e: any, valor: any) {
    let input = String.fromCharCode(e.charCode);
    const reg = /^[0-9]+(.)?([0-9]+)?$/;

    if (input !== '.') {
      if (!reg.test(input)) {
        e.preventDefault();
        return;
      }
    }

    try {
      input = valor + input;
      if (input.split('.').length > 2) {
        e.preventDefault();
        return;
      }
      parseFloat(input);
    } catch (error) {
      e.preventDefault();
      return;
    }
  }
}
