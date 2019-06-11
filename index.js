import { kve } from "key-value-equal";
import { province, city, area } from "./data";

const _isNonemptyArray = function(collection) {
  return Array.isArray(collection) && collection.length > 0;
};

const _arrayGroup = function(collection, fields) {
  if (_isNonemptyArray(collection) && _isNonemptyArray(fields)) {
    const map = new Map();
    let key;
    collection.forEach(item => {
      key = "";
      fields.forEach(field => {
        key += item.hasOwnProperty(field) ? item[field] : "";
      });
      if (map.has(key)) {
        map.get(key).push(item);
      } else {
        map.set(key, [item]);
      }
    });
    return [...map.values()];
  }
  return [];
};

const _singleOrderBy = (collection, field, order) => {
  return collection.slice().sort(({ [field]: a }, { [field]: b }) => {
    if (a === null || a === undefined || b === null || b === undefined) {
      return order === "desc" || order === "DESC"
        ? b === null || b === undefined
          ? -1
          : 1
        : a === null || a === undefined
        ? -1
        : 1;
    }
    return order === "desc" || order === "DESC"
      ? typeof a === "number" && typeof b === "number"
        ? b - a
        : new String(b).localeCompare(new String(a))
      : typeof a === "number" && typeof b === "number"
      ? a - b
      : new String(a).localeCompare(new String(b));
  });
};

const _orderBy = function(collection, sort) {
  if (
    _isNonemptyArray(collection) &&
    sort &&
    typeof sort === "object" &&
    Object.keys(sort).length > 0
  ) {
    const sortFields = Object.keys(sort);

    let result = _singleOrderBy(collection, sortFields[0], sort[sortFields[0]]);
    let groupFields = [sortFields.shift()];
    if (sortFields.length > 0) {
      let groupReslut;
      sortFields.forEach(sortField => {
        groupReslut = _arrayGroup(result, groupFields);
        result.length = 0;
        groupReslut.forEach(group => {
          result = result.concat(
            _singleOrderBy(group, sortField, sort[sortField])
          );
        });
        groupFields.push(sortField);
      });
    }
    return result;
  }
  return Array.isArray(collection) ? collection.slice() : [];
};

const _handleItemField = function(collection, field) {
  field = Array.isArray(field) ? kve(field) : field;
  if (
    _isNonemptyArray(collection) &&
    field &&
    typeof field === "object" &&
    Object.keys(field).length > 0
  ) {
    let newCollection = [],
      newItem;
    collection.forEach(item => {
      newItem = {};
      Object.keys(field).forEach(key => {
        if (item.hasOwnProperty(key) && item[key])
          newItem[item[key]] = item[key];
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
        result = city[pid];
        break;
      case 2:
        result = area[pid];
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

export const orderBy = function(collection, sort) {
  return _orderBy(collection, sort);
};
