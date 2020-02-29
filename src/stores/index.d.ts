// stores/index.d.ts

import { Context, Component, StatelessComponent, ComponentClass } from 'react';


declare class QueryParams {
    params: Record<string, string>;
    queryString: string;
    setParams(params: Record<string, string>);
}

declare interface LookupQuery {
    query: string;
}

declare class Subdivisions {
    loading: boolean;
    bounds: Array<Array<Number>>;
    subdivisions: Object;
    setBounds(bounds: Array<Number>);
    setSubdivisions(subdivisions: Object);
    lookup(query: LookupQuery);
}

declare interface Stores {
    queryParams: QueryParams;
    subdivisions: Subdivisions;
}

declare function useStores(): Stores;

declare interface StoreContext extends Context<Stores>{}

declare function withStores<P>(
    Comp: ComponentClass<P> | StatelessComponent<P>,
): ComponentClass<P & Stores>;