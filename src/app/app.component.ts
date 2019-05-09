import { Component , OnInit} from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
 
  captcha: string = null;
  loginModel: any = {};
  ipAddress: string;
  hasError : boolean = false;
  errorMessage : string;
  successMessage : string;


  getCaptcha(){
    axios.get('http://api.ipify.org/?format=jsonp').then(function(result) {
      let ipVar = result.data;
      let num = ipVar.indexOf(":");
      let num2 = ipVar.indexOf("\"});");
      this.ipAddress = ipVar.slice(num+2,num2);
      axios.post('http://localhost:8080/captcha', { ipAddress: this.ipAddress}).then(function (response) {
        this.captcha  = response.data.captcha;
      }.bind(this));
    }.bind(this))
  }
  
  ngOnInit() {
    this.getCaptcha();
  }

 refreshCaptcha(){
  this.getCaptcha();
 }

 submit(){
  // console.log(this.loginModel.userName, this.loginModel.password , this.loginModel.captcha);
  if(! this.loginModel.userName){
    this.hasError = true;
    this.errorMessage = "Please enter valid username"
    this.successMessage = null;
  } else if(! this.loginModel.password) {
    this.hasError = true;
    this.errorMessage = "Please enter valid password"
    this.successMessage = null;
  } else if(! this.loginModel.captcha){
    this.hasError = true;
    this.errorMessage = "Please enter valid captcha"
    this.successMessage = null;
  } else {
    axios.post('http://localhost:8080/login', { "userName" : this.loginModel.userName , 
        "password": this.loginModel.password,  "captcha": this.loginModel.captcha,"ipAddress" : this.ipAddress }).then(function (response) {
        this.hasError = false;
        this.successMessage = "User validated successfully!"
    }.bind(this)).catch(function(error){
      this.hasError = true;
      if (error.response) {
        this.errorMessage = error.response.data;
      } else if (error.request) {
        console.log(error.request);
      } else {
        this.errorMessage = error.message;
      }
      
      
      this.successMessage = null;
    }.bind(this));
  }
 }
}
