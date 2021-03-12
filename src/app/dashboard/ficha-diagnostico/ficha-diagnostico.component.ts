import { Component, OnInit, ViewChild, LOCALE_ID, Inject } from '@angular/core';
import { MantenimientoVial } from '../models/mantenimiento-vial';
import {MatExpansionPanel} from '@angular/material/expansion';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TokenStorageService } from "src/app/seguridad/services/token-storage.service";
import { Observable } from "rxjs";
import { DominioItem } from "../models/dominio-item";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'events'
};
@Component({
  selector: 'app-ficha-diagnostico',
  templateUrl: './ficha-diagnostico.component.html',
  styleUrls: ['./ficha-diagnostico.component.scss']
})
export class FichaDiagnosticoComponent implements OnInit {
  localidades: DominioItem[];
  tiposSuperficie: DominioItem[];
  tiposOrigen: DominioItem[];

  usosVia: DominioItem[];
  programas: DominioItem[];
  transitabilidadValores: DominioItem[];
  otrosFactoresTipos: DominioItem[];
  tiposIntervencion: DominioItem[];
  tiposIntervencionTotal: DominioItem[];
  tiposFalla: DominioItem[];
  tiposSeveridad: DominioItem[];
  tiposMalla: DominioItem[];
  tiposSeccionVial: DominioItem[];
  tiposSuperficieMantenimientoVial: DominioItem[];
  upzs: DominioItem[];
  zonas: DominioItem[];
  barrios: DominioItem[];
  zonasEAB: DominioItem[];
  solMantenimientoVial: MantenimientoVial;

  @ViewChild('seccionEncabezado') seccionEncabezado: MatExpansionPanel;

  constructor(private http: HttpClient, public tokenService: TokenStorageService) {
    this.tiposOrigen = [{ idTipo: 1401, valor: "1", descripcion: "PETICIONARIO"},
      { idTipo: 1402, valor: "2", descripcion: "SEGUIMIENTO"},
      { idTipo: 1403, valor: "3", descripcion: "MISIONAL"}
    ];

    this.localidades = [{ idTipo: 317, valor: "17", descripcion: "CANDELARIA"},
      { idTipo: 310, valor: "10", descripcion: "ENGATIVA"},
      { idTipo: 315, valor: "15", descripcion: "ANTONIO NARIÑO"},
      { idTipo: 312, valor: "12", descripcion: "BARRIOS UNIDOS"},
      { idTipo: 309, valor: "09", descripcion: "FONTIBON"},
      { idTipo: 318, valor: "18", descripcion: "RAFAEL URIBE URIBE"},
      { idTipo: 304, valor: "04", descripcion: "SAN CRISTOBAL"},
      { idTipo: 308, valor: "08", descripcion: "KENNEDY"},
      { idTipo: 311, valor: "11", descripcion: "SUBA"},
      { idTipo: 320, valor: "20", descripcion: "SUMAPAZ"},
      { idTipo: 314, valor: "14", descripcion: "LOS MARTIRES"},
      { idTipo: 319, valor: "19", descripcion: "CIUDAD BOLIVAR"},
      { idTipo: 301, valor: "01", descripcion: "USAQUEN"},
      { idTipo: 307, valor: "07", descripcion: "BOSA"},
      { idTipo: 305, valor: "05", descripcion: "USME"},
      { idTipo: 316, valor: "16", descripcion: "PUENTE ARANDA"},
      { idTipo: 313, valor: "13", descripcion: "TEUSAQUILLO"},
      { idTipo: 306, valor: "06", descripcion: "TUNJUELITO"},
      { idTipo: 302, valor: "02", descripcion: "CHAPINERO"},
      { idTipo: 303, valor: "03", descripcion: "SANTA FE"}];
      /* LISTA BARRIOS
      this.barrios = this.generalValuesService.dominosMap.get('UMV_BARRIOS');
      // LISTA ZONAS EAB
      this.zonas = this.generalValuesService.dominosMap.get('UMV_ZONAS');
      // LISTA UPZ
      this.upzs = this.generalValuesService.dominosMap.get('UMV_UPZS');
      */ //LISTA TIPO MALLA VIAL
      this.tiposSuperficie = [{ idTipo: 676, valor: "5", descripcion: "Adoquín arcilla"},
            { idTipo: 674, valor: "3", descripcion: "Mixtos"},
            { idTipo: 677, valor: "6", descripcion: "Afirmado"},
            { idTipo: 671, valor: "0", descripcion: "Sin dato"},
            { idTipo: 680, valor: "13", descripcion: "Fresado Estabilizado"},
            { idTipo: 678, valor: "8", descripcion: "Tierra"},
            { idTipo: 673, valor: "2", descripcion: "Flexible"},
            { idTipo: 675, valor: "4", descripcion: "Adoquín concreto"},
            { idTipo: 679, valor: "12", descripcion: "Piedra laja"},
            { idTipo: 672, valor: "1", descripcion: "Rígido"}
      ];
      /*this.usosVia = [];
      this.programas = [];
      this.transitabilidadValores = [];
      this.otrosFactoresTipos = [];
      this.tiposIntervencion = [];
      this.tiposIntervencionTotal = [];
      this.tiposFalla = [];
      this.tiposSeveridad = [];
      this.tiposMalla = [];
      this.tiposSeccionVial = [];
      this.tiposSuperficieMantenimientoVial = [];
      this.upzs = [];
      this.zonas = [];
      this.barrios = [];
      this.zonasEAB = [];*/
  }

  ngOnInit() {
    let mvInfo = {
      usuario: this.tokenService.getUsuario(),
      mantenimientovial: this.solMantenimientoVial,
      filtro: "x"
    };
    let ret:Observable<any> = this.http.post<any>('/SIGMA-backend/api/mantenimientovial/consultarxfiltro', JSON.stringify(mvInfo), httpOptions);
  }

}
