"use strict;"

/**********************************************************************
 * Copyright 2022 Paul Reeve <preeve@pdjr.eu>
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you
 * may not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

const bonjour = require('bonjour')();

const Delta = require('signalk-libdelta');
const Notification = require('signalk-libnotification');

module.exports = class App {

  constructor(app, id) {
    this.app = app;
    this.delta = new Delta(app, id);
    this.notification = new Notification(app);
  }

  notify(path, value, sourceId) {
    var notificationPath = (path.startsWith("notifications."))?path:("notifications." + path);
    if (value !== null) value = this.notification.makeNotification(path, value);
    this.delta.clear().addValue(notificationPath, value).commit().clear();
    return((value)?value.id:null);
  }

  static async findServerAddress(uuid, timeout=5) {
    var serverAddress = null;
    return(await new Promise((resolve, reject) => {
      bonjour.find({ type: 'https' }, (service) => {
        if (service.txt.self === uuid) serverAddress = "https://" + service.addresses[0] + ":" + service.port;
      });
  
      setTimeout(() => {                                  // wait for 5 seconds, then...
        if (serverAddress != null) {
          resolve(serverAddress);
        } else {
          bonjour.find({ type: "http" }, (service) => {
            if (service.txt.self === uuid) serverAddress = "http://" + service.addresses[0] + ":" + service.port;
          });
          setTimeout(() => {                              // wait for 5 seconds, then...
            bonjour.destroy();
            resolve(serverAddress);                            // destroy bonjour instance
          }, timeout * 1000);    
        }
      }, (timeout * 1000));
    }).then(() => {
      return(serverAddress);
    }));
  }

  static async getApiVersion(serverAddress) {
    var apiVersion = null;
    return(await new Promise((resolve, reject) => {
      fetch(`${serverAddress}/signalk`, { method: 'GET' }).then((response) => {
        if (response.status == 200) {
          response.json().then((json) => {
            resolve(apiVersion = Object.keys(json.endpoints)[0]);
          })
        }
      })
    }).then(() => {
      return(apiVersion);
    }));
    
  }
  
}
