# province-city-area

> 省市区数据工具包，含有省市区三级数据，支持排序和自定义返回的数据属性。

### 安装

```
$npm install province-city-area --save
```

### 数据对象

| 属性           | 类型   | 说明       |
| :------------- | :----- | :--------- |
| id             | string | id         |
| pid            | string | pid        |
| name           | string | 名称       |
| full_name      | string | 全称       |
| short_name     | string | 简称       |
| pinyin         | string | 拼音       |
| pinyin_initial | string | 拼音首字母 |
| area_code      | string | 区号       |

### 数据说明

- province、area 的区号为 null，city 的区号不为空。
- 台湾、香港、澳门的 city 数据中 name、full_name、short_name 相同。

> 数据为个人整理，难免有遗漏和疏忽，如有错误，欢迎指正，谢谢。

### 使用说明

##### getProvinces(field, sort)

- filed 返回数组元素的属性，可选参数。默认返回数据对象的全部属性，支持传数组或对象，数组元素或对象属性必须为数据对象中的属性。例如：`["id", "name", "pinyin"]`，则返回`[{id:"xx1",name:"xx1",pinyin:"xx1"},{id:"xx2",name:"xx2",pinyin:"xx2"}...]`。同时也支持传对象参数更改返回值的对象属性，例如：`{id:"value",name:"label"}`，则返回`[{value:"xx1",label:"xx1"},{value:"xx2",label:"xx2"}...]`。

- sort 字段和排序规则对象，可选参数。默认按 id 升序。例如：`{id:"desc",pinyin:"desc"}`，排序对象的属性必须为数据对象中的属性，属性定义的顺序影响排序的结果，值为 asc 或 desc。

##### getCitys(pid, field, sort)

- pid 省 id，必填参数。
- filed，参考 getProvinces。
- sort，参考 getProvinces。

##### getAreas(pid, field, sort)

- pid 地市 id，必填参数。
- filed，参考 getProvinces。
- sort，参考 getProvinces。

### 使用示例

```
import { getProvinces, getCitys, getAreas } from "province-city-area";

getProvinces({ id: "key", name: "label" }, { pinyin: "asc" });
//=> [{"key":"34","label":"安徽"},{"key":"82","label":"澳门"},{"key":"11","label":"北京"},{"key":"50","label":"重庆"},{"key":"35","label":"福建"},{"key":"62","label":"甘肃"},{"key":"44","label":"广东"},{"key":"45","label":"广西"},{"key":"52","label":"贵州"},{"key":"46","label":"海南"},{"key":"13","label":"河北"},{"key":"41","label":"河南"},{"key":"23","label":"黑龙江"},{"key":"42","label":"湖北"},{"key":"43","label":"湖南"},{"key":"22","label":"吉林"},{"key":"32","label":"江苏"},{"key":"36","label":"江西"},{"key":"21","label":"辽宁"},{"key":"15","label":"内蒙古"},{"key":"64","label":"宁夏"},{"key":"63","label":"青海"},{"key":"37","label":"山东"},{"key":"14","label":"山西"},{"key":"61","label":"陕西"},{"key":"31","label":"上海"},{"key":"51","label":"四川"},{"key":"71","label":"台湾"},{"key":"12","label":"天津"},{"key":"54","label":"西藏"},{"key":"81","label":"香港"},{"key":"65","label":"新疆"},{"key":"53","label":"云南"},{"key":"33","label":"浙江"}]

getCitys(42, { id: "i", name: "n" });
//=> [{"i":"4201","n":"武汉"},{"i":"4202","n":"黄石"},{"i":"4203","n":"十堰"},{"i":"4205","n":"宜昌"},{"i":"4206","n":"襄阳"},{"i":"4207","n":"鄂州"},{"i":"4208","n":"荆门"},{"i":"4209","n":"孝感"},{"i":"4210","n":"荆州"},{"i":"4211","n":"黄冈"},{"i":"4212","n":"咸宁"},{"i":"4213","n":"随州"},{"i":"4228","n":"恩施"},{"i":"429004","n":"仙桃"},{"i":"429005","n":"潜江"},{"i":"429006","n":"天门"},{"i":"429021","n":"神农架"}]

getCitys(42, ["id", "name"]);
//=> [{"id":"4201","name":"武汉"},{"id":"4202","name":"黄石"},{"id":"4203","name":"十堰"},{"id":"4205","name":"宜昌"},{"id":"4206","name":"襄阳"},{"id":"4207","name":"鄂州"},{"id":"4208","name":"荆门"},{"id":"4209","name":"孝感"},{"id":"4210","name":"荆州"},{"id":"4211","name":"黄冈"},{"id":"4212","name":"咸宁"},{"id":"4213","name":"随州"},{"id":"4228","name":"恩施"},{"id":"429004","name":"仙桃"},{"id":"429005","name":"潜江"},{"id":"429006","name":"天门"},{"id":"429021","name":"神农架"}]

getAreas(4213);
//=> [{"fullName":"曾都区","id":"421303","name":"曾都","pinyin":"zeng_du","pinyinInitial":"Z"},{"fullName":"随县","id":"421321","name":"随县","pinyin":"sui_xian","pinyinInitial":"S"},{"fullName":"广水市","id":"421381","name":"广水","pinyin":"guang_shui","pinyinInitial":"G"}]
```

### 价值 (   ) 的排序方法

orderBy(collection, sort)：数组对象排序方法，支持多个属性排序，支持中文排序。

- collection 对象数组。
- sort 字段和排序规则对象，排序对象的属性必须为数据对象中的属性，属性定义的顺序影响排序的结果，值为 asc 或 desc。

```
import { orderBy } from "province-city-area";
const students = [
    {"id":"11","name":"刘一","total":700,"en":150,"pe":"C"},
    {"id":"12","name":"陈二","total":700,"en":149,"pe":"B"},
    {"id":"13","name":"张三","total":700,"en":149,"pe":"A"},
    {"id":"14","name":"李四","total":700,"en":149,"pe":"A"},
    {"id":"15","name":"王五","total":720,"en":150,"pe":"A"},
    {"id":"16","name":"赵六","total":700,"en":150,"pe":"A"},
    {"id":"17","name":"孙七","total":700,"en":149,"pe":"A"},
    {"id":"18","name":"周八","total":700,"en":150,"pe":"B"},
    {"id":"19","name":"吴九","total":720,"en":149,"pe":"A"},
    {"id":"20","name":"郑十","total":720,"en":150,"pe":"B"}
];

orderBy(students, { total: "desc", en: "asc" });
//=>[{"id":"19","name":"吴九","total":720,"en":149,"pe":"A"},
//=> {"id":"15","name":"王五","total":720,"en":150,"pe":"A"},
//=> {"id":"20","name":"郑十","total":720,"en":150,"pe":"B"},
//=> {"id":"12","name":"陈二","total":700,"en":149,"pe":"B"},
//=> {"id":"13","name":"张三","total":700,"en":149,"pe":"A"},
//=> {"id":"14","name":"李四","total":700,"en":149,"pe":"A"},
//=> {"id":"17","name":"孙七","total":700,"en":149,"pe":"A"},
//=> {"id":"11","name":"刘一","total":700,"en":150,"pe":"C"},
//=> {"id":"16","name":"赵六","total":700,"en":150,"pe":"A"},
//=> {"id":"18","name":"周八","total":700,"en":150,"pe":"B"}]

orderBy(students, { pe: "asc", name: "asc" });
//=>[{"id":"14","name":"李四","total":700,"en":149,"pe":"A"},
//=> {"id":"17","name":"孙七","total":700,"en":149,"pe":"A"},
//=> {"id":"15","name":"王五","total":720,"en":150,"pe":"A"},
//=> {"id":"19","name":"吴九","total":720,"en":149,"pe":"A"},
//=> {"id":"13","name":"张三","total":700,"en":149,"pe":"A"},
//=> {"id":"16","name":"赵六","total":700,"en":150,"pe":"A"},
//=> {"id":"12","name":"陈二","total":700,"en":149,"pe":"B"},
//=> {"id":"20","name":"郑十","total":720,"en":150,"pe":"B"},
//=> {"id":"18","name":"周八","total":700,"en":150,"pe":"B"},
//=> {"id":"11","name":"刘一","total":700,"en":150,"pe":"C"}]
```

> Hope you will like !
