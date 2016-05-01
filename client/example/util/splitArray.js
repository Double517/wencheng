
export default function splitArray(list, key) {

    var dict = {};
    list.forEach(function (item) {
        var rows = dict[item[key]];
        if (!rows) {
            rows = [];
            dict[item[key]] = rows;
        }
        rows.push(item);
    });

    var sortedKeys = Object.keys(dict).sort();
    var bucket = sortedKeys.map(function (key) {
        return {key:key, list: dict[key]};
    });

    return bucket;
}
