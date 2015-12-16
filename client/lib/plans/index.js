/**
 * External dependencies
 */
import moment from 'moment';

export function getDaysUntilExpiry( plan ) {
	const { userFacingExpiryMoment } = plan;

	return userFacingExpiryMoment.diff( moment(), 'days' );
};
