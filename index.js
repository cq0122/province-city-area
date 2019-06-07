import { kve } from "key-value-equal";
import { clone, orderBy, forEach } from "lodash";
import { province, city, area } from "./data";

const _orderBy = function(collection, sort) {
    if (
        Array.isArray(collection) &&
        collection.length > 0 &&
        sort &&
        typeof sort === "object" &&
        Object.keys(sort).length > 0
    ) {
        return orderBy(collection, Object.keys(sort), Object.values(sort));
    }
    return clone(collection);
};

const _handleItemField = function(collection, field) {
    field = Array.isArray(field) ? kve(field) : field;
    if (
        Array.isArray(collection) &&
        collection.length > 0 &&
        field &&
        typeof field === "object" &&
        Object.keys(field).length > 0
    ) {
        let newCollection = [],
            newItem;
        forEach(collection, function(item) {
            newItem = {};
            forEach(field, function(value, key) {
                if (item.hasOwnProperty(key) && item[key]) newItem[value] = item[key];
            });
            newCollection.push(Object.keys(newItem).length > 0 ? newItem : item);
        });
        return newCollection;
    }
    return collection;
};

const _getCityArea = function(type, pid, field, sort) {
    let result = [];
    pid = typeof pid === "number" ? pid.toString() : pid;
    if (pid && typeof pid === "string") {
        switch (type) {
            case 1:
                result = clone(city[pid]);
                break;
            case 2:
                result = clone(area[pid]);
                break;
            default:
                result = [];
        }

        result = _orderBy(result, sort);
        return _handleItemField(result, field);
    }
    return result;
};

export const getProvinces = function(field, sort) {
    let result = _orderBy(province, sort);
    return _handleItemField(result, field);
};

export const getCitys = function(pid, field, sort) {
    return _getCityArea(1, pid, field, sort);
};

export const getAreas = function(pid, field, sort) {
    return _getCityArea(2, pid, field, sort);
};
