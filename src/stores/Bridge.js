import { autorun } from "mobx";

class Bridge {
    /**
     * @param {QueryParams}
     */
    queryParams;
    /**
     * @param {Subdivisions}
     */
    subdivisions;

    disposers = [];

    constructor(queryParams, subdivisions) {
        this.queryParams = queryParams;
        this.subdivisions = subdivisions;

        const query = this.queryParams.params.get('q');
        if (!!query) {
            this.subdivisions.lookup({ query });
        }

        autorun(() => {
            const query = this.subdivisions.result.display_name;
            if (query) {
                this.queryParams.setParam('q', query);
                window.history.pushState(null, '', `?${this.queryParams.queryString}`)
            }
        })
    }

}

export {
    Bridge,
};
