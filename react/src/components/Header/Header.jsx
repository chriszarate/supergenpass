import React from 'react';

const saveOptions = () => alert( 'saved' );

const Header = ( { toggleShowOptions } ) => (
	<header>
		<h1>SGP</h1>
		<button
			aria-label="Toggle advanced options"
			onClick={toggleShowOptions}
		>
			Toggle
		</button>
		<button
			aria-label="Save current advanced options as default"
			onClick={saveOptions}
		>
			Save
		</button>
	</header>
);

export default Header;
