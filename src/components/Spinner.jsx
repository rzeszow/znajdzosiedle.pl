import React from 'react';
import { Spinner } from "@blueprintjs/core";

import './Spinner.scss';

export default ({ show = true }) => {
    if (!show) {
        return null;
    }
    
    return <Spinner size={100} className="Spinner"/>;
};
