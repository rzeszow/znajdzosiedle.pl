import { decorate, observable, computed, action } from "mobx";

class QueryParamsStore {
    params = observable.map();

    /**
     * @param {Map<string, string>} params 
     */
    constructor(params) {
        this.setParams(params);
    }

    /**
     * @param {Map<string, string>} params 
     */
    setParams(params) {
        for (const [k, v] of params.entries()) {
            this.params.set(k, v);
        }
    }

    get queryString() {
        return (new URLSearchParams(this.params.entries())).toString();
    }

    setParam(k, v) {
        this.params.set(k, v);
    }
}

decorate(QueryParamsStore, {
    params: observable,
    setParams: action,
    setParam: action,
    queryString: computed,
});

const urlParams = new Map((new URLSearchParams(window.location.search)).entries());
const queryParams = new QueryParamsStore(urlParams);

Object.assign(window, {
    queryParams: queryParams,
});

export {
    queryParams,
};
