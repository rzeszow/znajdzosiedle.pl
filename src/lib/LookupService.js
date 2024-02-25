import axios from 'axios';
import { get } from 'lodash';
import toastr from 'toastr';

function resolveCity({ address: { city, county }, display_name }) {
    return city || county || display_name;
}

function findCityItem(items) {
    for (const item of items) {
        if (get(item, 'address.city')) {
            return item;
        }
    }
    throw new Error('Nominatim could not find a city');
}

function wait(timeout = 1000, ...params) {
    return new Promise((resolve) => {
        const tt = setTimeout(() => {
            resolve(params);
            clearTimeout(tt);
        }, timeout);
    });
}

async function lookup({
    name,
    limit = 10,
}) {
    const result = {
        display_name: null,
        city: null,
        osm_id: null,
        bounds: [],
        data: [],
    };

    return await axios
        .get(`https://nominatim.openstreetmap.org/?q=${name}&accept-language=pl&format=json&countrycodes=pl&addressdetails=1&limit=${limit}`)
        .then(res => get(res, 'data', []))
        .then(res => res.shift())
        .then(item => {
            Object.assign(result, {
                city: resolveCity(item),
                bounds: get(item, 'boundingbox', []), 
                display_name: get(item, 'display_name', null),
            });
        })
        .then(() => wait(1000, result.city))
        .then((city) => axios.get(`https://nominatim.openstreetmap.org/?city=${city}&format=json&class=boundary&countrycodes=pl&addressdetails=1&limit=${limit}`))
        .then(res => findCityItem(res.data))
        .then(item => {
            Object.assign(result, {
                city: resolveCity(item),
                osm_id: get(item, 'osm_id', result.osm_id),
                bounds: result.bounds || get(item, 'boundingbox', []),
            });
        })
        .then(() => {
            const params = new URLSearchParams([
                ['city', result.city],
                ['osm_id', result.osm_id],
            ]);
            return axios.post(
              '/api', 
              params,
              {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                }
              }
            );
        })
        .then((response) => {
            Object.assign(result, {
                data: get(response, 'data.data', null),
            });

            return result;
        })
        .catch(e => {
            toastr.error(`Przepraszamy, ale nie udało się zlokalizować osiedli dla: ${name}`)
            return {
                display_name: null,
                city: null,
                osm_id: null,
                bounds: [],
                data: [],
            };
        })
        ;
}

class LookupResult {
    displayName;
    osmId;
    city;
    data;
    bounds;
    features;
}

export {
    LookupResult,
    lookup,
};
