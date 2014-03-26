/**
 * AJAX Action - Confirm Button
 */

var $ = require('jquery');
var Emitter = require('emitter');
var MergeObjects = require('merge-objects');


var defaults = {
    confirmDelay: 500,
    method: 'GET',
    contentType: 'application/json; charset=UTF-8',
    url: function() {
        return "/action-confirm-button";
    },
    data: function() {
        return window.encodeURIComponent('data');
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
        waiting: {
            content: '<i class="fa fa-spinner fa-spin"></i>',
            classes: 'button-disabled',
            title: 'Waiting State'
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
    this.active = 0;
    this.actionStateInnerHtml;
    this.actionStateTitle;

    this._init();
}


module.exports = AjaxActionConfirmButton;

Emitter(AjaxActionConfirmButton.prototype);


AjaxActionConfirmButton.prototype._init = function() {
    
    var component = this;

    component._setDefaults();

    component._stateChange('waiting');
};

AjaxActionConfirmButton.prototype._click = function(fn) {

    var component = this;

    component.element.onclick = function(event) {
        fn(event);
        return false;
    };
};

AjaxActionConfirmButton.prototype._stateChange = function(newStateName) {
    
    var component = this;

    if (component.options.states[newStateName]) {

        component.element.setAttribute('class', component.options.states[newStateName].classes);
        component.element.setAttribute('title', component.options.states[newStateName].title);
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
        component.actionStateInnerHtml = component.element.innerHTML;
    }
    if (component.element.title) {
        component.actionStateTitle = component.element.title;
    }
};

AjaxActionConfirmButton.prototype._getDefaults = function() {
    
    var component = this;

    if (component.actionStateInnerHtml) {
        component.element.innerHTML = component.actionStateInnerHtml;
    }
    if (component.actionStateTitle) {
        component.element.title = component.actionStateTitle;
    }
};

// States functions
AjaxActionConfirmButton.prototype.action = function() {
    
    var component = this;

    // if saved, get saved defaults
    component._getDefaults();

    component._click(function() {

        component._stateChange('waiting');
    });
};

AjaxActionConfirmButton.prototype.waiting = function() {
    
    var component = this;

    component._click(function(){});

    setTimeout(function() {

        component._stateChange('confirm');

    }, component.options.confirmDelay);
};

AjaxActionConfirmButton.prototype.confirm = function() {
    
    var component = this;

    component._click(function() {

        component._stateChange('loading');
    });
};

AjaxActionConfirmButton.prototype.loading = function() {
    
    var component = this;

    component._click(function(){});

    component._XHRrequest();
};

AjaxActionConfirmButton.prototype.error = function() {
    
    var component = this;

    component._click(function() {

        component._stateChange('action');
    });
};

AjaxActionConfirmButton.prototype.success = function() {
    
    var component = this;

    component._click(function() {

        component._stateChange('action');
    });
};


AjaxActionConfirmButton.prototype._XHRrequest = function() {
    
    var component = this;

    component.active = 1;

    component.emit('request');

    var xhrOptions = {
        method: component.options.method,
        contentType: component.options.contentType,
        url: component.options.url(),
        data: component.options.data()
    };

    component._xhr(xhrOptions, function(xhr) {

        component.response = xhr;
        component._XHRresponse();
    });
};

AjaxActionConfirmButton.prototype._XHRresponse = function() {
    
    var component = this;

    component.active = 0;

    if ( component.options.callback(component.response) ) {

        component._stateChange('success');
        component.emit('success');

    } else {

        component._stateChange('error');
        component.emit('error');
    }

    component.emit('response');
};

AjaxActionConfirmButton.prototype._xhr = function(options, resFn) {

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
