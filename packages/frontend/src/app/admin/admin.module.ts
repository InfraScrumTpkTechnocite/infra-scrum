import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { OverviewComponent } from './components/overview/overview.component';
import { FormsModule } from '@angular/forms';
import { UserOverviewComponent } from './components/user-overview/user-overview.component';

@NgModule({
    declarations: [OverviewComponent, UserOverviewComponent],
    imports: [CommonModule, AdminRoutingModule, FormsModule]
})
export class AdminModule {}
