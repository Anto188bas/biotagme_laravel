window._ = require('lodash');

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */
try {
    window.Popper = require('propper');
    window.$ = window.jQuery = require('jquery');
    require('bootstrap');
} catch (e) {}

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */
window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Next we will register the CSRF Token as a common header with Axios so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */
let token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;}
else {console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');}

/**
 * We need to create a fresh Echo instance in your application's JavaScript.
 * A great place to do this is at the bottom of the resources/js/bootstrap.js file
 * that is included with the Laravel framework:
 */
import Echo from "laravel-echo"
window.io = require('socket.io-client');

if(typeof(window.io) != 'undefined'){ //check if io loaded
    //init Echo
    window.Echo = new Echo({
        broadcaster: 'socket.io',
        host: window.location.hostname + ':6001'
    });
    //bind our events
    window.Echo.connector.socket.on('connect', function(){
        console.log('connected', window.Echo.socketId());
    });
    window.Echo.connector.socket.on('disconnect', function(){
        console.log('disconnected');
    });
    window.Echo.connector.socket.on('reconnecting', function(attemptNumber){
        console.log('reconnecting', attemptNumber);
    });
}
