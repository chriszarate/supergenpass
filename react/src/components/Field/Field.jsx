import React from 'react';

const Field = ( { label, ...props } ) => {
	if ( label ) {
		return (
			<label>
				<input {...props} />
				{label}
			</label>
		);
	}

	return <input {...props} />;
};

export default Field;
