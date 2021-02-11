

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class TransicionService {
    private idSubject = new BehaviorSubject({});
    public id$ = this.idSubject.asObservable();
    constructor() {
    }
    updateIdProcess(pk: any): void {
        this.idSubject.next(pk);
    }
}
