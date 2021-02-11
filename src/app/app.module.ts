import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CustomOverlayContainer } from './theme/utils/custom-overlay-container';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { AppComponent } from './app.component';
import { CookieService } from 'ngx-cookie-service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  suppressScrollX: true
};
import { SharedModule } from './shared/shared.module';
import { PipesModule } from './theme/pipes/pipes.module';
import { AppSettings } from './app.settings';

import { SidenavComponent } from './theme/components/sidenav/sidenav.component';
import { VerticalMenuComponent } from './theme/components/menu/vertical-menu/vertical-menu.component';
import { ApplicationsComponent } from './theme/components/applications/applications.component';
import { BreadcrumbComponent } from './theme/components/breadcrumb/breadcrumb.component';
import { SeguridadModule } from './seguridad/seguridad.module';
import { AppRoutingModule } from './app-routing.module';
import { BaseComponent } from './theme/layout/base/base.component';
import { AppHeaderComponent } from './_layout/app-header/app-header.component';
import { AppLayoutComponent } from './_layout/app-layout/app-layout.component';
import { SiteFooterComponent } from './_layout/site-footer/site-footer.component';
import { SiteHeaderComponent } from './_layout/site-header/site-header.component';
import { SiteLayoutComponent } from './_layout/site-layout/site-layout.component';
import { AdministracionModule } from './administracion/administracion.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SiteModule } from './site/site.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { httpInterceptorProviders } from './seguridad/interceptors/auth-interceptor';
import { FullScreenComponent } from './theme/components/fullscreen/fullscreen.component';
import { UserMenuComponent } from './theme/components/user-menu/user-menu.component';

// import { WidgetViewModule } from './widget-view/widget-view.module';

import { CalendarModule } from 'angular-calendar';
import { LoaderComponent } from './shared/component/loader/loader.component';
import { LoaderService } from './shared/component/loader/loader.service';
import { LoaderInterceptor } from './shared/component/loader/loader.interceptor';
import { MejoramientoModule } from './mejoramiento/mejoramiento.module';
import { WorkflowModule } from './workflow/workflow.module';
import { ProduccionModule } from './produccion/produccion.module';
import { GestionSocialModule } from './gestion-social/gestion-social.module';
import { MatTableModule, MatSortModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    VerticalMenuComponent,
    BreadcrumbComponent,
    ApplicationsComponent,
    FullScreenComponent,
    UserMenuComponent,
    BaseComponent,
    AppHeaderComponent,
    AppLayoutComponent,
    SiteFooterComponent,
    SiteHeaderComponent,
    SiteLayoutComponent,
    LoaderComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    MatTableModule,
    MatSortModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    PipesModule,
    HttpClientModule,
    SiteModule,
    SharedModule,
    SeguridadModule,
    AdministracionModule,
    DashboardModule,
    MejoramientoModule,
    ProduccionModule,
    GestionSocialModule,
    WorkflowModule,
    CalendarModule.forRoot(),
  ],
  entryComponents: [
    VerticalMenuComponent
  ],
  providers: [
    httpInterceptorProviders,
    AppSettings,
    LoaderService,
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: OverlayContainer, useClass: CustomOverlayContainer }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
