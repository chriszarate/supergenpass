import React, { useState } from 'react';
import Form from '../Form/Form';
import Header from '../Header/Header';

const App = () => {
	const [ showOptions, setShowOptions ] = useState( false );
	const toggleShowOptions = () => setShowOptions( !showOptions );
	const savedData = {
		secret: 'hello',
	};

	return (
		<>
			<Header toggleShowOptions={toggleShowOptions} />
			<Form savedData={savedData} showOptions={showOptions} />
		</>
	);
};

export default App;
