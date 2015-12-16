/**
 * External dependencies
 */
import classNames from 'classnames';
import React from 'react';

/**
 * Internal dependencies
 */
import CompactCard from 'components/card/compact';
import { getDaysUntilExpiry } from 'lib/plans';
import ProgressBar from 'components/progress-bar';

const PlanStatusProgress = React.createClass( {
	propTypes: {
		plan: React.PropTypes.object.isRequired
	},

	renderProgressBar() {
		const { plan, plan: { subscribedMoment, userFacingExpiryMoment } } = this.props,
			// we strip the hour/minute/second/millisecond data here from `subscribed_date` to match `expiry`
			trialPeriodInDays = userFacingExpiryMoment.diff( subscribedMoment, 'days' ),
			timeUntilExpiryInDays = getDaysUntilExpiry( plan ),
			progress = Math.max( 0.5, trialPeriodInDays - timeUntilExpiryInDays );

		return (
			<ProgressBar
				value={ progress }
				total={ trialPeriodInDays } />
		);
	},

	renderDaysRemaining() {
		const { plan } = this.props;

		return this.translate(
			'%(daysUntilExpiry)s day remaining',
			'%(daysUntilExpiry)s days remaining',
			{
				args: { daysUntilExpiry: getDaysUntilExpiry( plan ) },
				count: getDaysUntilExpiry( plan ),
				context: 'The amount of time until the trial plan expires, e.g. "5 days remaining"'
			}
		);
	},

	render() {
		const classes = classNames( 'plan-status-progress', {
			'is-expiring': getDaysUntilExpiry( this.props.plan ) < 6
		} );

		return (
			<CompactCard>
				<div className={ classes }>
					<div className="plan-status-progress__time-until-expiry">
						{ this.renderDaysRemaining() }
					</div>

					<div className="plan-status-progress__progress-bar">
						{ this.renderProgressBar() }
					</div>
				</div>
			</CompactCard>
		);
	}
} );

export default PlanStatusProgress;
