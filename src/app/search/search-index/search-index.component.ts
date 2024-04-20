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
  serviceTypesArray = Object.values(serviceTypes);

  private stores: { id: number, name: string; services: serviceTypes[], latitude: number, longitude: number }[] = [
    { id: 1, name: 'Mi e Su Full Care', services: [0, 1, 2, 3], latitude: -12.820235, longitude: -38.395557 },
    { id: 2, name: 'Salão Cleide', services: [0, 1], latitude: 12.8257910, longitude: -38.3914233 },
    { id: 3, name: 'Mário S23 care', services: [0], latitude: -12.8251234, longitude: -38.4041506 },
    { id: 4, name: 'Cassioto Salão', services: [0, 1, 2, 3], latitude: -12.8250009, longitude: -38.4048743 },
    { id: 5, name: 'Salão aniversário', services: [], latitude: -12.8257102, longitude: -38.4041032 },
    { id: 6, name: 'Care Care', services: [2, 3], latitude: -12.8257000, longitude: -38.4041000 }
  ]

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
      zoomControl: false,
    }).setView([this.latitude, this.longitude], this.initialZoom);

    let customIcon = L.icon({
      iconUrl: './../../assets/icons/markers/store-solid.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    this.stores.forEach((x) => {
      let marker = L.marker({ lat: x.latitude, lng: x.longitude }, { icon: customIcon})
                    .addTo(map)
                    .bindPopup(x.name);

      marker.on('click', () => {
        map.setView([x.latitude, x.longitude], this.initialZoom);
      });
    })

    L.control.zoom({
      zoomInTitle: 'Aproximar',
      zoomOutTitle: 'Afastar',
      position: 'topright'
    }).addTo(map);

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

export enum serviceTypes {
  haircolor = 0,
  haircut = 1,
  makeup = 2,
  skincare = 3
}