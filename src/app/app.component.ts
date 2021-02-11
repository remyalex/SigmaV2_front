import { Component} from '@angular/core';
import { Settings } from './app.settings.model';
import { AppSettings } from './app.settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  public settings: Settings;

  /**
  * Método encargado de construir una instancia del componente
  */
  constructor(public appSettings:AppSettings){
      this.settings = this.appSettings.settings;
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() { }
}