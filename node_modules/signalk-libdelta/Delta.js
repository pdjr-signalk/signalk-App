
/**********************************************************************
 * Copyright 2020 Paul Reeve <preeve@pdjr.eu>
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you
 * may not use this file except in compliance with the License. You
 * may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

const crypto = require('crypto');

module.exports = class Delta {

  constructor(app, source) {
    this.app = app;
    this.source = source;
    this.values = [];
    this.metas = [];
  }

  clear() {
    this.values = [];
    this.metas = [];
    return(this);
  }

  addValue(path, value) {
    this.values.push({ "path": path, "value": value });
    return(this);
  }

  addValues(values) {
    values.forEach(v => this.addValue(v.path, v.value));
    return(this);
  }

  addMeta(path, value) {
    this.metas.push({ "path": path, "value": value });
    return(this);
  }

  addMetas(values) {
    values.forEach(v => this.addMeta(v.path, v.value));
    return(this);
  }

  notify(path, value, sourceId) {
    var id = (value.id) || crypto.randomUUID();
    value.id = id;
    value.path = path;
    value.data = app.getSelfPath(path);
    value.actions = [];
    this.addValue(path, value).commit().clear();
    return(id);
  }

  count() {
    return(this.values.length + this.metas.length);
  }

  commit(dump=0) {
    if ((this.values.length) || (this.metas.length)) {
      var delta = { updates: [ ] };
      if (this.values.length) {
        delta.updates.push({ source: { type: "plugin", src: this.source }, timestamp: (new Date()).toISOString(), values: this.values });
      }
      if (this.metas.length) {
        delta.updates.push({ meta: this.metas });
      }
      this.app.handleMessage(this.source, delta);
      if (dump != 0) console.log(JSON.stringify(delta));
    }
    return(this);
  }

  dump() {
     this.commit(2);
  }

}
