/**
 * AJAX Action Confirm Button
 *
 * version: v1.2.0
 * author: Daniel Sitek
 */

var $ = require('jquery');
var Emitter = require('emitter');
var MergeObjects = require('merge-objects');


var defaults = {
    confirmDelay: 500,
    method: 'GET',
    contentType: 'text/plain; charset=UTF-8',
    url: '/action-confirm-button',
    data: function() {
        return window.encodeURIComponent('name') + '=' + window.encodeURIComponent('value');
    },
    callback: function (xhrResponse) {
        return xhrResponse.status >= 200 && xhrResponse.status <= 399;
    },
    states: {
        action: {
            content: 'Button Action',
            classes: 'button-default',
            title: 'Action State'
        },
        delay: {
            content: '<i class="fa fa-spinner fa-spin"></i>',
            classes: 'button-disabled',
            title: 'Hold-on State'
        },
        confirm: {
            content: 'Button Confirm',
            classes: 'button-primary',
            title: 'Confirm State'
        },
        loading: {
            content: '<i class="fa fa-spinner fa-spin"></i>',
            classes: 'button-disabled',
            title: 'XHR request State'
        },
        error: {
            content: 'Error',
            classes: 'button-default',
            title: 'Error State'
        },
        success: {
            content: 'Success',
            classes: 'button-default',
            title: 'Success State'
        }
    }
};


function AjaxActionConfirmButton(element, options) {

    this.options = new MergeObjects(options || {}, defaults);
    this.element = element;
    this.response = {};
    this.localActionState = {};

    // create global flag activeAJAX
    window.activeAJAX = 0;

    this._init();
}


module.exports = AjaxActionConfirmButton;

Emitter(AjaxActionConfirmButton.prototype);


AjaxActionConfirmButton.prototype._init = function() {

    var component = this;

    component._setDefaults();

    component.emit('action');

    component._stateChange('delay');
};

AjaxActionConfirmButton.prototype._click = function(fn) {

    var component = this;

    component.element.onclick = function(event) {
        event.preventDefault();
        fn(event);
        return false;
    };
};

AjaxActionConfirmButton.prototype._stateChange = function(newStateName) {

    var component = this;

    if (component.options.states[newStateName]) {

        component.element.setAttribute('class', component.options.states[newStateName].classes);
        component.element.title = component.options.states[newStateName].title;
        component.element.innerHTML = component.options.states[newStateName].content;

        component[newStateName]();

    } else {

        throw 'State: ' + newStateName + ' does not exist';
    }
};

// Get and Set default inner html and title, which can rewrite settings in global options
AjaxActionConfirmButton.prototype._setDefaults = function() {

    var component = this;

    if (component.element.innerHTML) {
        component.localActionState.content = component.element.innerHTML;
    }
    if (component.element.title) {
        component.localActionState.title = component.element.title;
    }
    component.localActionState.classes = component.element.getAttribute('class');
};

AjaxActionConfirmButton.prototype._getDefaults = function() {

    var component = this;

    if (component.localActionState.content) {
        component.element.innerHTML = component.localActionState.content;
    }
    if (component.localActionState.title) {
        component.element.title = component.localActionState.title;
    }
    if (component.localActionState.classes) {
        component.element.setAttribute('class', component.localActionState.classes);
    }
};

// States functions
AjaxActionConfirmButton.prototype.action = function() {

    var component = this;

    // if saved, get saved defaults
    component._getDefaults();

    component.emit('action');

    component._click(function(event) {

        event.preventDefault();
        component._stateChange('delay');
        return false;
    });
};

AjaxActionConfirmButton.prototype.delay = function() {

    var component = this;

    component.emit('delay');

    component._click(function(event){ event.preventDefault(); return false; });

    setTimeout(function() {

        component._stateChange('confirm');

    }, component.options.confirmDelay);
};

AjaxActionConfirmButton.prototype.confirm = function() {

    var component = this;

    component.emit('confirm');

    component._click(function(event) {

        event.preventDefault();
        component._stateChange('loading');
        return false;
    });
};

AjaxActionConfirmButton.prototype.loading = function() {

    var component = this;

    component.emit('loading');

    component._click(function(event){ event.preventDefault(); return false; });

    component._XHRrequest();
};

AjaxActionConfirmButton.prototype.error = function() {

    var component = this;

    component.emit('error');

    component._click(function(event) {

        event.preventDefault();
        component._stateChange('action');
        return false;
    });
};

AjaxActionConfirmButton.prototype.success = function() {

    var component = this;

    component.emit('success');

    component._click(function(event) {

        event.preventDefault();
        component._stateChange('action');
        return false;
    });
};


AjaxActionConfirmButton.prototype._XHRrequest = function() {

    var component = this;

    window.activeAJAX = 1;

    component.emit('request');

    var xhrOptions = {
        method:         typeof component.options.method === 'function' ?        component.options.method()      : component.options.method,
        contentType:    typeof component.options.contentType === 'function' ?   component.options.contentType() : component.options.contentType,
        url:            typeof component.options.url === 'function' ?           component.options.url()         : component.options.url,
        data:           typeof component.options.data === 'function' ?          component.options.data()        : component.options.data
    };

    component._xhr(xhrOptions, function(xhr) {

        component.response = xhr;
        component._XHRresponse();
    });
};

AjaxActionConfirmButton.prototype._XHRresponse = function() {

    var component = this;

    if ( component.options.callback(component.response) ) {

        component._stateChange('success');

    } else {

        component._stateChange('error');
    }

    window.activeAJAX = 0;

    component.emit('response');
};

AjaxActionConfirmButton.prototype._xhr = function(options, resFn) {

    // Still using jQuery's AJAX.. i'm planing to chanage it to some simpler xhr component
    $.ajax({
        type: options.method,
        url: options.url,
        data: options.data,
        contentType: options.contentType
    })
    .done(function(data, textStatus, jqXHR) {
        resFn(jqXHR);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        resFn(jqXHR);
    });
};
