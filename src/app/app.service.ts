import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {WeatherData} from './weatherdata';


@Injectable({providedIn: 'root'})
export class AppService {

  constructor(private http: HttpClient) {}

  getAllWeatherData(): Observable<WeatherData[]> {
    return this.http.get<any>('http://localhost:8080/list')
      .pipe(map(data => {
        const weatherList = data;
        return weatherList.map((weather: any) => {
          return {
            date: weather.date,
            name: weather.name,
            temp: weather.main.temp,
            wind: weather.wind.speed,
            humidity: weather.main.humidity
          };
        });
      }));
  }

  getCityWeatherData(city: string): Observable<WeatherData[]> {
    return this.http.get<any>('http://localhost:8080/showCity?city=' + encodeURI(city))
      .pipe(map(data => {
        const weatherList = data;
        return weatherList.map((weather: any) => {
          return {
            date: weather.date,
            name: weather.name,
            temp: weather.main.temp,
            wind: weather.wind.speed,
            humidity: weather.main.humidity
          };
        });
      }));
  }

}
