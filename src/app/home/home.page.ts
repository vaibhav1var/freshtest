import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Platform } from '@ionic/angular';

import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';

interface Coordinates {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit{
  
  private data: Coordinates[];
  private loc : String;
  private Counter: Number;
  constructor(private backgroundGeolocation: BackgroundGeolocation, public platform: Platform) {
    
   }
  
  ngOnInit() {
    console.log("------------------------>inside home");
    this.data = [];
    this.loc = "no loc";
    if(this.platform.is("cordova")){
      this.platform.ready().then(() =>
        this.startBackgroundGeolocation()
      )
    }
    this.data.push({lat:22,lng:2322});
  }
  startBackgroundGeolocation() {
    console.log("------------------------->hello");
  const config: BackgroundGeolocationConfig = {
    desiredAccuracy: 10,
    stationaryRadius: 20,
    distanceFilter: 30,
    interval: 60000, // <!-- poll for position every minute
    fastestInterval: 120000,
    debug: true, //  enable this hear sounds for background-geolocation life-cycle.
    stopOnTerminate: false, // enable this to clear background location settings when the app terminates
  };
  console.log("==============================",this.backgroundGeolocation);
  this.backgroundGeolocation.configure(config)
  .then(() => {
    this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
      console.log("------------------------------->this is location",JSON.stringify(location));
      console.log("________> Data",this.data);
      this.data.push({lat:location.latitude,lng:location.latitude});
      console.log("________> Data",this.data);
      this.data.push({lat:33,lng:44});
      this.loc = JSON.stringify(Location);
      // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
      // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
      // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
      // this.backgroundGeolocation.finish(); // FOR IOS ONLY
    });
    this.backgroundGeolocation.on(BackgroundGeolocationEvents.stationary).subscribe((location: BackgroundGeolocationResponse) => {
      // BackgroundGeolocation.on('stationary', function(stationaryLocation) {
      // handle stationary locations here
      console.log("------------------------------->this is static  location",JSON.stringify(location));
      console.log("________> Data",this.data);
      this.data.push({lat:location.latitude,lng:location.latitude});
    });

    this.backgroundGeolocation.on(BackgroundGeolocationEvents.error).subscribe((location: BackgroundGeolocationResponse) => {
      // BackgroundGeolocation.on('stationary', function(stationaryLocation) {
      // handle stationary locations here
      console.log("------------------------------->this is error",location);
    });
    
    this.backgroundGeolocation.on(BackgroundGeolocationEvents.start).subscribe((location: BackgroundGeolocationResponse) => {
      // BackgroundGeolocation.on('stationary', function(stationaryLocation) {
      // handle stationary locations here
      console.log("------------------------------->this is stART");
    });

    this.backgroundGeolocation.on(BackgroundGeolocationEvents.stop).subscribe((location: BackgroundGeolocationResponse) => {
      // BackgroundGeolocation.on('stationary', function(stationaryLocation) {
      // handle stationary locations here
      console.log('--------------------------------->[INFO] BackgroundGeolocation service has been stopped');
    });
  });

// start recording location
this.backgroundGeolocation.start();

// If you wish to turn OFF background-tracking, call the #stop method.
// this.backgroundGeolocation.stop();
}

}