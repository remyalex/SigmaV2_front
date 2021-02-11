import { Component, OnInit } from '@angular/core';
import { EstadisticaUsuarioService } from '../services/estadisticaUsuario.service';
import { EstadisticaUsuarioModel } from '../models/estadisticaUsuario.model';
import {Chart} from 'chart.js'
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { MatSnackBar } from '@angular/material';

/** Componente encargado de gestionar las estadisticas de usuario */
@Component({
  selector: 'app-estadistica-usuario-detail',
  templateUrl: './estadistica-usuario-detail.component.html'
})
export class EstadisticaUsuarioDetailComponent implements OnInit {

  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor() {}

  /** Método encargado de inicializar el componente */
  ngOnInit() {}




}
