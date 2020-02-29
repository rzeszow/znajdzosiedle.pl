import React, { useState } from 'react';
import { Button, ControlGroup, InputGroup } from "@blueprintjs/core";
import { observer } from "mobx-react-lite";

import { useStores } from '../stores';

import './Search.scss';

function Search() {
    const { queryParams, subdivisions } = useStores();
    const [query, setQuery] = useState(queryParams.params.get('q'));

    const onSubmit = (e) => {
        e.preventDefault();
        subdivisions.lookup({ query });
    }

    return (
        <div className="Search">
            <form onSubmit={onSubmit}>
                <ControlGroup fill={true} vertical={false}>
                    <InputGroup large={true} placeholder="Wpisz nazwę miasta..." onChange={(e) => setQuery(e.target.value)} value={query}/>
                    <Button large={true} type="submit" className="bp3-button bp3-intent-primary" >Wizualizuj&nbsp;osiedla</Button>
                </ControlGroup>
            </form>
        </div>
    );
}

export default observer(Search);
