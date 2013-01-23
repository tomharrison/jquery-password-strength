jQuery Password Strength Plugin
===============================

Add-on to evaluate the strength of a password input by a user, and provide feedback.

Usage
-----

``
$(document).ready(function () {
	$('#password_field').passStrength({ userid: '#username_field' });
});
``

Options
-------

* userid - Selector for the username input field.
* shortPass - Class name applied to feedback element when the password is too short.
* badPass - Class name applied to the feedback element when the password is weak.
* goodPass - Class name used when the password is good.
* strongPass - Class name used when the password is strong.
* messageloc - If 0, show feedback before the password input. If 1, show feedback after the element.

Credits
-------

Originally written by Darren Mason in 2009, based a 2007 plugin-in by Firas Kassem. Refactored in 2013 by Tom Harrison.
