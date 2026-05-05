# province-city-area

中国省、市、区县行政区划数据包，提供 TypeScript 类型声明，支持 ESM、CommonJS、字段映射和多字段排序。

## 特性

- 内置省级、市级、区县级行政区划数据。
- 提供 `getProvinces`、`getCitys`、`getAreas` 查询方法。
- 支持按字段筛选返回结果，也支持把字段名映射成 `value`、`label` 等业务字段。
- 支持按一个或多个字段排序。
- 同时发布 ESM、CommonJS 和 `.d.ts` 类型声明。
- npm 包内保留 `data/province_city_area.sql`，便于导入数据库或做数据校验。

## 安装

```bash
npm install province-city-area
```

## 快速开始

```ts
import { getAreas, getCitys, getProvinces } from "province-city-area";

const provinces = getProvinces();
const hubeiCities = getCitys("42");
const wuhanAreas = getAreas("4201");
```

CommonJS 项目可以这样使用：

```js
const { getAreas, getCitys, getProvinces } = require("province-city-area");
```

## 数据规模

当前运行时数据由 `data/province_city_area.sql` 生成：

| 级别 | 数量 |
| :--- | ---: |
| 省级 | 34 |
| 市级 | 470 |
| 区县级 | 2970 |
| 合计 | 3474 |

数据包含中国大陆省、自治区、直辖市，以及台湾、香港、澳门数据。

## 数据结构

### ProvinceRecord

```ts
interface ProvinceRecord {
  id: string;
  name: string;
  fullName: string;
  shortName: string;
  pinyin: string;
  pinyinInitial: string;
}
```

### CityRecord

```ts
interface CityRecord {
  id: string;
  name: string;
  fullName: string;
  areaCode: string;
  pinyin: string;
  pinyinInitial: string;
}
```

### AreaRecord

```ts
interface AreaRecord {
  id: string;
  name: string;
  fullName: string;
  areaCode: string;
  pinyin: string;
  pinyinInitial: string;
}
```

说明：

- `id` 为行政区划代码。
- `name` 为常用名称。
- `fullName` 为完整名称。
- `shortName` 主要用于省级简称，例如 `京`、`沪`、`粤`。
- `areaCode` 为电话区号；没有区号的数据返回空字符串。
- `pinyin` 使用下划线分隔，例如 `bei_jing`。
- `pinyinInitial` 为拼音首字母。

## API

### getProvinces(field?, sort?)

获取省级数据。

```ts
getProvinces();
getProvinces(["id", "name"]);
getProvinces({ id: "value", name: "label" });
getProvinces(undefined, { id: "desc" });
```

### getCitys(pid, field?, sort?)

获取指定省级行政区下的市级数据。方法名 `getCitys` 保留了旧版本 API 命名，用于兼容历史调用。

```ts
getCitys("42");
getCitys(42, ["id", "name", "areaCode"]);
getCitys("42", { id: "value", name: "label" });
getCitys("42", undefined, { pinyin: "asc" });
```

### getAreas(pid, field?, sort?)

获取指定市级行政区下的区县级数据。

```ts
getAreas("4201");
getAreas(4201, ["id", "name"]);
getAreas("4201", { id: "value", name: "label" });
getAreas("4201", undefined, { id: "desc" });
```

### orderBy(collection, sort?)

通用数组排序方法。查询方法内部也使用了这个方法处理 `sort` 参数。

```ts
import { orderBy } from "province-city-area";

const result = orderBy(
  [
    { id: "1", name: "武汉市", pinyin: "wu_han" },
    { id: "2", name: "黄石市", pinyin: "huang_shi" },
  ],
  { pinyin: "asc" },
);
```

## 参数说明

### field

`field` 用于控制返回字段。它支持两种形式：

```ts
getCitys("42", ["id", "name"]);
// => [{ id: "4201", name: "武汉市" }, ...]

getCitys("42", { id: "value", name: "label" });
// => [{ value: "4201", label: "武汉市" }, ...]
```

如果不传 `field`，会返回完整数据对象。

### sort

`sort` 用于控制排序，值支持 `asc`、`desc`、`ASC`、`DESC`。

```ts
getCitys("42", undefined, { id: "desc" });
getCitys("42", undefined, { pinyin: "asc", id: "asc" });
```

多字段排序会按对象字段声明顺序依次生效。

## 示例

```ts
import { getAreas, getCitys, getProvinces } from "province-city-area";

const provinceOptions = getProvinces({ id: "value", name: "label" });

const cityOptions = getCitys("42", {
  id: "value",
  name: "label",
});

const areaOptions = getAreas("4201", ["id", "name"]);

console.log(provinceOptions[0]);
// { value: "11", label: "北京市" }

console.log(cityOptions[0]);
// { value: "4201", label: "武汉市" }

console.log(areaOptions[0]);
// { id: "420102", name: "江岸区" }
```

## 数据文件

仓库中保留两份数据形态：

- `data/province_city_area.sql`：SQL 原始数据，可直接用于数据库导入。
- `src/data.ts`：由 SQL 生成的运行时数据，随源码构建到 `dist`。

发布到 npm 时会包含 `dist` 和 `data`。业务代码通常只需要从包入口导入方法；如果需要数据库初始化，可以使用包内的 SQL 文件。

## 开发

```bash
npm install
npm run typecheck
npm run build
```

构建产物会输出到 `dist`：

```text
dist/index.js
dist/index.cjs
dist/index.d.ts
```

发包前可以先检查 npm 包内容：

```bash
npm pack --dry-run
```

## License

MIT
