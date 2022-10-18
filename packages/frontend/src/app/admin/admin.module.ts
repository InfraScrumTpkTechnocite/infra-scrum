import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { OverviewComponent } from './components/overview/overview.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [OverviewComponent],
    imports: [CommonModule, AdminRoutingModule, FormsModule]
})
export class AdminModule {}
