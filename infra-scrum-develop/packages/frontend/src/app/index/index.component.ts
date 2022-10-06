import { Component, OnInit } from '@angular/core';
import { HeaderTitleService } from '../services/header-title.service';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
    constructor(private headerTitleService: HeaderTitleService) {}

    ngOnInit(): void {
        this.headerTitleService.setTitle('InfraScrum');
    }
}
