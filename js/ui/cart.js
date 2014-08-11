TinyCore.AMD.define('cart', ['devicePackage','cartLibs'], function () {
	return {
		sPathCss: oGlobalSettings.sPathCss + 'ui/' + 'cart.css',
		oDefault: {
            cartColumns: [
                //A custom cart column for putting the quantity and increment and decrement items in one div for easier styling.
                { view: function(item, column){
                    return	"<span>"+item.get('quantity')+"</span>" +
                        "<div>" +
                        "<a href='javascript:;' class='simpleCart_increment'><i class='icon-caret-up'></i> </a>" +
                        "<a href='javascript:;' class='simpleCart_decrement'><i class='icon-caret-down'></i></a>" +
                        "</div>";
                }, attr: 'custom' },
                //Name of the item
                { attr: "name" , label: false },
                //Subtotal of that row (quantity of that item * the price)
                { view: 'currency', attr: "total" , label: false  }
            ],
            cartStyle: 'div',
            checkout: {
                type: "PayPal",
                email: "you@yours.com"
            }
		},
		onStart: function () {

			var self = this,
                aTargets = FC.getDataModules('cart');

			FC.loadCSS(this.sPathCss);

			FC.trackEvent('JS_Libraries', 'call', 'autocomplete' );

            $(aTargets).each(function () {
                self.autobind(this);
            });

            simpleCart(self.oDefault);

			simpleCart.init();
		},
        autobind: function(oTarget) {
            var self = this;

            $(oTarget).bind('click',function(e){
                e.preventDefault();
                self.toggleCart(this);
            });
        },
		toggleCart: function (oTarget) {

			var self = this,
				$Target = $(oTarget),
				$Cart = $(document.getElementById(oTarget.href.split('#')[1]));
				$Cart.toggleClass('hidden');
		},
		onStop: function () {
			this.sPathCss = null;
			this.oDefault = null;
		},
		onDestroy: function () {
			delete this.sPathCss;
			delete this.oDefault;
		}
	};
});