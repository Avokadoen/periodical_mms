!function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(r,i,function(e){return t[e]}.bind(null,i));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";n.r(e);
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)};function i(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}function o(t){return"function"==typeof t}var s=!1,u={Promise:void 0,set useDeprecatedSynchronousErrorHandling(t){t&&(new Error).stack;s=t},get useDeprecatedSynchronousErrorHandling(){return s}};function c(t){setTimeout((function(){throw t}),0)}var a={closed:!0,next:function(t){},error:function(t){if(u.useDeprecatedSynchronousErrorHandling)throw t;c(t)},complete:function(){}},l=function(){return Array.isArray||function(t){return t&&"number"==typeof t.length}}();function h(t){return null!==t&&"object"==typeof t}var p=function(){function t(t){return Error.call(this),this.message=t?t.length+" errors occurred during unsubscription:\n"+t.map((function(t,e){return e+1+") "+t.toString()})).join("\n  "):"",this.name="UnsubscriptionError",this.errors=t,this}return t.prototype=Object.create(Error.prototype),t}(),f=function(){function t(t){this.closed=!1,this._parentOrParents=null,this._subscriptions=null,t&&(this._unsubscribe=t)}return t.prototype.unsubscribe=function(){var e;if(!this.closed){var n=this._parentOrParents,r=this._unsubscribe,i=this._subscriptions;if(this.closed=!0,this._parentOrParents=null,this._subscriptions=null,n instanceof t)n.remove(this);else if(null!==n)for(var s=0;s<n.length;++s){n[s].remove(this)}if(o(r))try{r.call(this)}catch(t){e=t instanceof p?d(t.errors):[t]}if(l(i)){s=-1;for(var u=i.length;++s<u;){var c=i[s];if(h(c))try{c.unsubscribe()}catch(t){e=e||[],t instanceof p?e=e.concat(d(t.errors)):e.push(t)}}}if(e)throw new p(e)}},t.prototype.add=function(e){var n=e;if(!e)return t.EMPTY;switch(typeof e){case"function":n=new t(e);case"object":if(n===this||n.closed||"function"!=typeof n.unsubscribe)return n;if(this.closed)return n.unsubscribe(),n;if(!(n instanceof t)){var r=n;(n=new t)._subscriptions=[r]}break;default:throw new Error("unrecognized teardown "+e+" added to Subscription.")}var i=n._parentOrParents;if(null===i)n._parentOrParents=this;else if(i instanceof t){if(i===this)return n;n._parentOrParents=[i,this]}else{if(-1!==i.indexOf(this))return n;i.push(this)}var o=this._subscriptions;return null===o?this._subscriptions=[n]:o.push(n),n},t.prototype.remove=function(t){var e=this._subscriptions;if(e){var n=e.indexOf(t);-1!==n&&e.splice(n,1)}},t.EMPTY=function(t){return t.closed=!0,t}(new t),t}();function d(t){return t.reduce((function(t,e){return t.concat(e instanceof p?e.errors:e)}),[])}var y=function(){return"function"==typeof Symbol?Symbol("rxSubscriber"):"@@rxSubscriber_"+Math.random()}(),b=function(t){function e(n,r,i){var o=t.call(this)||this;switch(o.syncErrorValue=null,o.syncErrorThrown=!1,o.syncErrorThrowable=!1,o.isStopped=!1,arguments.length){case 0:o.destination=a;break;case 1:if(!n){o.destination=a;break}if("object"==typeof n){n instanceof e?(o.syncErrorThrowable=n.syncErrorThrowable,o.destination=n,n.add(o)):(o.syncErrorThrowable=!0,o.destination=new v(o,n));break}default:o.syncErrorThrowable=!0,o.destination=new v(o,n,r,i)}return o}return i(e,t),e.prototype[y]=function(){return this},e.create=function(t,n,r){var i=new e(t,n,r);return i.syncErrorThrowable=!1,i},e.prototype.next=function(t){this.isStopped||this._next(t)},e.prototype.error=function(t){this.isStopped||(this.isStopped=!0,this._error(t))},e.prototype.complete=function(){this.isStopped||(this.isStopped=!0,this._complete())},e.prototype.unsubscribe=function(){this.closed||(this.isStopped=!0,t.prototype.unsubscribe.call(this))},e.prototype._next=function(t){this.destination.next(t)},e.prototype._error=function(t){this.destination.error(t),this.unsubscribe()},e.prototype._complete=function(){this.destination.complete(),this.unsubscribe()},e.prototype._unsubscribeAndRecycle=function(){var t=this._parentOrParents;return this._parentOrParents=null,this.unsubscribe(),this.closed=!1,this.isStopped=!1,this._parentOrParents=t,this},e}(f),v=function(t){function e(e,n,r,i){var s,u=t.call(this)||this;u._parentSubscriber=e;var c=u;return o(n)?s=n:n&&(s=n.next,r=n.error,i=n.complete,n!==a&&(o((c=Object.create(n)).unsubscribe)&&u.add(c.unsubscribe.bind(c)),c.unsubscribe=u.unsubscribe.bind(u))),u._context=c,u._next=s,u._error=r,u._complete=i,u}return i(e,t),e.prototype.next=function(t){if(!this.isStopped&&this._next){var e=this._parentSubscriber;u.useDeprecatedSynchronousErrorHandling&&e.syncErrorThrowable?this.__tryOrSetError(e,this._next,t)&&this.unsubscribe():this.__tryOrUnsub(this._next,t)}},e.prototype.error=function(t){if(!this.isStopped){var e=this._parentSubscriber,n=u.useDeprecatedSynchronousErrorHandling;if(this._error)n&&e.syncErrorThrowable?(this.__tryOrSetError(e,this._error,t),this.unsubscribe()):(this.__tryOrUnsub(this._error,t),this.unsubscribe());else if(e.syncErrorThrowable)n?(e.syncErrorValue=t,e.syncErrorThrown=!0):c(t),this.unsubscribe();else{if(this.unsubscribe(),n)throw t;c(t)}}},e.prototype.complete=function(){var t=this;if(!this.isStopped){var e=this._parentSubscriber;if(this._complete){var n=function(){return t._complete.call(t._context)};u.useDeprecatedSynchronousErrorHandling&&e.syncErrorThrowable?(this.__tryOrSetError(e,n),this.unsubscribe()):(this.__tryOrUnsub(n),this.unsubscribe())}else this.unsubscribe()}},e.prototype.__tryOrUnsub=function(t,e){try{t.call(this._context,e)}catch(t){if(this.unsubscribe(),u.useDeprecatedSynchronousErrorHandling)throw t;c(t)}},e.prototype.__tryOrSetError=function(t,e,n){if(!u.useDeprecatedSynchronousErrorHandling)throw new Error("bad call");try{e.call(this._context,n)}catch(e){return u.useDeprecatedSynchronousErrorHandling?(t.syncErrorValue=e,t.syncErrorThrown=!0,!0):(c(e),!0)}return!1},e.prototype._unsubscribe=function(){var t=this._parentSubscriber;this._context=null,this._parentSubscriber=null,t.unsubscribe()},e}(b);var m=function(){return"function"==typeof Symbol&&Symbol.observable||"@@observable"}();function _(t){return t}function g(t){return 0===t.length?_:1===t.length?t[0]:function(e){return t.reduce((function(t,e){return e(t)}),e)}}var w=function(){function t(t){this._isScalar=!1,t&&(this._subscribe=t)}return t.prototype.lift=function(e){var n=new t;return n.source=this,n.operator=e,n},t.prototype.subscribe=function(t,e,n){var r=this.operator,i=function(t,e,n){if(t){if(t instanceof b)return t;if(t[y])return t[y]()}return t||e||n?new b(t,e,n):new b(a)}(t,e,n);if(r?i.add(r.call(i,this.source)):i.add(this.source||u.useDeprecatedSynchronousErrorHandling&&!i.syncErrorThrowable?this._subscribe(i):this._trySubscribe(i)),u.useDeprecatedSynchronousErrorHandling&&i.syncErrorThrowable&&(i.syncErrorThrowable=!1,i.syncErrorThrown))throw i.syncErrorValue;return i},t.prototype._trySubscribe=function(t){try{return this._subscribe(t)}catch(e){u.useDeprecatedSynchronousErrorHandling&&(t.syncErrorThrown=!0,t.syncErrorValue=e),!function(t){for(;t;){var e=t,n=e.closed,r=e.destination,i=e.isStopped;if(n||i)return!1;t=r&&r instanceof b?r:null}return!0}(t)?console.warn(e):t.error(e)}},t.prototype.forEach=function(t,e){var n=this;return new(e=E(e))((function(e,r){var i;i=n.subscribe((function(e){try{t(e)}catch(t){r(t),i&&i.unsubscribe()}}),r,e)}))},t.prototype._subscribe=function(t){var e=this.source;return e&&e.subscribe(t)},t.prototype[m]=function(){return this},t.prototype.pipe=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return 0===t.length?this:g(t)(this)},t.prototype.toPromise=function(t){var e=this;return new(t=E(t))((function(t,n){var r;e.subscribe((function(t){return r=t}),(function(t){return n(t)}),(function(){return t(r)}))}))},t.create=function(e){return new t(e)},t}();function E(t){if(t||(t=u.Promise||Promise),!t)throw new Error("no Promise impl found");return t}function x(t,e){return function(n){if("function"!=typeof t)throw new TypeError("argument is not a function. Are you looking for `mapTo()`?");return n.lift(new S(t,e))}}var S=function(){function t(t,e){this.project=t,this.thisArg=e}return t.prototype.call=function(t,e){return e.subscribe(new I(t,this.project,this.thisArg))},t}(),I=function(t){function e(e,n,r){var i=t.call(this,e)||this;return i.project=n,i.count=0,i.thisArg=r||i,i}return i(e,t),e.prototype._next=function(t){var e;try{e=this.project.call(this.thisArg,t,this.count++)}catch(t){return void this.destination.error(t)}this.destination.next(e)},e}(b);function T(t,e,n,r){return o(n)&&(r=n,n=void 0),r?T(t,e,n).pipe(x((function(t){return l(t)?r.apply(void 0,t):r(t)}))):new w((function(r){!function t(e,n,r,i,o){var s;if(function(t){return t&&"function"==typeof t.addEventListener&&"function"==typeof t.removeEventListener}(e)){var u=e;e.addEventListener(n,r,o),s=function(){return u.removeEventListener(n,r,o)}}else if(function(t){return t&&"function"==typeof t.on&&"function"==typeof t.off}(e)){var c=e;e.on(n,r),s=function(){return c.off(n,r)}}else if(function(t){return t&&"function"==typeof t.addListener&&"function"==typeof t.removeListener}(e)){var a=e;e.addListener(n,r),s=function(){return a.removeListener(n,r)}}else{if(!e||!e.length)throw new TypeError("Invalid event target");for(var l=0,h=e.length;l<h;l++)t(e[l],n,r,i,o)}i.add(s)}(t,e,(function(t){arguments.length>1?r.next(Array.prototype.slice.call(arguments)):r.next(t)}),r,n)}))}function N(t){return t&&"function"==typeof t.schedule}var O=function(t){return function(e){for(var n=0,r=t.length;n<r&&!e.closed;n++)e.next(t[n]);e.complete()}};function k(t,e){return new w((function(n){var r=new f,i=0;return r.add(e.schedule((function(){i!==t.length?(n.next(t[i++]),n.closed||r.add(this.schedule())):n.complete()}))),r}))}function j(t,e){return e?k(t,e):new w(O(t))}function A(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n=t[t.length-1];return N(n)?(t.pop(),k(t,n)):j(t)}var M=function(t){function e(e,n,r){var i=t.call(this)||this;return i.parent=e,i.outerValue=n,i.outerIndex=r,i.index=0,i}return i(e,t),e.prototype._next=function(t){this.parent.notifyNext(this.outerValue,t,this.outerIndex,this.index++,this)},e.prototype._error=function(t){this.parent.notifyError(t,this),this.unsubscribe()},e.prototype._complete=function(){this.parent.notifyComplete(this),this.unsubscribe()},e}(b);function H(){return"function"==typeof Symbol&&Symbol.iterator?Symbol.iterator:"@@iterator"}var L=H(),P=function(t){return t&&"number"==typeof t.length&&"function"!=typeof t};function B(t){return!!t&&"function"!=typeof t.subscribe&&"function"==typeof t.then}var V=function(t){if(t&&"function"==typeof t[m])return r=t,function(t){var e=r[m]();if("function"!=typeof e.subscribe)throw new TypeError("Provided object does not correctly implement Symbol.observable");return e.subscribe(t)};if(P(t))return O(t);if(B(t))return n=t,function(t){return n.then((function(e){t.closed||(t.next(e),t.complete())}),(function(e){return t.error(e)})).then(null,c),t};if(t&&"function"==typeof t[L])return e=t,function(t){for(var n=e[L]();;){var r=n.next();if(r.done){t.complete();break}if(t.next(r.value),t.closed)break}return"function"==typeof n.return&&t.add((function(){n.return&&n.return()})),t};var e,n,r,i=h(t)?"an invalid object":"'"+t+"'";throw new TypeError("You provided "+i+" where a stream was expected. You can provide an Observable, Promise, Array, or Iterable.")};function C(t,e,n,r,i){if(void 0===i&&(i=new M(t,n,r)),!i.closed)return e instanceof w?e.subscribe(i):V(e)(i)}var D=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return i(e,t),e.prototype.notifyNext=function(t,e,n,r,i){this.destination.next(e)},e.prototype.notifyError=function(t,e){this.destination.error(t)},e.prototype.notifyComplete=function(t){this.destination.complete()},e}(b);function F(t,e){if(null!=t){if(function(t){return t&&"function"==typeof t[m]}(t))return function(t,e){return new w((function(n){var r=new f;return r.add(e.schedule((function(){var i=t[m]();r.add(i.subscribe({next:function(t){r.add(e.schedule((function(){return n.next(t)})))},error:function(t){r.add(e.schedule((function(){return n.error(t)})))},complete:function(){r.add(e.schedule((function(){return n.complete()})))}}))}))),r}))}(t,e);if(B(t))return function(t,e){return new w((function(n){var r=new f;return r.add(e.schedule((function(){return t.then((function(t){r.add(e.schedule((function(){n.next(t),r.add(e.schedule((function(){return n.complete()})))})))}),(function(t){r.add(e.schedule((function(){return n.error(t)})))}))}))),r}))}(t,e);if(P(t))return k(t,e);if(function(t){return t&&"function"==typeof t[L]}(t)||"string"==typeof t)return function(t,e){if(!t)throw new Error("Iterable cannot be null");return new w((function(n){var r,i=new f;return i.add((function(){r&&"function"==typeof r.return&&r.return()})),i.add(e.schedule((function(){r=t[L](),i.add(e.schedule((function(){if(!n.closed){var t,e;try{var i=r.next();t=i.value,e=i.done}catch(t){return void n.error(t)}e?n.complete():(n.next(t),this.schedule())}})))}))),i}))}(t,e)}throw new TypeError((null!==t&&typeof t||t)+" is not observable")}function Y(t,e){return e?F(t,e):t instanceof w?t:new w(V(t))}function R(t,e,n){return void 0===n&&(n=Number.POSITIVE_INFINITY),"function"==typeof e?function(r){return r.pipe(R((function(n,r){return Y(t(n,r)).pipe(x((function(t,i){return e(n,t,r,i)})))}),n))}:("number"==typeof e&&(n=e),function(e){return e.lift(new U(t,n))})}var U=function(){function t(t,e){void 0===e&&(e=Number.POSITIVE_INFINITY),this.project=t,this.concurrent=e}return t.prototype.call=function(t,e){return e.subscribe(new q(t,this.project,this.concurrent))},t}(),q=function(t){function e(e,n,r){void 0===r&&(r=Number.POSITIVE_INFINITY);var i=t.call(this,e)||this;return i.project=n,i.concurrent=r,i.hasCompleted=!1,i.buffer=[],i.active=0,i.index=0,i}return i(e,t),e.prototype._next=function(t){this.active<this.concurrent?this._tryNext(t):this.buffer.push(t)},e.prototype._tryNext=function(t){var e,n=this.index++;try{e=this.project(t,n)}catch(t){return void this.destination.error(t)}this.active++,this._innerSub(e,t,n)},e.prototype._innerSub=function(t,e,n){var r=new M(this,e,n),i=this.destination;i.add(r);var o=C(this,t,void 0,void 0,r);o!==r&&i.add(o)},e.prototype._complete=function(){this.hasCompleted=!0,0===this.active&&0===this.buffer.length&&this.destination.complete(),this.unsubscribe()},e.prototype.notifyNext=function(t,e,n,r,i){this.destination.next(e)},e.prototype.notifyComplete=function(t){var e=this.buffer;this.remove(t),this.active--,e.length>0?this._next(e.shift()):0===this.active&&this.hasCompleted&&this.destination.complete()},e}(D);function K(t){return void 0===t&&(t=Number.POSITIVE_INFINITY),R(_,t)}function X(t,e){return e?function(n){return n.pipe(X((function(n,r){return Y(t(n,r)).pipe(x((function(t,i){return e(n,t,r,i)})))})))}:function(e){return e.lift(new $(t))}}var $=function(){function t(t){this.project=t}return t.prototype.call=function(t,e){return e.subscribe(new z(t,this.project))},t}(),z=function(t){function e(e,n){var r=t.call(this,e)||this;return r.project=n,r.hasSubscription=!1,r.hasCompleted=!1,r.index=0,r}return i(e,t),e.prototype._next=function(t){this.hasSubscription||this.tryNext(t)},e.prototype.tryNext=function(t){var e,n=this.index++;try{e=this.project(t,n)}catch(t){return void this.destination.error(t)}this.hasSubscription=!0,this._innerSub(e,t,n)},e.prototype._innerSub=function(t,e,n){var r=new M(this,e,n),i=this.destination;i.add(r);var o=C(this,t,void 0,void 0,r);o!==r&&i.add(o)},e.prototype._complete=function(){this.hasCompleted=!0,this.hasSubscription||this.destination.complete(),this.unsubscribe()},e.prototype.notifyNext=function(t,e,n,r,i){this.destination.next(e)},e.prototype.notifyError=function(t){this.destination.error(t)},e.prototype.notifyComplete=function(t){this.destination.remove(t),this.hasSubscription=!1,this.hasCompleted&&this.destination.complete()},e}(D),G=function(t){function e(e,n){var r=t.call(this,e,n)||this;return r.scheduler=e,r.work=n,r.pending=!1,r}return i(e,t),e.prototype.schedule=function(t,e){if(void 0===e&&(e=0),this.closed)return this;this.state=t;var n=this.id,r=this.scheduler;return null!=n&&(this.id=this.recycleAsyncId(r,n,e)),this.pending=!0,this.delay=e,this.id=this.id||this.requestAsyncId(r,this.id,e),this},e.prototype.requestAsyncId=function(t,e,n){return void 0===n&&(n=0),setInterval(t.flush.bind(t,this),n)},e.prototype.recycleAsyncId=function(t,e,n){if(void 0===n&&(n=0),null!==n&&this.delay===n&&!1===this.pending)return e;clearInterval(e)},e.prototype.execute=function(t,e){if(this.closed)return new Error("executing a cancelled action");this.pending=!1;var n=this._execute(t,e);if(n)return n;!1===this.pending&&null!=this.id&&(this.id=this.recycleAsyncId(this.scheduler,this.id,null))},e.prototype._execute=function(t,e){var n=!1,r=void 0;try{this.work(t)}catch(t){n=!0,r=!!t&&t||new Error(t)}if(n)return this.unsubscribe(),r},e.prototype._unsubscribe=function(){var t=this.id,e=this.scheduler,n=e.actions,r=n.indexOf(this);this.work=null,this.state=null,this.pending=!1,this.scheduler=null,-1!==r&&n.splice(r,1),null!=t&&(this.id=this.recycleAsyncId(e,t,null)),this.delay=null},e}(function(t){function e(e,n){return t.call(this)||this}return i(e,t),e.prototype.schedule=function(t,e){return void 0===e&&(e=0),this},e}(f)),W=function(){function t(e,n){void 0===n&&(n=t.now),this.SchedulerAction=e,this.now=n}return t.prototype.schedule=function(t,e,n){return void 0===e&&(e=0),new this.SchedulerAction(this,t).schedule(n,e)},t.now=function(){return Date.now()},t}(),J=new(function(t){function e(n,r){void 0===r&&(r=W.now);var i=t.call(this,n,(function(){return e.delegate&&e.delegate!==i?e.delegate.now():r()}))||this;return i.actions=[],i.active=!1,i.scheduled=void 0,i}return i(e,t),e.prototype.schedule=function(n,r,i){return void 0===r&&(r=0),e.delegate&&e.delegate!==this?e.delegate.schedule(n,r,i):t.prototype.schedule.call(this,n,r,i)},e.prototype.flush=function(t){var e=this.actions;if(this.active)e.push(t);else{var n;this.active=!0;do{if(n=t.execute(t.state,t.delay))break}while(t=e.shift());if(this.active=!1,n){for(;t=e.shift();)t.unsubscribe();throw n}}},e}(W))(G);var Q,Z=new w((function(t){return t.complete()}));function tt(t){return t?function(t){return new w((function(e){return t.schedule((function(){return e.complete()}))}))}(t):Z}function et(t){var e=t.error;t.subscriber.error(e)}Q||(Q={});var nt=function(){function t(t,e,n){this.kind=t,this.value=e,this.error=n,this.hasValue="N"===t}return t.prototype.observe=function(t){switch(this.kind){case"N":return t.next&&t.next(this.value);case"E":return t.error&&t.error(this.error);case"C":return t.complete&&t.complete()}},t.prototype.do=function(t,e,n){switch(this.kind){case"N":return t&&t(this.value);case"E":return e&&e(this.error);case"C":return n&&n()}},t.prototype.accept=function(t,e,n){return t&&"function"==typeof t.next?this.observe(t):this.do(t,e,n)},t.prototype.toObservable=function(){var t,e;switch(this.kind){case"N":return A(this.value);case"E":return t=this.error,new w(e?function(n){return e.schedule(et,0,{error:t,subscriber:n})}:function(e){return e.error(t)});case"C":return tt()}throw new Error("unexpected notification kind value")},t.createNext=function(e){return void 0!==e?new t("N",e):t.undefinedValueNotification},t.createError=function(e){return new t("E",void 0,e)},t.createComplete=function(){return t.completeNotification},t.completeNotification=new t("C"),t.undefinedValueNotification=new t("N",void 0),t}();function rt(t,e){void 0===e&&(e=J);var n,r=(n=t)instanceof Date&&!isNaN(+n)?+t-e.now():Math.abs(t);return function(t){return t.lift(new it(r,e))}}var it=function(){function t(t,e){this.delay=t,this.scheduler=e}return t.prototype.call=function(t,e){return e.subscribe(new ot(t,this.delay,this.scheduler))},t}(),ot=function(t){function e(e,n,r){var i=t.call(this,e)||this;return i.delay=n,i.scheduler=r,i.queue=[],i.active=!1,i.errored=!1,i}return i(e,t),e.dispatch=function(t){for(var e=t.source,n=e.queue,r=t.scheduler,i=t.destination;n.length>0&&n[0].time-r.now()<=0;)n.shift().notification.observe(i);if(n.length>0){var o=Math.max(0,n[0].time-r.now());this.schedule(t,o)}else this.unsubscribe(),e.active=!1},e.prototype._schedule=function(t){this.active=!0,this.destination.add(t.schedule(e.dispatch,this.delay,{source:this,destination:this.destination,scheduler:t}))},e.prototype.scheduleNotification=function(t){if(!0!==this.errored){var e=this.scheduler,n=new st(e.now()+this.delay,t);this.queue.push(n),!1===this.active&&this._schedule(e)}},e.prototype._next=function(t){this.scheduleNotification(nt.createNext(t))},e.prototype._error=function(t){this.errored=!0,this.queue=[],this.destination.error(t),this.unsubscribe()},e.prototype._complete=function(){this.scheduleNotification(nt.createComplete()),this.unsubscribe()},e}(b),st=function(){return function(t,e){this.time=t,this.notification=e}}();var ut=function(){function t(t,e){this.predicate=t,this.thisArg=e}return t.prototype.call=function(t,e){return e.subscribe(new ct(t,this.predicate,this.thisArg))},t}(),ct=function(t){function e(e,n,r){var i=t.call(this,e)||this;return i.predicate=n,i.thisArg=r,i.count=0,i}return i(e,t),e.prototype._next=function(t){var e;try{e=this.predicate.call(this.thisArg,t,this.count++)}catch(t){return void this.destination.error(t)}e&&this.destination.next(t)},e}(b);var at=function(){function t(t){this.selector=t}return t.prototype.call=function(t,e){return e.subscribe(new lt(t,this.selector,this.caught))},t}(),lt=function(t){function e(e,n,r){var i=t.call(this,e)||this;return i.selector=n,i.caught=r,i}return i(e,t),e.prototype.error=function(e){if(!this.isStopped){var n=void 0;try{n=this.selector(e,this.caught)}catch(e){return void t.prototype.error.call(this,e)}this._unsubscribeAndRecycle();var r=new M(this,void 0,void 0);this.add(r);var i=C(this,n,void 0,void 0,r);i!==r&&this.add(i)}},e}(D);function ht(t,e){var n;null!==t?(T(t,"load").pipe((n=()=>e.setActive("button"),function(t){var e=new at(n),r=t.lift(e);return e.caught=r})).subscribe(()=>{let n={status:-1};Math.abs(t.status-200)<100&&(n=function(t){const e=(t,e,n)=>{for(let r of t)if(r.getAttribute(e)===n)return r;return""};if("0"===t.getElementsByTagName("numberOfRecords")[0].innerHTML)return{status:-1};let n={status:0,mms_id:"",title:"",sub_title:"",previous_title:"",previous_title_hint:"",next_title:"",next_title_hint:""};const r=t.getElementsByTagName("datafield");{const t="47BIBSYS_NB",i=((t,e,n)=>{let r=[];for(let i of t)i.getAttribute(e)===n&&r.push(i);return r})(r,"tag","852");for(let r of i){const i=r.getElementsByTagName("subfield");if(e(i,"code","a").textContent.includes(t)){const t=e(i,"code","6");n.mms_id=t.innerHTML}}}{const t=e(r,"tag","245").getElementsByTagName("subfield"),i=e(t,"code","a");n.title=i.innerHTML?i.innerHTML:"";let o=e(t,"code","b");n.sub_title=o.innerHTML?o.innerHTML:"";let s=e(t,"code","c");n.sub_title+=s.innerHTML?s.innerHTML+"\n":""}const i=t=>{const n={title:"",hint:""},i=e(r,"tag",t);if(!i)return n;const o=i.getElementsByTagName("subfield"),s=e(o,"code","t");n.title=s.innerHTML.replace("&amp;","&");const u=e(o,"code","g");return n.hint="Endret: "+u.innerHTML,n};{const t=i("780");n.previous_title=t.title,n.previous_title_hint=t.hint}{const t=i("785");n.next_title=t.title,n.next_title_hint=t.hint}return n}(t.responseXML),0===n.status&&e.importDisplayFields(n)),n.status<0&&e.alerts.fireMessage(`Noe gikk galt under søking av objekt med id ${e.search_elements.input.value} Status: ${t.status}`,"danger",3e3),e.setActive("button")},()=>e.setActive("button")),t.send()):e.setActive("button")}T(document,"DOMContentLoaded").subscribe((function(){const t={search_elements:{input:document.getElementById("objectIdForm"),button:document.getElementById("objectSearchBtn"),spinner:document.getElementById("objectSearchSpinner"),hint:document.getElementById("objectIdFormHelp")},display_elements:{object_number:document.getElementById("objectNumber"),mms_id:document.getElementById("mmsId"),mms_clip:document.getElementById("mmsClip"),current_title:document.getElementById("currentTitle"),previous_title:document.getElementById("previousTitle"),previous_title_hint:document.getElementById("previousTitleHint"),next_title:document.getElementById("nextTitle"),next_title_hint:document.getElementById("nextTitleHint")},alerts:{warning:document.getElementById("alert-warning"),error:document.getElementById("alert-danger"),placeholder:document.getElementById("alert-placeholder"),fireMessage:(e,n,r)=>{let i;switch(n){case"warning":i=t.alerts.warning;break;case"danger":i=t.alerts.error;break;default:return void console.error("Type was of unexpected type "+n)}A(null).pipe(X(()=>(i.innerHTML=e,t.alerts.placeholder.style.display="none",i.style.display="block",i.classList.remove("alert-anim"),A(null))),rt(r),R(()=>(i.classList.add("alert-anim"),A(null))),rt(2e3)).subscribe(()=>{i.innerHTML="",t.alerts.placeholder.style.display="block",i.style.display="none"})}},isValdInput:()=>17===t.getInputValue().length&&!isNaN(t.getInputValue()),getInputValue:()=>t.search_elements.input.value,setActive:e=>{"spinner"===e?(t.search_elements.spinner.style.display="block",t.search_elements.button.style.display="none"):(t.search_elements.spinner.style.display="none",t.search_elements.button.style.display="block")},resetDisplayFields:()=>{t.display_elements.mms_id.value="",t.display_elements.current_title.value="",t.display_elements.previous_title.value="",t.display_elements.previous_title_hint.innerHTML="",t.display_elements.next_title.value="",t.display_elements.next_title_hint.innerHTML=""},importDisplayFields:e=>{t.display_elements.object_number.value=t.search_elements.input.value,t.search_elements.input.value="",t.handleUserInput(),t.display_elements.mms_id.value=e.mms_id;const n=e.sub_title?e.title+"\n"+e.sub_title:e.title;t.display_elements.current_title.value=n,t.display_elements.previous_title.value=e.previous_title,t.display_elements.previous_title_hint.innerHTML=e.previous_title_hint,t.display_elements.next_title.value=e.next_title,t.display_elements.next_title_hint.innerHTML=e.next_title_hint},handleUserInput:()=>{t.getInputValue().length>17&&(t.search_elements.input.value=t.getInputValue().slice(0,-1)),t.search_elements.hint.innerHTML=t.getInputValue().length+"/17"}};T(t.display_elements.mms_clip,"click").subscribe(e=>function(t,e){const n=document.getSelection().rangeCount>0&&document.getSelection().getRangeAt(0);let r;switch(t.srcElement.id){case"mmsClip":console.log(e.display_elements.mms_id),r=e.display_elements.mms_id;break;default:return void console.error("unknown button id")}if(r.value<0)return void e.alerts.fireMessage("Kan ikke kopiere tomt felt","warning",600);r.select(),document.execCommand("copy"),e.alerts.fireMessage(r.value+" kopiert!","warning",600),n&&(document.getSelection().removeAllRanges(),document.getSelection().addRange(n))}(e,t)),function(t){const e=()=>{if(t.setActive("spinner"),!t.isValdInput())return t.alerts.fireMessage("Input er ikke gyldig","warning",1e3),A(null);t.resetDisplayFields();const e="https://cors-anywhere.herokuapp.com/https://bibsys.alma.exlibrisgroup.com/view/sru/47BIBSYS_NETWORK?version=1.2&operation=searchRetrieve&recordSchema=marcxml&maximumRecords=1&query=alma.granular_resource_type=p AND alma.all_for_ui="+t.getInputValue();const n=new XMLHttpRequest;return n.open("GET",e),A(n)};T(document,"keypress").pipe((n=t=>"Enter"===t.key,function(t){return t.lift(new ut(n,r))}),X(e)).subscribe(e=>{ht(e,t)},console.error),T(t.search_elements.button,"click").pipe(X(e)).subscribe(e=>{ht(e,t)},console.error),t.handleUserInput();var n,r;(function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n=Number.POSITIVE_INFINITY,r=null,i=t[t.length-1];return N(i)?(r=t.pop(),t.length>1&&"number"==typeof t[t.length-1]&&(n=t.pop())):"number"==typeof i&&(n=t.pop()),null===r&&1===t.length&&t[0]instanceof w?t[0]:K(n)(j(t,r))})(T(t.search_elements.input,"input")).subscribe(()=>t.handleUserInput())}(t)}))}]);