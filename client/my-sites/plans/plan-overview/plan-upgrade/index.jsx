/**
 * External dependencies
 */
import React from 'react';
import page from 'page';

/**
 * Internal dependencies
 */
import { cartItems } from 'lib/cart-values';
import CompactCard from 'components/card/compact';
import { isPremium } from 'lib/products-values';
import * as upgradesActions from 'lib/upgrades/actions';

const PlanUpgrade = React.createClass( {
	propTypes: {
		plan: React.PropTypes.object.isRequired,
		selectedSite: React.PropTypes.oneOfType( [
			React.PropTypes.object,
			React.PropTypes.bool
		] ).isRequired
	},

	upgradePlan( event ) {
		event.preventDefault();

		upgradesActions.addItem( cartItems.planItem( 'business-bundle', true ) );

		page( '/checkout/' + this.props.selectedSite.slug );
	},

	render() {
		if ( isPremium( this.props.plan ) ) {
			return (
				<CompactCard className="plan-upgrade">
					{ this.translate( 'Need more power for your site? {{a}}Switch to the WordPress.com Business Free Trial.{{/a}}', {
						components: { a: <a href="#" onClick={ this.upgradePlan } /> }
					} ) }
				</CompactCard>
			);
		} else {
			return null;
		}
	}
} );

export default PlanUpgrade;
