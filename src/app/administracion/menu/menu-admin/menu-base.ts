import { AuthService } from 'src/app/seguridad/services/auth.service';
import { ProfileService } from 'src/app/seguridad/services/profile.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { AppSettings } from 'src/app/app.settings';
import { MenuadminService } from '../services/menuadmin.service';
import { forkJoin, BehaviorSubject } from 'rxjs';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';


export abstract class MenuBase {
  // private procesando = new BehaviorSubject<boolean>(false);
  // public procesando$ = this.procesando.asObservable();
    servicio: MenuadminService;
    authService: AuthService;
    snackBar: MatSnackBar;
    profileService: ProfileService;
    tokenStorage: TokenStorageService;
    appSettings: AppSettings;
    router: Router;
    constructor(
        servicio: MenuadminService,
        authService: AuthService,
        profileService: ProfileService,
        tokenStorage: TokenStorageService,
        appSettings: AppSettings,
        snackBar: MatSnackBar,
        router: Router,
    ) {
        this.servicio = servicio;
        this.authService = authService;
        this.snackBar = snackBar;
        this.profileService = profileService;
        this.tokenStorage = tokenStorage;
        this.appSettings = appSettings;
        this.router = router;
    }
    actualizarMenuVertical()  {

        this.authService.getUserMenus(this.tokenStorage.PERFIL).subscribe((menu) => {
            this.tokenStorage.savePayload(this.tokenStorage.MENU, window.btoa(JSON.stringify(menu)));
            this.servicio.refreshMenu();
            this.snackBar.open('¡Se actualizaron los datos con exito!', 'X', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });
            if (this.router.url !== '/administracion/menu/admin'){
              this.router.navigateByUrl('/administracion/menu/admin');
            }
            // this.procesando.next(true);
          }, error => {
            // this.procesando.next(false);
            this.snackBar.open('¡Se actualizaron los datos con exito, pero no fue posible actualizar el menú!', 'X', {
              duration: 5000,
              panelClass: ['warning-snackbar']
            });
          });
    }

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  public markAndValidateAllInputs(anyForm: FormGroup) {
    for (let inner in anyForm.controls) {
      anyForm.get(inner).markAsTouched();
      anyForm.get(inner).updateValueAndValidity();
    }
  }
}
