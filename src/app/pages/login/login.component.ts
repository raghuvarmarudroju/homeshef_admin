import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router'; 
import { AppService } from 'src/app/app.service';
import { AppSettings, Settings } from 'src/app/app.settings';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public hide = true;
  public bgImage:any;
  public settings: Settings;
  constructor(public appService:AppService,public fb: FormBuilder, public router:Router, private sanitizer:DomSanitizer, public appSettings:AppSettings) { 
    this.settings = this.appSettings.settings; 
  }

  ngOnInit(): void {
    this.bgImage = this.sanitizer.bypassSecurityTrustStyle('url(assets/images/others/login.jpg)');
    this.loginForm = this.fb.group({
      username: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      rememberMe: false
    });
  }

  public onLoginFormSubmit():void {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.appService.adminLogin(this.loginForm.value).subscribe(auth=>{ 
        if (auth && auth.status == 200 ) {
          this.appService.UserData.profile = auth.data;
          localStorage.setItem('userData',JSON.stringify(this.appService.UserData));
          localStorage.setItem('isLoggedIn','true');
          console.log(auth);
          this.router.navigate(['/admin']);
        }
      })
      //this.router.navigate(['/admin']);
    }
  }

}
