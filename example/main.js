var $ = require('sioux-global');
window.$ = $;
var Segue = require('../index.js');

window.onload = function () {
	var modalSegue = new Segue($('.container'), 'modal');
	window.modalSegue = modalSegue;
	var pushSegue = new Segue($('.container'), 'push');
	window.pushSegue = pushSegue;

	var content = function () {
		var div = document.createElement('div');
		div.classList.add('ui-window');
		div.classList.add('foo');
		var b = document.createElement('button');
		b.id = 'pushWind';
		b.classList.add('ui-button');
		b.innerText = 'Wind';
		div.appendChild(b);
		var b2 = document.createElement('button');
		b2.classList.add('ui-button');
		b2.id = 'modalWind';
		b2.innerText = 'Modal';
		div.appendChild(b2);
		return div;
	};

	var contentCb = function () {
		$('#modalWind').on('tap', function () {
			modalSegue.wind(function () {
				var b = document.createElement('button');
				b.classList.add('ui-button');
				b.id = 'modalUnwind';
				b.innerText = 'Unwind';
				return b;
			}, function () {
				console.log('Modal winded!');
				$('#modalUnwind').on('tap', function () {
					modalSegue.unwind(function () {
						console.log('Modal unwinded!');
					});
				});
			});
		});
	};
	pushSegue.init(content, contentCb);

	$('#pushWind').on('tap', function () {
		pushSegue.wind(function () {
			var div = document.createElement('div');
			div.classList.add('ui-window');
			div.classList.add('bar');
			var b = document.createElement('button');
			b.id = 'pushUnwind';
			b.classList.add('ui-button');
			b.innerText = 'Unwind';
			div.appendChild(b);
			return div;
		}, function () {
			console.log('Push winded!');
			$('#pushUnwind').on('tap', function () {
				pushSegue.unwind(content, contentCb);
			});
		});
	});
};