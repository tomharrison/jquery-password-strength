/**
 * password_strength_plugin.js
 * Copyright (c) 20010 myPocket technologies (www.mypocket-technologies.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * @author Darren Mason (djmason9@gmail.com)
 * @date 3/13/2009
 * @projectDescription Password Strength Meter is a jQuery plug-in provide you smart algorithm to detect a password strength. Based on Firas Kassem orginal plugin - http://phiras.wordpress.com/2007/04/08/password-strength-meter-a-jquery-plugin/
 * @version 1.0.1
 *
 * @requires jquery.js (tested with 1.3.2)
 * @param shortPass:	"shortPass",	//optional
 * @param badPass:		"badPass",		//optional
 * @param goodPass:		"goodPass",		//optional
 * @param strongPass:	"strongPass",	//optional
 * @param baseStyle:	"testresult",	//optional
 * @param userid:		"",				//required override
 * @param messageloc:	1				//before == 0 or after == 1
 *
 */

(function ($) { 
	var pluginName = 'passStrength';

	var defaults = {
		shortPass: 		"shortPass",	//optional
		badPass:		"badPass",		//optional
		goodPass:		"goodPass",		//optional
		strongPass:		"strongPass",	//optional
		baseStyle:		"testresult",	//optional
		userid:			"",				//required override
		messageloc:		1				//before == 0 or after == 1
	};

	// To-do: move these out of the $.fn namespace.
	$.fn.shortPass = 'Too short';
	$.fn.badPass = 'Weak';
	$.fn.goodPass = 'Good';
	$.fn.strongPass = 'Strong';
	$.fn.samePassword = 'Username and Password identical.';
	$.fn.resultStyle = "";

	/**
	 * Plugin constructor.
	 *
	 * Create a new instance of the plugin, and extend the default options with
	 * the user's input. Keep references to the options, the current element, 
	 * and anything else useful. Call the init function, which binds events.
	 */
	function PasswordStrength(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	/**
	 * Test password strength each time the value of the element changes.
	 */
	PasswordStrength.prototype.init = function () {
		// To-do: namespace this handler so it can be unbound without affecting any other
		// event handlers that may be on this element.
		$(this.element).unbind().keyup(function () {
			var self = $(this).data('plugin_' + pluginName);
			var results = self.testStrength();
			var span = '<span class="' + self.options.baseStyle + '"><span></span></span>';
			
			self.clear();
			if (self.options.messageloc === 1) {
				$(this).after(span);
			} else {
				$(this).before(span);
			}
			$(this).siblings('.' + self.options.baseStyle).addClass($(this).resultStyle).find('span').text(results);
		});
	};

	// Clear the password strength indicator elements.
	PasswordStrength.prototype.clear = function () {
		$(this.element).siblings('.' + this.options.baseStyle).remove();
	};

	/**
	 * Test the strength of the element's value.
	 */
	PasswordStrength.prototype.testStrength = function () {
		var password = $(this.element).val();
		var username = $(this.options.userid).val();
		var score = 0;

		//password < 4
		if (password.length < 4) {
			this.resultStyle =  this.options.shortPass;
			return $(this).shortPass;
		}

		//password == user name
		if (password.toLowerCase()==username.toLowerCase()) {
			this.resultStyle = this.options.badPass;
			return $(this).samePassword;
		}

		//password length
		score += password.length * 4;
		score += ( $.fn.checkRepetition(1,password).length - password.length ) * 1;
		score += ( $.fn.checkRepetition(2,password).length - password.length ) * 1;
		score += ( $.fn.checkRepetition(3,password).length - password.length ) * 1;
		score += ( $.fn.checkRepetition(4,password).length - password.length ) * 1;

		//password has 3 numbers
		if (password.match(/(.*[0-9].*[0-9].*[0-9])/)) {
			score += 5;
		}

		//password has 2 symbols
		if (password.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)) {
			score += 5;
		}

		//password has Upper and Lower chars
		if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
			score += 10;
		}

		//password has number and chars
		if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) {
			score += 15;
		}

		//password has number and symbol
		if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([0-9])/)) {
			score += 15;
		}

		//password has char and symbol
		if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([a-zA-Z])/)) {
			score += 15;
		}

		//password is just a numbers or chars
		if (password.match(/^\w+$/) || password.match(/^\d+$/) ) {
			score -= 10;
		}

		//verifying 0 < score < 100
		if (score < 0) {
			score = 0;
		}

		if (score > 100) {
			score = 100;
		}

		if (score < 34 ) {
			this.resultStyle = this.options.badPass;
			return $(this).badPass;
		}

		if (score < 68) {
			this.resultStyle = this.options.goodPass;
			return $(this).goodPass;
		}

		this.resultStyle = this.options.strongPass;
		return $(this).strongPass;
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() { 
			var plugin = $.data(this, 'plugin_' + pluginName);

			if (typeof options === 'string' && plugin && typeof plugin[options] === 'function') {
				return plugin[options]();
			}

			if (!plugin) {
				$.data(this, 'plugin_' + pluginName, new PasswordStrength(this, options));
			}
		});
	};
})(jQuery);


// To-do: remove this from the $.fn namespace and move it inside the closure.
$.fn.checkRepetition = function(pLen,str) {
	var res = "";
	for (var i=0; i<str.length ; i++ ) {
		var repeated=true;

		for (var j=0;j < pLen && (j+i+pLen) < str.length;j++) {
			repeated=repeated && (str.charAt(j+i)==str.charAt(j+i+pLen));
		}
		if (j<pLen) {
			repeated=false;
		}
		if (repeated) {
			i+=pLen-1;
			repeated=false;
		} else {
			res+=str.charAt(i);
		}
	}
	return res;
};
