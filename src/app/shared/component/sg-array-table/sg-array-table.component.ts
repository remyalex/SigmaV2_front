import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { CONST_SHARED } from '../../constantes-shared';

/**
 * Componente para mostrar una tabla editable de elementos de un arreglo
 * @author acpreda
 */
@Component({
    selector: 'sg-array-table',
    templateUrl: './sg-array-table.component.html'
})
export class ArrayTableComponent implements OnInit {


    constants = CONST_SHARED;

    /**
     * Configuración de la tabla
     */
    def: TableDef;
    @Input("def") set defInput(x: TableDef) {
        this.def = x;
        this.sanitizeTableDef(this.def);
    }

    /**
     * El modelo de la tabla (el arreglo)
     */
    model: any[];
    @Input("model") set _model(x: any) {
        if (x == null) {
            this.model = [];
        } else {
            this.model = x;
        }
    }

    /**
     * Columnas que se muestran
     */
    visibleColumns: string[] = [];
    @Input("visibleColumns") set _visibleColumns(str: string) {
        if (str == null) {
            this.visibleColumns = [];
        } else {
            this.visibleColumns = str.split(",");
        }
    }

    /** Variable usada para recibir valor booleano para nuevo */
    @Input("showNew") showNew: boolean = true;
    /** Variable usada para recibir label Nuevo en la invocación del componente */
    @Input("labelNew") labelNew: string;
    /** Variable usada para recibir icono Nuevo en la invocación del componente */
    @Input("iconNew") iconNew: string;
    /** Variable usada para recibir valor booleano para editar */
    @Input("showEdit") showEdit: boolean = true;
    /** Variable usada para recibir label Edit en la invocación del componente */
    @Input("labelEdit") labelEdit: string;
    /** Variable usada para recibir icono Edit en la invocación del componente */
    @Input("iconEdit") iconEdit: string;
    /** Variable usada para recibir valor booleano para eliminar */
    @Input("showDelete") showDelete: boolean = true;
    /** Variable usada para recibir label eliminar en la invocación del componente */
    @Input("labelDelete") labelDelete: string;
    /** Variable usada para recibir icono eliminar en la invocación del componente */
    @Input("iconDelete") iconDelete: string;
    /** Variable usada para recibir valor booleano para Index / inicio */
    @Input("showIndex") showIndex: boolean = false;
    /** Variable usada para habilitar el loader o no */
    @Input("showLoader") showLoader: boolean = false;


    /**
     * Columnas que se muestran
     */
    displayColumns: string[]

    /**
     * Función que se debe invocar para notificar la edición
     */
    @Output("onEdit") notifyEdit?= new EventEmitter<number>();

    /**
     * Función que se debe invocar para notificar la eliminación
     */
    @Output("onDelete") notifyDelete?= new EventEmitter<number>();

    /**
     * Función que se debe invocar para notificar la eliminación
     */
    @Output("onNew") notifyNew?= new EventEmitter<void>();

    @Output("onChangePage") notifyChangePage?= new EventEmitter<number[]>();


    /**
     * Fuente de datos de la tabla
     */
    dataSource: MatTableDataSource<[]>;

    /**
     * El tamaño de la página
     */
    pageSize: number;

    /**
     * El número de la página
     */
    page: number;

    /**
     * Cantidad de registros enontradados
     */
    length: number;

    /**
     * Columna por la cual se realizará el ordenamiento
     */
    sortBy: string;

    /**
     * tipo de ordenamiento
     */
    sortOrder: string;

    /**  Elemento usado para la paginación de la grilla */
    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    /**  Elemento usado para el ordenamiento de la grilla */
    @ViewChild(MatSort)
    sort: MatSort;

    /**
    * Método encargado de construir una instancia de la clase
    */
    constructor( private cd: ChangeDetectorRef ) {
        this.dataSource = new MatTableDataSource([]);
    }

    /** Método encargado de inicializar el componente */
    ngOnInit(): void {
        this.buildDisplayColumns();
    }

    /**
   *  Método encargado de gestionar la paginación de la información de
   *  la grilla usada en el componente
   */
    // tslint:disable-next-line: use-life-cycle-interface
    ngAfterViewInit(): void {
        this.paginator.page.subscribe(() => {
         this.page = this.paginator.pageIndex;
         this.pageSize = this.paginator.pageSize;
         this.refreshDataSource();
         this.onChangePage(this.pageSize, this.page);
        });

        this.sort.sortChange.subscribe(() => {
          this.sortBy = this.sort.active;
          this.sortOrder = this.sort.direction || 'asc';
          this.refreshDataSource();
          this.onChangePage(this.pageSize, this.page);
        });
        this.dataSource.sort = this.sort;
    }


    /**
     * Construye el arreglo de las columnas que se muestran
     */
    buildDisplayColumns() {
        this.displayColumns = [];
        if (this.showIndex) {
            this.displayColumns.push("index");
        }
        for (let i = 0; i < this.def.columns.length; i++) {
            const c = this.def.columns[i];
            if (this.visibleColumns.find(x => x == c.name)) {
                this.displayColumns.push(c.name);
            }
        }
        if (this.showEdit || this.showDelete) {
            this.displayColumns.push("actions");
        }
        this.refreshDataSource(true);
    }

    /**
     * Obtiene el valor de la clave en el modelo, en caso de ser nulo el valor entonces devuelve la cadena vacía
     * @param model El modelo
     * @param key La clave de la columna
     */
    defaultValueFn(model: any, key: string, property: any = null): any {
        if (model) {
            const value = model[key];
            if (value) {
                if (value.descripcion) {
                    return value.descripcion;
                } else {
                    if (property !== null && value[property]) {
                        return value[property];
                    } else {
                        return value;
                    }
                }
            }
            return value || '';
        }
    }

    onNew() {
        if (this.notifyNew) {
            this.notifyNew.emit();
        }
    }

    onChangePage(sizePage, page) {
        if (this.notifyChangePage) {
            this.notifyChangePage.emit([sizePage, page]);
        }
    }

    /**
     * Se invoca cuando se edita un elemento
     * @param index Índice del elemento a editar
     */
    onEdit(index: number) {
        if (this.notifyEdit) {
            this.notifyEdit.emit(index);
        }
    }

    /**
     * Se invoca cuando se elimina un elemento
     * @param index Índice del elemento a eliminar
     */
    onDelete(index: number) {
        if (this.notifyDelete) {
            this.notifyDelete.emit(index);
        }
    }

    /**
     * Reasigna el arreglo al dataSource
     */
    refreshDataSource(ignoreLoader: boolean = false) {
        this.dataSource.data = this.model;
        this.dataSource.sort = this.sort;
        if (!ignoreLoader) {
            this.showLoader = false;
        }
    }

    /**
     * Asigna los valores por defecto
     * @param def Definición de la tabla
     */
    sanitizeTableDef(def: TableDef): void {
        if (def.pageSizeOptions == null) {
            def.pageSizeOptions = [5, 10, 20];
        }
        if (def.page == null) {
            def.page = 0;
        }
        if (def.pageSize == null) {
            def.pageSize = 10;
        }
        if (def.sortOrder == null) {
            def.sortOrder = 'Asc';
        }
        if (def.orderBy == null) {
            def.orderBy = 'id';
        }
        if (def.showNewButton == null) {
            def.showNewButton = true;
        }
        if (def.showActions == null) {
            def.showActions = true;
        }
        if (def.showEditButton == null) {
            def.showEditButton = true;
        }
        if (def.showDeleteButton == null) {
            def.showDeleteButton = true;
        }
        for (let i = 0; i < def.columns.length; i++) {
            const x = def.columns[i];
            this.sanitizeTableColumnDef(x);
        }
    }

    /**
     * Asigna los valores por defecto
     * @param def Definición de la column
     */
    sanitizeTableColumnDef(def: TableColumnDef): void {
        if (def.disabled == null) {
            def.disabled = false;
        }
    }

}

/** clase que contiene la Definición de la tabla */
export class TableDef {
    title: string;
    pageSizeOptions?: number[];
    page?: number;
    pageSize?: number;
    sortOrder?: string;
    orderBy?: string;
    length?: number;
    showActions?: boolean;
    showNewButton?: boolean;
    showEditButton?: boolean;
    showDeleteButton?: boolean;
    newElementFn: () => any;
    columns: TableColumnDef[];
}

/** clase que contiene la Definición de columnas de la tabla */
export class TableColumnDef {
    name: string;
    property: string;
    label: string;
    disabled?: boolean;
    valueFn?: (model: any, key: string) => any;
}
