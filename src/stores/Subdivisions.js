import { decorate, observable, action, computed, extendObservable } from "mobx";
import { isEmpty, get } from "lodash";

import { lookup } from '../lib/LookupService';

class Subdivisions {
    loading = false;
    result = {};

    /**
     * @param {Array} data
     */
    get bounds() {
        const bounds = get(this.result, 'bounds', []);

        if (bounds.length >= 4) {
            return [
                [bounds[0], bounds[2]],
                [bounds[1], bounds[3]],
            ];
        }

        return null;
    }

    get subdivisions() {
        const data = get(this.result, 'data', []);
        const features = get(this.result, 'data.features', []);

        if (!isEmpty(features)) {
            // ugly mapping to raw JS objects
            return [JSON.parse(JSON.stringify(data))];
        }

        return [];
    }

    clear() {
        this.result = {};
    }

    async lookup({ query }) {
        this.loading = true;
        this.clear();
        extendObservable(
            this.result,
            await lookup({ name: query }) || {},
        );
        this.loading = false;

        if (this.bounds === null) {
            return;
        }
    }
}

decorate(Subdivisions, {
    loading: observable,
    result: observable,
    bounds: computed,
    subdivisions: computed,
    lookup: action,
    clear: action,
});

const subdivisions = new Subdivisions();

Object.assign(window, {
    subdivisions,
});

export {
    subdivisions,
};
