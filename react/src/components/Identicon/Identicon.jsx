import React, { memo } from 'react';
import hashicon from 'hashicon';
import sha512 from 'crypto-js/sha512';

const Identicon = ( { input, size } ) => (
	<img
		height={size}
		src={hashicon( `0x${sha512( input ).toString()}`, size ).toDataURL()}
		width={size}
	/>
);

export default memo( Identicon );
