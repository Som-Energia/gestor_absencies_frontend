'use strict';
import m from 'mithril';

async function get_objects(url, headers) {
    let objects = await m.request({
        method: 'GET',
        url: url,
        headers: headers
    });
    if (objects.next != null) {
        return objects.results.concat(await get_objects(objects.next, headers));
    }
    else {
        return objects.results;
    }
}

export default get_objects