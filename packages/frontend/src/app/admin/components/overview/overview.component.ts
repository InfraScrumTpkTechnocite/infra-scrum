import { Component, OnInit } from '@angular/core';
import { HeaderTitleService } from 'src/app/services/header-title.service';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
    constructor(private headerTitleService: HeaderTitleService) {}

    ngOnInit(): void {
        this.headerTitleService.setTitle('Administration');
    }
}
