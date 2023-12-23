import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from './user.model';
import { environment } from 'src/environments/environment';

const httpOptions = {
    headers: new HttpHeaders({
        "basic": environment.basic
    }),
    //params:null
};
@Injectable({
    providedIn: 'root'
})
export class UsersService {
    public url = "api/users";
    constructor(public http: HttpClient) { }

    public registerChef(input: any) {
        const httpOptions = {
            headers: new HttpHeaders({
                "basic": environment.basic
            })
        };
        return this.http.post(environment.adminURL + 'chef/register', input, httpOptions)
            .pipe(
                map(
                    (response: any) => {
                        if (response) {
                            return response;
                        }
                    },
                    (error: any) => {
                        return error;
                    }
                )
            )
    }
    public updateChef(input: any) {
        const httpOptions = {
            headers: new HttpHeaders({
                "basic": environment.basic
            })
        };
        return this.http.post(environment.adminURL + 'chef/update', input, httpOptions)
            .pipe(
                map(
                    (response: any) => {
                        if (response) {
                            return response;
                        }
                    },
                    (error: any) => {
                        return error;
                    }
                )
            )
    }

    public getUsers(input: any) {
        alert('asdcasfd');
        const httpOptions = {
            headers: new HttpHeaders({
                "basic": environment.basic
            })
        };
        return this.http.post(environment.adminURL + 'users/getByRole', input, httpOptions)
            .pipe(
                map(
                    (response: any) => {
                        if (response) {
                            return response;
                        }
                    },
                    (error: any) => {
                        return error;
                    }
                )
            )
    }
} 