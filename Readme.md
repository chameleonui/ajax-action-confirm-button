
# ajax-action-confirm-button

Simple and variable ajax multistate button component. Works under patter to confirm action. 
You can specify classes, inner html and title for every state. You can even specify callback function for xhrResponse to evaluate error or success. Same it is for other options, there you can set variable or function.

Button is firing few events - `request`, `response`, `success` and `error` - which you can use to call or evaluate other scripts.

## Installation

Install with [component(1)](http://component.io):

```sh
$ component install chameleonui/action-confirm-button
```

## API

ToDo...

```js
var AjaxActionConfirmButton = require('ajax-action-confirm-button');

var AjaxActionConfirmButtonConstructor = function(element) {

    var istance = new AjaxActionConfirmButton(element, {
        url: function() {
            return element.href;
        },
        callback: function (xhrResponse) {
            return xhrResponse.status === 200;
        },
        states: {
            success: {
                content: 'Yeah Success!',
            }
        }
    });

    istance.on('request', function() {
    });

    istance.on('response', function() {
    });

    istance.on('error', function() {
        console.log(this.element, this.response);
    });

    istance.on('success', function() {
        console.log(this.element, this.response);
    });

};
```


## Author(s)

[Edgedesign s.r.o.](http://www.edgedesing.cz) – [Daniel Sitek](https://github.com/danielsitek)

## License

The MIT License (MIT)

Copyright © 2013 Edgedesign s.r.o.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.