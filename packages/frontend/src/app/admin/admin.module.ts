import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { OverviewComponent } from './components/overview/overview.component';
import { FormsModule } from '@angular/forms';
import { UserOverviewComponent } from './components/user-overview/user-overview.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
@NgModule({
    declarations: [OverviewComponent, UserOverviewComponent],
    imports: [CommonModule, AdminRoutingModule, FormsModule, TranslateModule]
})
export class AdminModule {}
