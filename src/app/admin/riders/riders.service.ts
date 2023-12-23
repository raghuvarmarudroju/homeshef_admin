import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; 

const httpOptions = {
    headers: new HttpHeaders({
      "basic": environment.basic
    }),
    //params:null
  };
@Injectable()
export class RidersService {
    public url = "api/users";
    constructor(public http:HttpClient) { }

    public registerRider(input: any) {
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
  public updateRider(input: any) {
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

  public getRiders(input: any) {
      return this.http.post(environment.adminURL + 'riders', input, httpOptions)
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