/**
 * External dependencies
 */
import React, { PropTypes } from 'react';

/**
 * Internal dependencies
 */
import ObserveWindowSizeMixin from 'lib/mixins/observe-window-resize';
import Gridicon from 'components/gridicon';

export default React.createClass( {

	displayName: 'HeaderCakeBack',

	mixins: [ ObserveWindowSizeMixin ],

	propTypes: {
		onClick: PropTypes.func,
		href: PropTypes.string,
		text: PropTypes.oneOfType( [
			PropTypes.element,
			PropTypes.string
		] )
	},

	getDefaultProps() {
		return {
			text: 'Back'
		}
	},

	render() {
		const { text, href, onClick } = this.props;
		const hideText = window.innerWidth <= 480 && text.length >= 8;

		return (
			<a className="header-cake__back" href={ href } onClick={ onClick }>
				<Gridicon icon="chevron-left" size={ 18 } />
				{ hideText ?
					null
				: <span className="header-cake__back-text">{ text }</span> }
			</a>
		);
	},

	onWindowResize() {
		this.forceUpdate();
	}

} );
