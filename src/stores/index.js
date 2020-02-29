import React, { createContext, useContext } from 'react';

import { queryParams } from './QueryParams';
import { subdivisions } from './Subdivisions';
import { Bridge } from './Bridge';

export const bridge = new Bridge(queryParams, subdivisions);

export const stores = {
    queryParams,
    subdivisions,
};

export const StoreContext = createContext(stores);

/**
 * @returns {{ searchStore: searchStore }}
 */
export const useStores = () => {
    return useContext(StoreContext);
};

export const withStores = (PassedComponent) => {
    return function withStoreContext(props) {
        return <StoreContext.Consumer>
            {(stores) => (<PassedComponent {...props} {...stores}/>)}
        </StoreContext.Consumer>;
    };
};

export default {
    stores,
    StoreContext,
    useStores,
    withStores,
};
