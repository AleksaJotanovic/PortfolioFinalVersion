import { Injectable } from '@angular/core';
import { Configurator } from '../../../models/configurator.model';
import { configurator, LOCAL_VAR } from '../../../constants/configurator';

@Injectable({
  providedIn: 'root'
})


export class ConfiguratorService {

  constructor() { }



  setConfigurator(configurator: Configurator) {
    localStorage.setItem(LOCAL_VAR, JSON.stringify(configurator));
  }

  getConfigurator(): Configurator {
    const data = localStorage.getItem(LOCAL_VAR);
    return data ? JSON.parse(data) : configurator;
  }

  get configuratorExists(): boolean {
    if (localStorage.getItem(LOCAL_VAR)) {
      return true;
    } else {
      return false;
    }
  }

  removeConfigurator() {
    localStorage.removeItem(LOCAL_VAR);
  }






}
