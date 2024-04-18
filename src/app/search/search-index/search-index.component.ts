import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-search-index',
  templateUrl: './search-index.component.html',
  styleUrl: './search-index.component.scss'
})
export class SearchIndexComponent implements OnInit {
  map: any;
  latitude: number;
  longitude: number;
  initialZoom: number;
  minZoom: number;
  maxZoom: number;

  async getUserGeolocation() {
    return new Promise<void>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          
          resolve(); 
        },
        (error) => {
          reject(error); 
        }
      );
    });
  }

  async initMap() {
    await this.getUserGeolocation();

    const map = L.map('map', {
     minZoom: this.minZoom,
     maxZoom: this.maxZoom,
    }).setView([this.latitude, this.longitude], this.initialZoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  }

  constructor() { 
    this.initialZoom = 14;
    this.minZoom = 11;
    this.maxZoom = 18;
  }

  ngOnInit(): void {
    this.initMap();
  }
}
