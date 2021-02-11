/**
 * Clase con métodos estáticos utilitarios
 * @author acpreda
 */
export class Utils {

    /**
     * Extrae un mensaje apto para el usuario final a partir del error HTTP
     * @param error El objeto devuelto por el llamado HTTP en caso de error
     */
    static friendlyHttpError(error: any) {
        var message = "";
        if (error.error instanceof ErrorEvent) {
            // Ocurre cuando el error se presenta en el cliente
            message = 'ATENCIÓN:', error.error.message;
        } else {
            // Respuesta del servidor que no es satisfactoria,
            message = `ATENCIÓN: ocurrió un error del lado del servidor (${error.status}) ${error.error}`;
        }
        console.error(message);
        return message;
    }

    /**
     * Asigna los valores de la fuente al destino
     * @param from Objecto fuente
     * @param to Objeto destino
     */
    static clone<T>(from: T, to: T): T {
        Object.assign(to, from);
        return to;
    }

    /**
     * Obtiene el valor del objeto como string su no es nulo de lo contrario devuelve la cadena vacía
     * @param thing El objeto que representa el valor
     */
    static defEmpty(thing: any): string {
        if (thing == null) {
            return "";
        } else {
            return "" + thing;
        }
    }

}

export class Stream<T> {
    private source: T[];

    constructor(source: T[]) {
        this.source = source;
    }

    /**
     * Devuelve las correspondiencias de la función fn
     * @param fn Función a aplicar en cada elemento y que devuelve la correspondencia
     */
    map<R>(fn: (x: T) => R): Stream<R> {
        let array: R[] = [];
        for (let i = 0; i < this.source.length; i++) {
            const x = this.source[i];
            array.push(fn(x));
        }
        return new Stream(array);
    }

    /**
     * Devuelve las correspondiencias de la función fn
     * @param fn Función a aplicar en cada elemento y que devuelve la correspondencia
     */
    mapFlat<R>(fn: (x: T) => Stream<R>): Stream<R> {
        let array: R[] = [];
        for (let i = 0; i < this.source.length; i++) {
            const x = this.source[i];
            const anArray = fn(x).toArray();
            for (let j = 0; j < anArray.length; j++) {
                const element = anArray[j];
                array.push(element);
            }
        }
        return new Stream(array);
    }

    project(fn: (a: T, x: T) => void): Stream<T> {
        let array: T[] = [];
        for (let i = 0; i < this.source.length; i++) {
            const x = this.source[i];
            if (Array.isArray(x)) {
                const a = x[0];
                for (let j = 0; j < x.length; j++) {
                    const y = x[j];
                    fn(a, y);
                }
                array.push(a);
            } else {
                throw new Error("La proyección se debe hacer sobre arreglos")
            }
        }
        return new Stream(array);
    }

    /**
     * Devuelve las primeras coincidencias de la función de extracción fn
     * @param fn La función que extrae el valor a comparar
     */
    uniq(fn: (x: T) => any): Stream<T> {
        let array = [];
        for (let i = 0; i < this.source.length; i++) {
            const x = this.source[i];
            var exists = false;
            for (let j = 0; j < array.length; j++) {
                const y = array[j];
                if (fn(x) == fn(y)) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                array.push(x);
            }
        }
        return new Stream(array);
    }

    groupBy(fn: ((x: T) => any)[]): Stream<T[]> {
        let map = new Map<string, T[]>();
        for (let i = 0; i < this.source.length; i++) {
            const x = this.source[i];
            const key = fn.map(f => f(x)).join("##");
            const list = map.get(key);
            if (list == null) {
                map.set(key, [x]);
            } else {
                list.push(x);
            }
        }
        let array: T[][] = [];
        map.forEach(x => {
            array.push(x);
        });
        return new Stream(array);
    }

    filter(fn: (x: T) => boolean): Stream<T> {
        let array: T[] = [];
        for (let i = 0; i < this.source.length; i++) {
            const x = this.source[i];
            if (fn(x)) {
                array.push(x);
            }
        }
        return new Stream(array);
    }

    toArray(): T[] {
        return this.source;
    }

    flat(): Stream<T> {
        let array: T[] = [];
        for (let i = 0; i < this.source.length; i++) {
            const a = this.source[i];
            if (Array.isArray(a)) {
                for (let j = 0; j < a.length; j++) {
                    const x = a[j];
                    array.push(x);
                }
            } else {
                array.push(a);
            }
        }
        return new Stream(array);
    }

    reduce(seed: () => T, fn: (a: T, x: T) => void): T {
        const reducted = seed();
        for(let i = 0; i < this.source.length; i++) {
            const x = this.source[i];
            fn(reducted, x);
        }
        return reducted;
    }
    
}

export interface HasData<T> {
    getData(): T;
    setData(data: T): void;
}

export interface HasVisible {
    show(): void;
    hide(): void;
    toggleVisible(): void;
    isVisible(): boolean;
}

export class Ref<C> {

    private reference: C;
    private firstCalls: ((ref: C) => void)[];
    private lastCalls: ((ref: C) => void)[];
    private isCalling = false;

    constructor() {
        this.firstCalls = [];
        this.lastCalls = [];
    }

    setReference(reference: C) {
        this.reference = reference;
        if (!this.isCalling) {
            this.tryCalls();
        }
    }

    callFirst(fn: (reference: C) => void) {
        this.firstCalls.push(fn);
        if (!this.isCalling) {
            this.tryCalls();
        }
    }

    callLast(fn: (reference: C) => void) {
        this.lastCalls.push(fn);
        if (!this.isCalling) {
            this.tryCalls();
        }
    }

    private tryCalls() {
        this.isCalling = true;
        while (this.firstCalls.length > 0) {
            if (this.reference == null) break;
            let ref = this.reference;
            let fn = this.firstCalls.pop();
            fn(ref);
        }
        while (this.lastCalls.length > 0) {
            if (this.reference == null) break;
            let ref = this.reference;
            let fn = this.lastCalls.shift();
            fn(ref);
        }
        this.isCalling = false;
    }

}