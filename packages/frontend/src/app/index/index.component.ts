import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { removeAllListeners } from 'process';
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
        // translateService.use('en');
        // translateService.use('fr');
    }

    ngOnInit(): void {
        this.headerTitleService.setTitle('InfraScrum');

        /* -------------------------------------------------------------------------- */
        /*                      animation div appearing on scroll                     */
        /* -------------------------------------------------------------------------- */

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                console.log(entry);
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                } else {
                    entry.target.classList.remove('show');
                }
            });
        });

        const hiddenElements = document.querySelectorAll('.hide');
        hiddenElements.forEach((el) => observer.observe(el));
    }
}
