/**
 * External dependencies
 */
var React = require( 'react' ),
	range = require( 'lodash/utility/range' );

/**
 * Internal dependencies
 */
var analyticsMixin = require( 'lib/mixins/analytics' ),
	canRemoveFromCart = require( 'lib/products-values' ).canRemoveFromCart,
	cartItems = require( 'lib/cart-values' ).cartItems,
	getIncludedDomain = cartItems.getIncludedDomain,
	isCredits = require( 'lib/products-values' ).isCredits,
	isDomainProduct = require( 'lib/products-values' ).isDomainProduct,
	isGoogleApps = require( 'lib/products-values' ).isGoogleApps,
	upgradesActions = require( 'lib/upgrades/actions' ),
	isDomainRegistration = require( 'lib/products-values' ).isDomainRegistration;

module.exports = React.createClass( {
	displayName: 'CartItem',

	mixins: [ analyticsMixin( 'cartItem' ) ],

	removeFromCart: function( event ) {
		event.preventDefault();
		this.recordEvent( 'remove', this.props.cartItem.product_id );
		upgradesActions.removeItem( this.props.cartItem );
	},

	price: function() {
		var cost,
			cart = this.props.cart,
			cartItem = this.props.cartItem;

		if ( typeof cartItem.cost === 'undefined' ) {
			return this.translate( 'Loading price' );
		}

		if ( cartItem.free_trial ) {
			return this.getFreeTrialPrice();
		}

		if ( cartItems.hasDomainCredit( cart ) && isDomainProduct( cartItem ) && cartItem.cost === 0 ) {
			return this.getDomainPlanPrice();
		}

		cost = cartItem.cost * cartItem.volume;

		return this.translate( '%(cost)s %(currency)s', {
			args: {
				cost: cost,
				currency: cartItem.currency
			}
		} );
	},

	getDomainPlanPrice: function() {
		return <em>{ this.translate( 'Free with your plan' ) }</em>;
	},

	getFreeTrialPrice: function() {
		var freeTrialText, renewalPrice;

		freeTrialText = this.translate( 'Free %(days)s Day Trial', {
			args: { days: '14' }
		} );

		renewalPrice = this.translate( '(%(cost)s %(currency)s/%(billingPeriod)s)', {
			args: {
				cost: this.props.cartItem.orig_cost,
				currency: this.props.cartItem.currency,
				billingPeriod: 'year'
			}
		} );

		return (
			<span>
				{ freeTrialText }
			</span>
		);
	},

	getProductInfo() {
		var domain = this.props.cartItem.meta || this.props.selectedSite.domain,
			info = null;

		if ( isGoogleApps( this.props.cartItem ) && this.props.cartItem.extra.google_apps_users ) {
			info = this.props.cartItem.extra.google_apps_users.map( user => <div>{ user.email }</div> );
		} else if ( isCredits( this.props.cartItem ) ) {
			info = null
		} else if ( getIncludedDomain( this.props.cartItem ) ) {
			info = getIncludedDomain( this.props.cartItem );
		} else {
			info = domain;
		}
		return info;
	},

	handleDomainVolumeSelection: function( event ) {
		event.preventDefault();
		let volume = parseInt( event.target.value );
		upgradesActions.setVolume( this.props.cartItem, volume );

		this.recordEvent( 'changeVolume', volume );

		cartItems.getDependentProducts( this.props.cartItem, this.props.cart )
			.filter( product => cartItems.isPrivacyProduct( product ) )
			.forEach( cartItem => upgradesActions.setVolume( cartItem, volume ) );
	},

	getVolumeOptions: function() {
		return range( 1, 6 ).map( number =>
			<option key={ number } value={ number }>
				{ this.translate( '%(number)s year', '%(number)s years', { args: { number }, count: number } ) }
			</option>
		);
	},

	domainVolumeSelection: function() {
		return isDomainRegistration( this.props.cartItem ) ? (
			<select name="product-domain-volume"
							className="product-domain-volume"
							onChange={ this.handleDomainVolumeSelection }
							value={ this.props.cartItem.volume }>
				{ this.getVolumeOptions() }
			</select>
		) : null;
	},

	render: function() {
		var name = this.getProductName();

		return (
			<li className="cart-item">
				<div className="primary-details">
					<span className="product-name">{ name || this.translate( 'Loading…' ) }</span>
					<span className="product-domain">{ this.getProductInfo() }</span>
				</div>

				<div className="secondary-details">
					<span className="product-price">
						{ this.price() }
					</span>
					{ this.domainVolumeSelection() }
					{ isCredits( cartItem ) ? null : this.removeButton() }
				</div>
			</li>
		);
	},

	getProductName: function() {
		var cartItem = this.props.cartItem,
			options = {
				count: cartItem.volume,
				args: {
					volume: cartItem.volume,
					productName: cartItem.product_name
				}
			},
			hasDomainSuffix, gappsProductName;
		if ( isDomainRegistration( cartItem ) ) {
			return cartItem.product_name;
		}
		if ( ! cartItem.volume ) {
			return cartItem.product_name;
		} else if ( cartItem.volume === 1 ) {
			switch ( cartItem.product_slug ) {
				case 'gapps':
					hasDomainSuffix = cartItem.product_name.indexOf( cartItem.meta ) > -1;
					gappsProductName = hasDomainSuffix ? cartItem.product_name : this.translate( '%(productName)s for %(domain)s', {
						args: {
							productName: cartItem.product_name,
							domain: cartItem.meta
						}
					} );
					return this.translate(
						'%(productName)s (1 User)', {
							args: {
								productName: gappsProductName
							}
						} );

				default:
					return cartItem.product_name;
			}
		} else {
			switch ( cartItem.product_slug ) {
				case 'gapps':
					return this.translate(
						'%(productName)s (%(volume)s User)',
						'%(productName)s (%(volume)s Users)',
						options
					);

				case 'private_whois':
					return this.translate(
						'%(productName)s (%(volume)s Year)',
						'%(productName)s (%(volume)s Years)',
						options
					);

				default:
					return this.translate(
						'%(productName)s (%(volume)s Item)',
						'%(productName)s (%(volume)s Items)',
						options
					);
			}
		}
	},

	removeButton: function() {
		if ( canRemoveFromCart( this.props.cartItem ) ) {
			return <button className="remove-item noticon noticon-close" onClick={ this.removeFromCart }></button>;
		}
	}
} );
