// shared.service

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private value: string;
  listeners = [];

  constructor() {
    this.value = '';
  }

  onDataChange(fn) {
    this.listeners.push(fn);
  }

  set setData(value: string) {
    this.value = value;
    this.listeners.forEach((fn) => {
      fn(value);
    });
  }
}