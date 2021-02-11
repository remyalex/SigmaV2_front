import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { takeWhile, pluck } from 'rxjs/operators';
import { ProfileService } from '../services/profile.service';

@Directive({ selector: '[sigmaIsGranted]' })
export class IsGrantedDirective implements OnDestroy {
    private alive = true;
    private hasView = false;

    constructor(private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private profileService: ProfileService
    ) { }
    
    @Input() set sigmaIsGranted(permiso: string) {
        //LINEAS TEMPORALES
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
        // DEVOLVER A LA NORMALIDAD CUANDO SE AGREGUE EL ROL Y USUARIO
        this.profileService.isGranted(permiso)
            .pipe(
                pluck('state'),
            ).subscribe((can: any) => {
                if (typeof can !== 'undefined') {
                    if (can && !this.hasView) {
                        this.viewContainer.createEmbeddedView(this.templateRef);
                        this.hasView = true;
                    } else if (!can && this.hasView) {
                        this.viewContainer.clear();
                        this.hasView = false;
                    }
                }

            });
    }

    ngOnDestroy() {
        this.alive = false;
    }
}
