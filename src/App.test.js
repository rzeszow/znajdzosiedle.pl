import React from 'react';
import { render } from '@testing-library/react';
import { unmountComponentAtNode } from "react-dom";


import App from './App';

jest.mock('leaflet');

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('it renders the main page view', () => {
  const { container } = render(<App />);
  expect(container.textContent).toEqual(expect.not.stringContaining('Wizualizuj osiedla'));
  expect(container.textContent).toEqual(expect.not.stringContaining('Dane pochodzą z otwartego systemu OpenStreetMap oraz OverpassApi. Dane prezentowane na mapie mogą zawierać błędy. W celu ich poprawy lub uzupełnienia braków zapraszamy do współtworzenia na OpenStreetMap.org'));
});
