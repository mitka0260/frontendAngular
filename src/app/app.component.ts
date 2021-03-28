import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AppService} from './app.service';
import {WeatherData} from './weatherdata';
import {Message} from './message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'frontendAngular';
  form1!: FormGroup;
  form2!: FormGroup;
  form3!: FormGroup;
  form4!: FormGroup;

  sub1!: Subscription;
  sub2!: Subscription;

  messageAdd!: Message;
  messageDelete = '';

  showAllData = true;
  showCityData = true;

  weatherData!: WeatherData[];
  cityWeatherData: WeatherData[] = [];

  constructor(private http: HttpClient, private appService: AppService) {
  }

  ngOnDestroy(): void {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.form1 = new FormGroup({
      city: new FormControl('')
    });
    this.form2 = new FormGroup({});
    this.form3 = new FormGroup({
      cityShow: new FormControl('')
    });
    this.form4 = new FormGroup({
      cityDelete: new FormControl('')
    });
  }

  addCity(): void {
    // TODO use post-method
    this.http.get<any>('http://localhost:8080?city=' + this.form1.value.city).subscribe(data => {
      this.messageAdd = data.message;
    });
  }

  getAllWeatherData(): void {
    this.sub1 = this.appService.getAllWeatherData()
      .subscribe(data => {
        this.weatherData = data;
      });
  }

  getCityWeatherData(city?: string): void {
    if (!city) {
      this.sub2 = this.appService.getCityWeatherData(this.form3.value.cityShow)
        .subscribe(data => {
          this.cityWeatherData = data;
        });
    } else {
      this.sub2 = this.appService.getCityWeatherData(city)
        .subscribe(data => {
          this.cityWeatherData = data;
        });
    }
  }

  deleteCityWeatherData(): void {
    this.http.get<Message>(encodeURI('http://localhost:8080/deleteCity?city=' + encodeURI(this.form4.value.cityDelete)))
      .subscribe(data => {
        this.messageDelete = data.message;
      });

    // TODO next code should not run if typed city not in database
    // or TODO select+option to choose what city delete
    setTimeout(() => {
      this.getCityWeatherData(encodeURI(this.form4.value.cityDelete));
      this.getAllWeatherData();
    }, 200);
  }
}
