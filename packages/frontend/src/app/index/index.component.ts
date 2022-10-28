import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, tap } from 'rxjs';
import { HeaderTitleService } from '../services/header-title.service';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
    constructor(
        private headerTitleService: HeaderTitleService,
        private translateService: TranslateService
    ) {
        translateService.use('en');
    }

    ngOnInit(): void {
        this.headerTitleService.setTitle('InfraScrum');
    }
}
