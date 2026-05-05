import { area, city, province } from "./data";

export type SortOrder = "asc" | "desc" | "ASC" | "DESC";
export type SortSpec<T extends object> = Partial<
  Record<keyof T, SortOrder>
>;
export type FieldSpec<T extends object> =
  | Array<keyof T>
  | Partial<Record<keyof T, string>>;

export interface BaseRecord {
  id: string;
  name: string;
  fullName: string;
  pinyin: string;
  pinyinInitial: string;
}

export interface ProvinceRecord extends BaseRecord {
  shortName: string;
}

export interface CityRecord extends BaseRecord {
  areaCode: string;
}

export interface AreaRecord extends BaseRecord {
  areaCode: string;
}
export type RegionRecord = ProvinceRecord | CityRecord | AreaRecord;

type StringKeyOf<T> = Extract<keyof T, string>;
type DataMap<T> = Record<string, T[] | undefined>;

const provinces = province as ProvinceRecord[];
const cities = city as DataMap<CityRecord>;
const areas = area as DataMap<AreaRecord>;

const isNonemptyArray = <T>(collection: T[] | undefined): collection is T[] =>
  Array.isArray(collection) && collection.length > 0;

const normalizePid = (pid: number | string | undefined): string | undefined => {
  if (typeof pid === "number") {
    return pid.toString();
  }

  return typeof pid === "string" && pid ? pid : undefined;
};

const normalizeFieldSpec = <T extends object>(
  field?: FieldSpec<T>,
): Partial<Record<StringKeyOf<T>, string>> | undefined => {
  if (Array.isArray(field)) {
    return field.reduce<Partial<Record<StringKeyOf<T>, string>>>(
      (result, key) => {
        result[key as StringKeyOf<T>] = key as string;
        return result;
      },
      {},
    );
  }

  return field as Partial<Record<StringKeyOf<T>, string>> | undefined;
};

const groupByFields = <T extends object>(
  collection: T[],
  fields: Array<StringKeyOf<T>>,
): T[][] => {
  if (!isNonemptyArray(collection) || !isNonemptyArray(fields)) {
    return [];
  }

  const map = new Map<string, T[]>();

  collection.forEach((item) => {
    const key = fields
      .map((field) =>
        Object.prototype.hasOwnProperty.call(item, field) ? String(item[field]) : "",
      )
      .join("");
    const group = map.get(key);

    if (group) {
      group.push(item);
    } else {
      map.set(key, [item]);
    }
  });

  return [...map.values()];
};

const compareValues = (
  a: unknown,
  b: unknown,
  order: SortOrder | undefined,
): number => {
  if (a === b) {
    return 0;
  }

  const direction = order === "desc" || order === "DESC" ? -1 : 1;

  if (a == null || b == null) {
    if (a == null && b == null) {
      return 0;
    }

    return a == null ? -1 * direction : direction;
  }

  if (typeof a === "number" && typeof b === "number") {
    return (a - b) * direction;
  }

  return String(a).localeCompare(String(b)) * direction;
};

const singleOrderBy = <T extends object>(
  collection: T[],
  field: StringKeyOf<T>,
  order?: SortOrder,
): T[] =>
  collection
    .slice()
    .sort((left, right) => compareValues(left[field], right[field], order));

export const orderBy = <T extends object>(
  collection: T[] | undefined,
  sort?: SortSpec<T>,
): T[] => {
  if (
    !isNonemptyArray(collection) ||
    !sort ||
    typeof sort !== "object" ||
    Object.keys(sort).length === 0
  ) {
    return Array.isArray(collection) ? collection.slice() : [];
  }

  const sortFields = Object.keys(sort) as Array<StringKeyOf<T>>;
  const firstField = sortFields.shift();

  if (!firstField) {
    return collection.slice();
  }

  let result = singleOrderBy(collection, firstField, sort[firstField]);
  const groupFields = [firstField];

  sortFields.forEach((sortField) => {
    const groups = groupByFields(result, groupFields);
    result = groups.flatMap((group) =>
      singleOrderBy(group, sortField, sort[sortField]),
    );
    groupFields.push(sortField);
  });

  return result;
};

const pickFields = <T extends object>(
  collection: T[],
  field?: FieldSpec<T>,
): Array<T | Record<string, unknown>> => {
  const normalizedField = normalizeFieldSpec(field);

  if (
    !isNonemptyArray(collection) ||
    !normalizedField ||
    Object.keys(normalizedField).length === 0
  ) {
    return collection;
  }

  return collection.map((item) => {
    const picked: Record<string, unknown> = {};

    Object.entries(normalizedField).forEach(([sourceKey, outputKey]) => {
      if (
        typeof outputKey === "string" &&
        outputKey &&
        Object.prototype.hasOwnProperty.call(item, sourceKey) &&
        item[sourceKey as StringKeyOf<T>] != null
      ) {
        picked[outputKey] = item[sourceKey as StringKeyOf<T>];
      }
    });

    return Object.keys(picked).length > 0 ? picked : item;
  });
};

const getCityArea = <T extends CityRecord | AreaRecord>(
  source: DataMap<T>,
  pid: number | string | undefined,
  field?: FieldSpec<T>,
  sort?: SortSpec<T>,
): Array<T | Record<string, unknown>> => {
  const normalizedPid = normalizePid(pid);

  if (!normalizedPid) {
    return [];
  }

  const result = orderBy(source[normalizedPid], sort);
  return pickFields(result, field);
};

export function getProvinces(): ProvinceRecord[];
export function getProvinces(
  field: undefined,
  sort?: SortSpec<ProvinceRecord>,
): ProvinceRecord[];
export function getProvinces(
  field: FieldSpec<ProvinceRecord>,
  sort?: SortSpec<ProvinceRecord>,
): Array<Partial<ProvinceRecord> | Record<string, unknown>>;
export function getProvinces(
  field?: FieldSpec<ProvinceRecord>,
  sort?: SortSpec<ProvinceRecord>,
): Array<ProvinceRecord | Partial<ProvinceRecord> | Record<string, unknown>> {
  const result = orderBy(provinces, sort ?? { id: "asc" });
  return pickFields(result, field);
}

export function getCitys(pid: number | string | undefined): CityRecord[];
export function getCitys(
  pid: number | string | undefined,
  field: undefined,
  sort?: SortSpec<CityRecord>,
): CityRecord[];
export function getCitys(
  pid: number | string | undefined,
  field: FieldSpec<CityRecord>,
  sort?: SortSpec<CityRecord>,
): Array<Partial<CityRecord> | Record<string, unknown>>;
export function getCitys(
  pid: number | string | undefined,
  field?: FieldSpec<CityRecord>,
  sort?: SortSpec<CityRecord>,
): Array<CityRecord | Partial<CityRecord> | Record<string, unknown>> {
  return getCityArea(cities, pid, field, sort);
}

export function getAreas(pid: number | string | undefined): AreaRecord[];
export function getAreas(
  pid: number | string | undefined,
  field: undefined,
  sort?: SortSpec<AreaRecord>,
): AreaRecord[];
export function getAreas(
  pid: number | string | undefined,
  field: FieldSpec<AreaRecord>,
  sort?: SortSpec<AreaRecord>,
): Array<Partial<AreaRecord> | Record<string, unknown>>;
export function getAreas(
  pid: number | string | undefined,
  field?: FieldSpec<AreaRecord>,
  sort?: SortSpec<AreaRecord>,
): Array<AreaRecord | Partial<AreaRecord> | Record<string, unknown>> {
  return getCityArea(areas, pid, field, sort);
}
