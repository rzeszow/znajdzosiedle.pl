import React from 'react';

import logo from './logo.svg';
import './Logo.scss';

function Logo() {
    return <a href="https://michal.kruczek.it" rel="noopener noreferrer" target="_blank">
        <img className="Logo" src={logo} alt="znajdzosiedle.pl - logo"/>
    </a>;
}

export default Logo;
