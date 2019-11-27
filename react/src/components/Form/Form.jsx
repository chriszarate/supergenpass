import React, { useEffect, useState } from 'react';
import Field from '../Field/Field';
import Identicon from '../Identicon/Identicon';
import { generate } from 'supergenpass-lib';
import md5 from 'crypto-js/md5';
import sha512 from 'crypto-js/sha512';

const defaults = {
	domain: '',
	length: 10,
	master: '',
	method: 'md5',
	secret: '',
};

const Form = ( { savedData, showOptions } ) => {
	const [ input, setInput ] = useState( { ...defaults, ...savedData } );
	const [ output, setOutput ] = useState( null );

	const onChange = ( { target: { name, value } } ) => {
		setInput( {
			...input,
			[ name ]: 'length' === name ? parseInt( value, 10 ) : value,
		} );
	};

	useEffect( () => {
		console.log( input );
		const { domain, master, secret, ...options } = input;
		const password = `${master}${secret}`;

		if ( !password || !domain ) {
			setOutput( null );
			return;
		}

		generate( password, domain, options, setOutput );
	}, [ Object.values( input ) ] );

	return (
		<form
			action="#"
			autocomplete="off"
			novalidate="novalidate"
			onSubmit={evt => evt.preventDefault()}
		>
			<fieldset>
				<Field
					ariaLabel="Master password"
					defaultValue={input.master}
					name="master"
					onChange={onChange}
					placeholder="Master password"
					type="password"
				/>

				{
					`${input.master}${input.secret}` &&
					<Identicon input={`${input.master}${input.secret}`} size={100} />
				}
			</fieldset>

			<fieldset>
				<Field
					ariaLabel="Secret password"
					defaultValue={input.secret}
					hidden={!showOptions}
					name="secret"
					onChange={onChange}
					placeholder="Secret password"
					type="password"
				/>
			</fieldset>

			<fieldset onChange={onChange}>
				<Field
					defaultChecked={'sha512' === input.method}
					defaultValue="sha512"
					label="SHA"
					name="method"
					type="radio"
				/>
				<Field
					defaultChecked={'md5' === input.method}
					defaultValue="md5"
					label="MD5"
					name="method"
					type="radio"
				/>
		</fieldset>

			<Field
				ariaLabel="Password length"
				defaultValue={input.length}
				name="length"
				onChange={onChange}
				pattern="[0-9]*"
				type="text"
			/>

			<fieldset>
				<Field
					ariaLabel="Domain / URL"
					defaultValue={input.domain}
					name="domain"
					onChange={onChange}
					placeholder="Domain / URL"
					type="url"
				/>
			</fieldset>

			{
				output &&
				<div>{output}</div>
			}
		</form>
	);
};

export default Form;
