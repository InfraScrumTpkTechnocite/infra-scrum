import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'app-email-confirm',
  templateUrl: './email-confirm.component.html',
  styleUrls: ['./email-confirm.component.css']
})
export class EmailConfirmComponent implements OnInit {
  username: any;
  token: any;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.username = params['username'];
        this.token = params['token'];
        console.log(`index.component.ts - ngOnInit - username/token : ${this.username}/${this.token}`); // price

        this.httpClient.get(`backend/auth/confirm/${this.username}/${this.token}`)
          //return this.httpClient.post<User>("/backend/registeruser", JSON.stringify(user), this.httpOptions)
          .pipe(
            tap((response) => {
              console.log(`index.component.ts - onInit - get email confirmation = ${response}`);
            }),
            //catchError((error) => console.log(`index.component.ts - onInit - erreur - ${error}`))
          ).subscribe();
      }
      );
  }

}
