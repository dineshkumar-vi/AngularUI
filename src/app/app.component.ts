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
      axios.post('http://localhost:8080/captcha', { ipAddress: ipVar}).then(function (response) {
        this.captcha  = response.data.captcha;
      }).catch(function (error) {
        console.log(error);
      });
    },  function(e) {
      alert("error");
   }); 
  }
}
