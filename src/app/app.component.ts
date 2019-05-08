import { Component } from '@angular/core';
import axios from 'axios';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 
  captcha: string;
  userName: string;
  password: string;
  hasError: false;
  errorMessage : string;

  constructor(){
    axios.get('http://api.ipify.org/?format=jsonp').then(function(result) {
      let ipVar = result.data;
      let num = ipVar.indexOf(":");
      let num2 = ipVar.indexOf("\"});");
      ipVar = ipVar.slice(num+2,num2);
      console.log(ipVar);
      let captcha = axios.get('https://localhost:8080/captcha');
    },  function(e) {
      alert("error");
   }); 
  }
}
