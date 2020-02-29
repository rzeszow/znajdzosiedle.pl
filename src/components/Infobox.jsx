import React, { useState } from 'react';
import Cookies from 'js-cookie';

import './Infobox.scss';

function Infobox () {
    const [isClosed, close] = useState(!!Cookies.get('infobox'));

    const onClose = (e) => {
        e.preventDefault();
        Cookies.set('infobox', true);
        close(true);
    }
    
    if (!!isClosed) {
        return null;
    }
    
    return (
        <div className="Infobox">
            <p>
                Dane pochodzą z otwartego systemu OpenStreetMap oraz OverpassApi.
            </p>
            <p>
                Dane prezentowane na mapie mogą zawierać błędy. W celu ich poprawy lub uzupełnienia braków zapraszamy do współtworzenia na <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer">OpenStreetMap.org</a>.
            </p>
            <button className="Infobox-close" onClick={onClose}>Zamknij</button>
        </div>
    );
}

export default Infobox;
