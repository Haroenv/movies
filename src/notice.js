/**
 * add a notice, removeable by clicking the 'close button'
 * Creates <p class="notice"><span class="notice--close"></span>text</p>
 * @param  {string}       text               the notice text
 * @param  {boolean}      webkit             if true, the searchfield cancel button will be used on webkti
 * @author Haroen Viaene  <hello@haroen.me>
 * @version 0.2
 */
var notice = function(text,webkit){
	var notice = document.createElement('p');
	var close = document.createElement('span');
	var content = document.createTextNode(text);

	notice.appendChild(close);
	notice.appendChild(content);

	close.className += 'notice--close';
	notice.className += 'notice';

	if (webkit) {
		if ("webkitAppearance" in document.body.style) {
			close.style.webkitAppearance = "searchfield-cancel-button";
		} else {
			close.appendChild(document.createTextNode('✕'));
		}
	} else {
		close.appendChild(document.createTextNode('✕'));
	}

	document.body.insertBefore(notice, document.body.firstChild);

	close.addEventListener('click',function(){
		document.body.removeChild(notice);
	});
};