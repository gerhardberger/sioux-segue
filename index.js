module.exports = Segue;

function insertContent (what, to) {
	if (!(what instanceof HTMLElement || what instanceof NodeList)) {
		throw new Error('Content function not returning DOM!');
	}
	if (what instanceof HTMLElement) {
		to.appendChild(what);
	}
	else if (what instanceof NodeList) {
		for (var i = 0; i < what.length; ++i)
			to.appendChild(what[i]);
	}
}

var pushWind = function (fn, cb) {
	var self = this;

	if (!self.available || self.state === 'WINDED') return;
	self.available = false;

	self.push.style.webkitTransitionDuration = '0s';
	self.push.style.webkitTransform = 'translate3d(100%, 0, 0)';
	insertContent(fn(), self.push);
	setTimeout(function() {
		self.element.style.webkitTransitionDuration = self.DURATION;
		self.push.style.webkitTransitionDuration = self.DURATION;
		self.element.style.webkitTransform = 'translate3d(-100%, 0, 0)';
		self.push.style.webkitTransform = 'translate3d(0, 0, 0)';
	}, 1);

	var windHandler = function (event) {
		if (event.propertyName !== '-webkit-transform') return;
		
		self.push.classList.add('segue');
		self.push.classList.remove('push');
		self.element.classList.add('push');
		self.element.classList.remove('segue');
		var tmp = self.push;
		self.push = self.element;
		self.element = tmp;
		self.available = true;
		self.state = 'WINDED';

		if (cb) cb();

		this.removeEventListener('webkitTransitionEnd', windHandler);
	};
	self.push.addEventListener('webkitTransitionEnd', windHandler, false);
};

var pushUnwind = function (cb) {
	var self = this;

	if (!self.available || self.state === 'UNWINDED') return;
	self.available = false;

	self.push.style.webkitTransitionDuration = '0s';
	self.push.style.webkitTransform = 'translate3d(-100%, 0, 0)';
	setTimeout(function() {
		self.element.style.webkitTransitionDuration = self.DURATION;
		self.push.style.webkitTransitionDuration = self.DURATION;
		self.element.style.webkitTransform = 'translate3d(100%, 0, 0)';
		self.push.style.webkitTransform = 'translate3d(0, 0, 0)';
	}, 1);

	var unwindHandler = function (event) {
		if (event.propertyName !== '-webkit-transform') return;
		
		self.push.classList.add('segue');
		self.push.classList.remove('push');
		self.element.classList.add('push');
		self.element.classList.remove('segue');
		var tmp = self.push;
		self.push = self.element;
		self.element = tmp;
		self.available = true;
		self.state = 'UNWINDED';

		if (cb) cb();

		this.removeEventListener('webkitTransitionEnd', unwindHandler);
	};
	self.push.addEventListener('webkitTransitionEnd', unwindHandler, false);
};

function modalWind (fn, cb) {
	var self = this;
	if (self.state === 'WINDED' || !self.available) return this;

	self.available = false;
	self.modal.innerHTML = '';
	insertContent(fn(), self.modal);

	self.modal.style.webkitTransitionDuration = self.DURATION;
	self.modal.style.webkitTransform = 'translate3d(0, 0, 0)';
	
	var modalHandler = function (event) {
		if (event.propertyName !== '-webkit-transform') return;
		
		self.state = 'WINDED';
		self.available = true;
		if (cb) cb();

		this.removeEventListener('webkitTransitionEnd', modalHandler);
	};
	self.modal.addEventListener('webkitTransitionEnd', modalHandler, false);

	return this;
}

function modalUnwind (cb) {
	var self = this;
	if (self.state === 'UNWINDED' || !self.available) return this;

	self.available = false;
	self.modal.style.webkitTransitionDuration = self.DURATION;
	self.modal.style.webkitTransform = 'translate3d(0, 100%, 0)';

	var modalHandler = function (event) {
		if (event.propertyName !== '-webkit-transform') return;
		
		self.state = 'UNWINDED';
		self.available = true;
		if (cb) cb();

		this.removeEventListener('webkitTransitionEnd', modalHandler);
	};
	self.modal.addEventListener('webkitTransitionEnd', modalHandler, false);

	return this;
}

function Segue (element, type) {
	var self = this;
	self.element = element.element || element;
	self.element.classList.add('segue');
	if (!self.element.classList.contains('ui-window'))
		self.element.classList.add('ui-window');

	self.state = 'UNWINDED';
	self.available = true;
	self.DURATION = '.35s';
	self.type = type || 'push';

	if (self.type === 'modal') {
		var elem = document.createElement('div');
		elem.classList.add('ui-window');
		elem.classList.add('modal');

		self.element.appendChild(elem);
		self.modal = elem;
	}
	else if (this.type === 'push') {
		var elem = document.createElement('div');
		elem.classList.add('ui-window');
		elem.classList.add('push');

		self.element.parentElement.appendChild(elem);
		self.push = elem;
	}

	return this;
}

Segue.prototype.wind = function(fn, cb) {
	if (!fn) throw new Error('Content function undefined!');

	if (this.type === 'modal') modalWind.call(this, fn, cb);
	if (this.type === 'push') pushWind.call(this, fn, cb);

	return this;
};

Segue.prototype.unwind = function(cb, cb_) {
	if (this.type === 'modal') modalUnwind.call(this, cb);

	if (!cb) throw new Error('Content function undefined!');
	if (this.type === 'push') pushUnwind.call(this, cb, cb_);

	return this;
};

Segue.prototype.init = function(fn, cb) {
	if (!fn) throw new Error('Content function undefined!');
	insertContent(fn(), this.element);

	if (cb) cb();
};