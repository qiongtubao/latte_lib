(function(define) { 'use strict';
	define("latte_lib/dom", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		if(window) {
			var doc = doc || document;
			var XHTML_NS = "http://www.w3.org/1999/xhtml";
			(function() {
				var _self = this;
				this.isDom = function(dom) {
					return dom instanceof HTMLElement
				}
				this.removeCssClass = function(el, name) {
					var classes = el.className.split(/\s+/g);
				    while (true) {
				        var index = classes.indexOf(name);
				        if (index == -1) {
				            break;
				        }
				        classes.splice(index, 1);
				    }
				    el.className = classes.join(" ");
				}
				this.changeCssClass = function(dom, old, now ) {
					_self.removeCssClass(dom, old);
					_self.addCssClass(dom,now);
				}
				this.removeAllChild = function(dom) {
					if(dom.children) {
						var d;
						while(d = dom.children[0]) {
							dom.removeChild(d);
						}
					}
				}

				this.getElementById = function(name) {
					return doc.getElementById(name);
				}

				this.getParent = function(dom) {
					return dom.parentNode;
				}

				this.doEvent = function(dom, eventName) {
					var events = {
						"change": "MouseEvents",
						"click": "MouseEvents"
					}
					var evObj = document.createEvent(events[eventName]);
					evObj.initEvent(eventName, true, false);
					dom.dispatchEvent(evObj);
				}

				this.create = this.createElement = function(tag, ns) {
					return document.createElementNS?
					document.createElementNS(ns || XHTML_NS, tag)
					: document.createElement(tag);
				}

				this.importCssString = function(cssText, id, doc) {
					doc = doc || document;
					if(id && _self.hasCssString(id, doc))
						return null;
					var style;
					if(doc.createStyleSheet) {
						style = doc.createStyleSheet();
						style.cssText = cssText;
						if(id) {
							style.owningElement.id = id;
						}
					} else {
						style = _self.createElement("style");
						style.appendChild(doc.createTextNode(cssText));
						if(id) {
							style.id = id;
						}
						_self.getDocumentHead(doc).appendChild(style);
					}
				}

				this.getDocumentHead = function() {
					if(!doc) {
						doc = document;
					}
					return doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement;
				}
				this.hasCssString = function(id, doc) {
					var index = 0, sheets;
					doc = doc || document;
					if(doc.createStyleSheet && (sheets = doc.styleSheets)) {
						while(index < sheets.length) {
							if(sheets[index++].owningElement.id==id) {
								return true;
							}
						}
					}else if((sheets = doc.getElementsByTagName("style"))) {
						while(index < sheets.length) {
							if(sheets[index++].id === id) {
								return true;
							}
						}
					}
					return false;
				}

				this.addCssClass = function(el, name) {
					if(!_self.hasCssClass(el, name)) {
						el.className += " " + name;
					}
				}

				this.hasCssClass = function(el, name) {
					if(!el.className) return false;
					var classes =el.className.split(/\s+/g);
					return classes.indexOf(name) !== -1;
				}

				this.on = function(dom) {
					var parameter = Array.prototype.slice.call(arguments, 1);
					dom.addEventListener.apply(dom, parameter);
				}

				this.once = function(dom) {
					var parameter = Array.prototype.slice.call(arguments, 1);
					var func = parameter[1];
					var proxy = function(event) {
						func(event);
						dom.removeEventListener.apply(dom, parameter);
					};
					parameter[1] = proxy;
					dom.addEventListener.apply(dom, parameter);
				}
				/**
					remove right key event
				*/
				this.removeContextMenu = function(dom) {
					_self.on(dom, "contextmenu", function(event) {
						event.preventDefault();
					}, false);
				};
				
				this.set = function(dom, key , value) {
					dom.setAttribute(key, value);
				}
				this.get = function(dom, key) {
					return dom.getAttribute(key);
				}
				this.setValue = function(dom, value) {
					//dom.textContent = value;
					dom.innerHTML = value;
				}
				this.getValue = function(dom) {
					return dom.innerHTML;
				}
			}).call(module.exports);			
		}
		
		
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });