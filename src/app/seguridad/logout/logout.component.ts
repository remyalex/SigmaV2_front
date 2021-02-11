import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Componente encargado de gestionar los {} */
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit {

  /**
  * Método encargado de construir una instancia
  * @param tokenService Componente usado para obtener información del token del usuario
  * @param router Componente usado para redireccionar entre componentes
  * @param dataGenericService Servicio Generico para data usado en el componente
  * para gestionar las peticiones
  */
  constructor(
    private tokenService: TokenStorageService,
    public router: Router,
    public dataGenericService: DataGenericService
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    this.tokenService.signOut();
    this.router.navigate(['/site/home']);

    // Limpia cache de listas
    this.dataGenericService.clearCacheList();
  }

}
