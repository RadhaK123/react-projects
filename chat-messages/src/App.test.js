import React from 'react';
import App from './App';

import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';


it('Renders without any errors', () => {
    const page = document.createElement('div');
    render(<App></App>, page);
});


