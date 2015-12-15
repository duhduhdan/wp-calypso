/**
 * Internal dependencies
 */
import {
	NEW_NOTICE,
	REMOVE_NOTICE
} from 'state/action-types';

import { uniqueId } from 'lodash';

export function createNoticeAction( status, text, options = {} ) {
	const notice = {
		noticeId: uniqueId(),
		duration: options.duration,
		showDismiss: ( typeof options.showDismiss === 'boolean' ? options.showDismiss : true ),
		status: status,
		text: text
	};

	return {
		type: NEW_NOTICE,
		notice
	};
}

export function removeNoticeAction( noticeId ) {
	return {
		noticeId: noticeId,
		type: REMOVE_NOTICE
	};
}

export function noticesMapDispatchToProps( dispatch ) {
	function createNotice( type, text, options ) {
		var action = createNoticeAction( type, text, options );

		if ( action.duration > 0 ) {
			setTimeout( () => {
				dispatch( removeNoticeAction( action.noticeId ) );
			}, action.duration );
		}

		dispatch( action );
	}

	return {
		successNotice: createNotice.bind( null, 'is-success' ),
		errorNotice: createNotice.bind( null, 'is-error' ),
		removeNotice: ( noticeId ) => {
			dispatch( removeNoticeAction( noticeId ) );
		}
	};
}
