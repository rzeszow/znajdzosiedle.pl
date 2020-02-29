import fs from 'fs';
import http, { IncomingMessage } from 'http';
import { parse } from 'querystring';
import overpass from 'query-overpass';
import slugify from 'slugify';

const port = process.env.APP_PORT || 3001;
const CACHE_PATH = process.env.APP_CACHE || `${process.cwd()}/var/cache`;

/**
 * @param {IncomingMessage} req 
 */
const getPost = async (req) => {
    return new Promise((resolve, reject) => {
        const FORM_URLENCODED = 'application/x-www-form-urlencoded';

        if(req.headers['content-type'] !== FORM_URLENCODED) {
            reject(null);
            return;
        }

        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            resolve(parse(body));
        });
    })
}


async function buildOverpassQuery(city) {
    return `
[out:json][timeout:60];
(
  area[name="${city}"]["name:prefix"="miasto"][admin_level=8][boundary=administrative]->.myarea;
  relation(area.myarea)[boundary=administrative][admin_level=9];
);
out body;
>;
out skel qt;
`
};


/**
 * @param {string} city 
 * @returns {Promise<>}
 */
async function getOsmData(city) {
    const osmQuery = await buildOverpassQuery(city);

    return await new Promise((resolve) => {
        overpass(osmQuery, (error, data) => {
            if (error === undefined) {
                resolve(data);
                return;
            }

            console.log({msg: 'overpass api error: ', error});

            reject(null);
            // reject(error);
        });
    });
}

function getCachePath(city, osm_id) {
    const citySlug = slugify(`${city}_${osm_id}`.toLowerCase());
    return `${CACHE_PATH}/${citySlug}.json`;
}

async function getOsmDataCached(path) {
    try {
        return fs.readFileSync(path);
    } catch (e) {
        return null;
    }
}

async function saveCacheData(path, data) {
    return fs.writeFileSync(path, data);
}

/**
 * @param {string} name
 */
async function lookup({ name, osm_id }, purge = false) {
    const path = getCachePath(name, osm_id);
    const cityGeoJson = await getOsmDataCached(path);

    if (null !== cityGeoJson && !purge) {
        return JSON.parse(cityGeoJson);
    }

    const overpassData = await getOsmData(name);
    await saveCacheData(path, JSON.stringify(overpassData));

    return overpassData;
}

try {

    http.createServer(async function (req, res) {
        const { city, osm_id, purge = false } = await getPost(req)
        
        if (!city) {
            res.statusCode = 400;
            res.end('Missing `city` name');
        }
    
        const data = await lookup({ name: city, osm_id }, !!purge);
    
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({city, data}));
        res.end();
      })
      .listen(port);
    
} catch (error) {
    console.log(`An error occurred`);
    console.log(error);
}