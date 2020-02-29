import React from 'react';
import { observer } from 'mobx-react-lite';

import './lib/Leaflet';

import { useStores } from './stores';

import SubdivisionsMap from './components/SubdivisionsMap';
import Search from './components/Search';
import Spinner from './components/Spinner';
import Infobox from './components/Infobox';
import Logo from './components/Logo';

import './App.scss';

function App() {
  const { subdivisions } = useStores();

  return (
    <div className="App">
      <Search/>
      <SubdivisionsMap/>
      <Infobox />
      <Logo/>
      <Spinner show={subdivisions.loading}/>
    </div>
  );
}

export default observer(App);
