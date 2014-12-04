## v1

### 1.2.0

* Created v1.2.0

### 1.1.1

* Fixed jQuery dependency in component.json to `"components/jquery": "1.11"`
* Fixed link to api on Apiary.io
* Added statusText from apiary to console.log on success requests

### 1.1.0

* Set up to require jQuery library > v2 for compatibility for older IE's
* Renamed `waiting` state to `delay`
* Updated and testet ability to use both POST and GET methods
* Updated options, `method`, `contentType`, `url` and `data` now can be set in options as function or as variable
* added `event.preventDefault()`
* created global flag `window.activeAJAX`
* emited actual state name

### 1.0.0

* First public release