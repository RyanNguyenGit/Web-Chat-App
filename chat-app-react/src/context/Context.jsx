import React, { useState } from 'react';
import NameContext from './NameContext';

function NameProvider({ children }) {
  const [name, setName] = useState('');

  return (
    <NameContext.Provider value={{ name, setName }}>
      {children}
    </NameContext.Provider>
  );
}

export default NameProvider;
