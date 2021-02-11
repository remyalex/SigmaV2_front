import { COSNT_MEJORAMIENTO_HISTORIAL_MANTENIMIENTO } from '../historial-mantenimiento.constants';

export class Query {
  public type: any = {};
  public campo: any = {};
  public operador: any = {};
  public value: '';
  public show = true;
}

export class Condicion {
  public name = '';
  public value = '';
  public valueUrl = '';

  constructor(name, value, valueUrl) {
    this.name = name;
    this.value = value;
    this.valueUrl = valueUrl;
  }
}

export class Condiciones {
  public condiciones = [
    {
      name: 'AND', value: ' AND ', valueUrl: ',\'AND\''
    },
    {
      name: 'OR', value: ' OR ', valueUrl: ',\'OR\''
    },
  ];
}

export class Campos {
  constanst = COSNT_MEJORAMIENTO_HISTORIAL_MANTENIMIENTO;

  campos = [
    {
      name: this.constanst.origen, field: 'tipoSolicitudId',
      type: 'list', url: this.constanst.path_mejoramiento_lista_tipoSolicitud,
      valueList: 'descripcion'
    },
    {
      name: this.constanst.estadoPk, field: 'estadoPkId',
      type: 'list', url: this.constanst.path_mejoramiento_lista_estadopk,
      valueList: 'descripcion'
    },
    {
      name: this.constanst.localidad, field: 'localidadId',
      type: 'list', url: this.constanst.path_mejoramiento_lista_localidades,
      valueList: 'descripcion', id: 'valor'
    },
    {
      name: this.constanst.zona, field: 'zonaId',
      type: 'list', url: this.constanst.path_mejoramiento_lista_zonas,
      valueList: 'descripcion', id: 'valor'
    },
    {
      name: this.constanst.barrio, field: 'barrioId',
      type: 'list', url: this.constanst.path_mejoramiento_lista_barrios,
      valueList: 'descripcion', id: 'valor'
    },
    {
      name: this.constanst.upla, field: 'uplaId',
      type: 'list', url: this.constanst.path_mejoramiento_lista_upla,
      valueList: 'descripcion', id: 'valor'
    },
    {
      name: this.constanst.tipoIntervencionTotalId, field: 'tipoIntervencionTotalId',
      type: 'list', url: this.constanst.path_mejoramiento_lista_tipoIntervencion,
      valueList: 'descripcion'
    },
    {
      name: this.constanst.fechaFin, field: 'fechaFin',
      type: 'date', url: null,
      valueList: null
    },
    {
      name: this.constanst.pk, field: 'pk',
      type: 'number', url: null,
      valueList: null
    },
    {
      name: this.constanst.civ, field: 'civ',
      type: 'number', url: null,
      valueList: null
    },
    {
      name: this.constanst.tipoMallaId, field: 'tipoMallaId',
      type: 'list', url: this.constanst.path_mejoramiento_tipo_malla,
      valueList: 'descripcion'
    },
    {
      name: this.constanst.indicePriorizacion, field: 'indicePriorizacion',
      type: 'number', url: null,
      valueList: null
    }
  ];
}

export class Acciones {
  constanst = COSNT_MEJORAMIENTO_HISTORIAL_MANTENIMIENTO;
  acciones = [
    {
      name: this.constanst.igual, value: ' = ~search~ ',
      valueDate: ' = TO_DATE(\'~search~\', \'DD/MM/YYYY\') ', symbol: '='
    },
    {
      name: this.constanst.mayor, value: ' > ~search~ ',
      valueDate: ' = TO_DATE(\'~search~\', \'DD/MM/YYYY\') ', symbol: '>'
    },
    {
      name: this.constanst.menor, value: ' < ~search~ ',
      valueDate: ' = TO_DATE(\'~search~\', \'DD/MM/YYYY\') ', symbol: '<'
    },
    {
      name: this.constanst.mayorIgual, value: ' >= ~search~ ',
      valueDate: ' = TO_DATE(\'~search~\', \'DD/MM/YYYY\') ', symbol: '>='
    },
    {
      name: this.constanst.menorIgual, value: ' <= ~search~ ',
      valueDate: ' = TO_DATE(\'~search~\', \'DD/MM/YYYY\') ', symbol: '<='
    },
    {
      name: this.constanst.diferente, value: ' <> ~search~ ',
      valueDate: ' != TO_DATE(\'~search~\', \'DD/MM/YYYY\') ', symbol: '!='
    },
    {
      name: this.constanst.contiene, value: ' LIKE \' %~search~% \'',
      valueDate: ' LIKE \' %~search~% \'', symbol: 'CONTIENE'
    },
    {
      name: this.constanst.inicia, value: ' LIKE \' ~search~% \'',
      valueDate: ' LIKE \'~search~%\' ', symbol: 'INICIA'
    },
    {
      name: this.constanst.finaliza, value: ' LIKE \' %~search~ \'',
      valueDate: ' LIKE \'%~search~\' ', symbol: 'FINALIZA'
    }
  ];
}


