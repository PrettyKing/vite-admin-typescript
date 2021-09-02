## 关于vite+typescript的管理后台

### 基础设施

1. vite 初始化项目：【[vite官网](https://cn.vitejs.dev/guide/#scaffolding-your-first-vite-project)】

   ``` shell
   yarn create @vitejs/app
   ```

2. 添加vuex（装next版本）

   ```shell
   yarn add vuex@next
   ```

3. 最终项目文件目录

   ```js
   .
   ├── README.md
   ├── index.html
   ├── package.json
   ├── public
   │   └── favicon.ico
   ├── src
   │   ├── App.vue
   │   ├── assets
   │   │   └── logo.png
   │   ├── components
   │   │   └── HelloWorld.vue
   │   ├── hooks
   │   │   ├── index.ts
   │   │   └── useStore.ts
   │   ├── main.ts
   │   ├── shims-vue.d.ts
   │   └── store
   │       ├── index.ts
   │       ├── modules
   │       │   ├── user
   │       │   │   ├── actions.ts
   │       │   │   ├── constant.ts
   │       │   │   ├── getters.ts
   │       │   │   ├── index.ts
   │       │   │   ├── mutations.ts
   │       │   │   └── store.ts
   │       │   └── wechat
   │       │       ├── actions.ts
   │       │       ├── constant.ts
   │       │       ├── getters.ts
   │       │       ├── index.ts
   │       │       ├── mutations.ts
   │       │       └── store.ts
   │       ├── modules.ts
   │       └── utils.ts
   ├── tsconfig.json
   ├── vite.config.ts
   └── yarn.lock
   ```



### 最终效果

在写getters和dispatch时有类型提示，如下：

![dispatch](https://chalee-typora.oss-cn-beijing.aliyuncs.com/2021-05-05-160137.png)

![](https://chalee-typora.oss-cn-beijing.aliyuncs.com/2021-05-05-160326.png)



### 实现

- 核心

  - Hooks 主要封装一段相同的业务逻辑
  - 泛型推断出vuex中的getters和dispatch的类型

- store目录

  ```js
  ├── modules
  │   ├── user
  │   │   ├── actions.ts
  │   │   ├── constant.ts
  │   │   ├── getters.ts
  │   │   ├── index.ts
  │   │   ├── mutations.ts
  │   │   └── store.ts
  │   └── wechat
  │       ├── actions.ts
  │       ├── constant.ts
  │       ├── getters.ts
  │       ├── index.ts
  │       ├── mutations.ts
  │       └── store.ts
  ├── index.ts  	// store导出文件
  ├── modules.ts  // 模块集合
  └── utils.ts    // store的类型文件
  ```

- hooks(useStore)

  ```js
  import { useStore } from "vuex"
  import { State } from "../store"
  import { Getters, Action } from "../store/utils";
  
  interface IUserStore {
      state: State;
      getters: Getters,
      dispatch(action: Action, payload?: any): void
  }
  
  
  export const useHStore = () => {
      const store = useStore<State>()
      const { state, getters, dispatch }: IUserStore = store;
      return {
          state,
          getters,
          dispatch
      }
  }
  ```
  
- 实现getters

  1. 首先提取modules里面的所有getters，这里最终需要的效果是鼠标放在ModuleGetters上会显示所有modules里面的getters,具体实现如下：

     ``` typescript
     type GetGetter<Module> = Module extends { getters: infer G } ? G : unknown;
     
     type GetGetters<Modules> = {
         [K in keyof Modules]: GetGetter<Modules[K]>;
     }
     
     type ModuleGetters = GetGetters<typeof modules>; 
     // 	鼠标放在ModuleGetters上，会显示如下格式数据：
     //type ModuleGetters = {
     //    user: {
     //        isLogin: (state: {
     //            loading: boolean;
     //        }) => string;
     //    };
     //    wechat: {
     //        test: (state: {
     //           loading: boolean;
     //        }) => string;
     //    };
     //}
     ```

  2. 接下来要拼接模块名和方法名(KEY),这里的目标是把他推断成一个 `"user/isLogin" | "wechat/test"` 这样的联合类型:

     ``` typescript
     type AddPrefxi<P, K> = `${P & string}/${K & string}`
     
     type GetSpliceKey<M, K> = AddPrefxi<K, keyof M>
     
     type GetSpliceKeys<Modules> = {
         [K in keyof Modules]: GetSpliceKey<Modules[K], K>;
     }[keyof Modules]
     
     type xx = GetSpliceKeys<ModuleGetters>;
     // 最终这里的数据格式是：
     // type xx = "user/isLogin" | "wechat/test"
     ```

  3. 最后，要根据2中推断出的类型，拿到getters里面方法的返回值：

     ```typescript
     type GetFunc<T, A, B> = T[A & keyof T][B & keyof T[A & keyof T]]
     type GetSpliceObj<T> = {
         [K in GetSpliceKeys<T>]: K extends `${infer A}/${infer B}` ? GetFunc<T, A, B> : unknown;
     }
     type FinalModulesGetters = GetSpliceObj<ModuleGetters>;
     
     type Getters = {
         [K in keyof FinalModulesGetters]: ReturnType<FinalModulesGetters[K]>
     }
     // 这里的Getters就是最终要导出的类型
     // type Getters = {
     //    "user/isLogin": string;
     //    "wechat/test": string;
     //}
     ```

     

- 实现action

  > 由于在IUserStore 中使用的dispatch是个函数，接收两个参数第一个参数是action类型的，所以这里需要一个action的interface，这里的第二个参数是dispatch的数据，所以暂定为any(-_-)。

  actions的实现与上面getters的实现基本相同，只是最终只需要推断出`"user/isLogin" | "wechat/test"`这样的联合类型，这样用户在调用 `dispatch` 的时候，就可以智能提示了。这里记录一种其他方法，与getters略微不同：

  ``` typescript
  type GetMutations<Module> = Module extends { mutations: infer M } ? M : never
  
  type AddPrefix<Prefix, Keys> = `${Prefix & string}/${Keys & string}`
  
  type GetSubModuleKeys<Module, Key> = Module extends { modules: infer SubModules }
      ? AddPrefix<Key, GetModulesMutationKeys<SubModules>>
      : never
  
  type GetModuleMutationKeys<Module, Key> = AddPrefix<Key, keyof GetMutations<Module>> | GetSubModuleKeys<Module, Key>
  
  type GetModulesMutationKeys<Modules> = {
      [K in keyof Modules]: GetModuleMutationKeys<Modules[K], K>
  }[keyof Modules]
  
  type Action = GetModulesMutationKeys<typeof modules>
  ```

  

### tags

- 利用

  ```typescript
  type Values<Modules> = {
    [K in keyof Modules]: Modules[K]
  }[keyof Modules]
  ```

  这种方式可以轻松的把对象里的所有**值** 类型给展开，比如

  ```typescript
  type Obj = {
    a: 'foo'
    b: 'bar'
  }
  
  type T = Values<Obj> // 'foo' | 'bar'
  ```

- 实现一个拼接 `Key` 的类型，注意这里就用到了 TS 4.1 的字符串模板类型了,这里会自动把联合类型展开并分配，`${'cart'}/${'add' | 'remove'}` 会被推断成 `'cart/add' | 'cart/remove'`，不过由于我们传入的是 `keyof GetMutations<Module>` 它还有可能是 `symbol | number` 类型，所以用 `Keys & string` 来取其中的 `string` 类型:

  ````typescript
   type AddPrefix<Prefix, Keys> = `${Prefix}/${Keys}`
  ````

- 从 `Modules` 中提取 `Keys` 的工具类型，也就是 `GetModulesMutationKeys`，只需要递归调用即可，不过这里我们需要做一层预处理，把 `modules` 不存在的情况给排除掉：

  ```typescript
  type GetModuleMutationKeys<Module, Key> =
    // 这里直接拼接 key/mutation
    | AddPrefix<Key, keyof GetMutations<Module>>
    // 这里对子 modules 做 keys 的提取
    | GetSubModuleKeys<Module, Key>
  ```

  利用 extends 去判断类型结构，对不存在 `modules` 的结构直接返回 never，再用 infer 去提取出 Modules 的结构，并且把前一个模块的 `key` 拼接在刚刚写好的 `GetModulesMutationKeys` 返回的结果之前：

  ``` typescript
  type GetSubModuleKeys<Module, Key> = Module extends { modules: infer SubModules }
    ? AddPrefix<Key, GetModulesMutationKeys<SubModules>>
    : never
  ```




## 升级

- 最终目录

  ```js
  ├── src
  │   ├── api
  │   ├── assets
  │   ├── components
  │   ├── hooks
  │   ├── request
  │   ├── router
  │   ├── store
  │   ├── theme
  │   ├── utils
  │   └── views
  ├── index.html
  ├── prettier.config.js
  ├── tsconfig.json
  ├── vite.config.ts
  └── yarn.lock
  ```

### 笔记

- 环境变量说明

  ```
  .env                # 所有情况下都会加载
  .env.local          # 所有情况下都会加载，但会被 git 忽略
  .env.[mode]         # 只在指定模式下加载
  .env.[mode].local   # 只在指定模式下加载，但会被 git 忽略
  ```

- lint 代码风格检测

  ```shell
  yarn add eslint eslint-plugin-prettier eslint-plugin-vue @vue/eslint-config-prettier prettier babel-eslint babel-plugin-import --dev
  ```

- env变量的注入

- prettier.config.js

  ```js
  module.exports = {
      printWidth: 80, // 每行代码长度（默认80）
      tabWidth: 4, // 每个tab相当于多少个空格（默认2）
      useTabs: false, // 是否使用tab进行缩进（默认false）
      singleQuote: false, // 使用单引号（默认false）
      semi: true, // 声明结尾使用分号(默认true)
      trailingComma: 'es5', // 多行使用拖尾逗号（默认none）
      bracketSpacing: true, // 对象字面量的大括号间使用空格（默认true）
      jsxBracketSameLine: false, // 多行JSX中的>放置在最后一行的结尾，而不是另起一行（默认false）
      arrowParens: "avoid", // 只有一个参数的箭头函数的参数是否带圆括号（默认avoid）
  };
  ```

  



### 错误记录


```js
# yarn add eslint eslint-plugin-prettier eslint-plugin-vue @vue/eslint-config-prettier prettier babel-eslint babel-plugin-import --dev 
yarn add v1.22.10
warning package.json: No license field
warning ch-vite@0.0.0: No license field
[1/4] 🔍  Resolving packages...
info There appears to be trouble with your network connection. Retrying...
info There appears to be trouble with your network connection. Retrying...
warning babel-eslint@10.1.0: babel-eslint is now @babel/eslint-parser. This package will no longer receive updates.
[2/4] 🚚  Fetching packages...
error espree@8.0.0: The engine "node" is incompatible with this module. Expected version "^12.22.0 || ^14.17.0 || >=16.0.0". Got "12.18.3"
error Found incompatible module.
```

上述抛错
``` js
 yarn config set ignore-engines true
```