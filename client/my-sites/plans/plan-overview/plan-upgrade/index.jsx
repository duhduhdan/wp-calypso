/**
 * External dependencies
 */
import React from 'react';
import page from 'page';

/**
 * Internal dependencies
 */
import i18n from 'lib/mixins/i18n';
import { cartItems } from 'lib/cart-values';
import CompactCard from 'components/card/compact';
import { isPremium } from 'lib/products-values';
import * as upgradesActions from 'lib/upgrades/actions';

const PlanUpgrade = ( { plan, selectedSite: { slug: selectedSiteSlug } } ) => {
	const upgradePlan = ( event ) => {
		event.preventDefault();

		upgradesActions.addItem( cartItems.planItem( 'business-bundle', true ) );

		page( `/checkout/${ selectedSiteSlug }` );
	};

	if ( isPremium( plan ) ) {
		return (
			<CompactCard className="plan-upgrade">
				{ i18n.translate( 'Need more power for your site? {{a}}Switch to the WordPress.com Business Free Trial.{{/a}}', {
					components: { a: <a href="#" onClick={ upgradePlan } /> }
				} ) }
			</CompactCard>
		);
	}

	// stateless functional components must return a ReactElement
	return <noscript />;
};

PlanUpgrade.propTypes = {
	plan: React.PropTypes.object.isRequired,
	selectedSite: React.PropTypes.oneOfType( [
		React.PropTypes.object,
		React.PropTypes.bool
	] ).isRequired
};

export default PlanUpgrade;
