import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DataGenericService } from './../services/data-generic.service';

/** Componente encargado de gestionar el componente de autocompletar */
@Component({
    selector: 'app-sigma-autocomplete',
    templateUrl: './sigma-autocomplete.component.html',
    styleUrls: ['./sigma-autocomplete.component.scss']
})
export class SigmaAutocompleteComponent implements OnInit {

    /** Variable usada para recibir en la invocación del componente
    * el mensaje para el label **/
    @Input('label') label: any;
    /** Variable usada para recibir en la invocación del componente
    * si es requerido **/
    @Input('required') required: boolean;
    /** Variable usada para recibir en la invocación del componente
    * objeto a buscar por **/
    @Input('searchBy') searchBy: any;
    /** Variable usada para recibir en la invocación del componente
    * el rectificador criteria **/
    @Input('rectificadorCriteria') rectificadorCriteria: any;
    /** Variable usada para recibir en la invocación del componente
    * el parametro adicional 1 **/
    @Input('parametroAdicional1') ParametroAdicional1: any;
    /** Variable usada para recibir en la invocación del componente
    * el parametro adicional 1 **/
    @Input('parametroAdicional2') ParametroAdicional2: any;
    /** Variable usada para recibir en la invocación del componente
    * el mensaje para el label parametro 1 **/
    @Input('labelparametro1') labelparametro1: any;
    /** Variable usada para recibir en la invocación del componente
    * el mensaje para el label parametro 2 **/
    @Input('labelparametro2') labelparametro2: any;
    /** Variable usada para recibir en la invocación del componente
    * el mensaje para el label parametro 3 **/
    @Input('labelparametro3') labelparametro3: any;
    /** Variable usada para recibir la ruta en la invocación del componente */
    @Input('path') path: any;
    /** item seleccionado que devuelve el componente una vez procesada la información */
    @Output('selectItem') selectItem: EventEmitter<any> = new EventEmitter();
    /** Variable usada para recibir la el valor tipo String
     * en la invocación del componente */
    @Input('value') value: string;
    /** objeto usado para recibir las opciones buscadas según filtros */
    searchTerm$ = new Subject<string>();
    // @Output('selected') autocomplete;

    /**
     * Método encargado de construir una instancia de componente
     * @param dataService Servicio data usado en el componente para gestionar las peticiones
     */
    constructor(private dataService: DataGenericService) { }

    /** Valor tipo Date mínimo permitido para la fecha  */
    myControl = new FormControl();
    /** lista de opciones usado en el componente */
    options: any[];
    /**  variable usada como label en caso de no encontrar resultados */
    notFound: any;
    /** variable boolean a en caso de no encontrar resultados */
    noResultados: Boolean;
    /** objeto observable para recibir las opciones de filtro */
    filteredOptions: Observable<string[]>;
    /** Variable con url de peticion a realizar */
    public petitionList = null;

    /** Método encargado de inicializar el componente */
    ngOnInit() {
        const query = `${this.searchBy}=&page=0&size=10&sortBy=${this.searchBy}&sortOrder=asc`;
        this.searchTerm$
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                map(data => this._filter(data))
            ).subscribe(response => {
            });
    }

    /** Método encargado de seleccionar una opción
     * @param event objeto a usar
    */
    selected(event: any) {
        this.selectItem.emit(this.options.filter(data => (data[this.searchBy] == event.option.value))[0]);
    }

    /** Método encargado de buscar resultados con el valor ingresado
     * @param value valor ingresado
     */
    _filter(value: any) {
        const filterValue = value.toLowerCase();
        let query = `?${this.searchBy}=${filterValue}`;

        if (this.petitionList) {
            this.petitionList.unsubscribe();
        }
        if (this.rectificadorCriteria) {
            query = query + this.rectificadorCriteria;
        }
        this.petitionList = this.dataService.search(this.path, query)
            .subscribe(
                (data) => {
                    this.noResultados = false;
                    this.options = data.content;
                }, error => {
                    this.noResultados = true;
                    this.notFound = { valor: 'No se encuentran resultados' };
                    this.value = value;
                    this.selectItem.emit('');
                }
            );

        return this.options;
    }

}


