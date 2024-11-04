# vue-multi-tag-多页签脚手架，包含权限、UI组件等

[Vue3.4](https://cn.vuejs.org/) +
[VueRouter4.3.3](https://router.vuejs.org/zh/) +
[Pinia2.2](https://pinia.vuejs.org/zh/) +
[TS5.4](https://www.typescriptlang.org/) +
[Vite5.4](https://cn.vitejs.dev/) +
[VueSimpleUploader1.0.3](https://github.com/simple-uploader/vue-uploader/blob/vue3/README_zh-CN.md) +
[ElementPlus2.8](https://element-plus.org/zh-CN/) +
[PlusProComponents0.1.16](https://plus-pro-components.com/)

- Vue3多页签（细节待自行补充，主要补充cacheRoutes.ts等 TODO 标记）
- 权限（权限格式处理等还需自行补充，主要涉及beforeEach全局守卫、directives/permissions.ts）
- 路由懒加载、缓存
- elementplus按需引入、变量覆盖、全局样式、多语言
- PlusProComponents按需引入、变量覆盖、全局样式、多语言
- ProSelect、ProUpload、顶部侧边菜单、页签组件、axios等

**_ 不需要的功能可自行注释、删除 _**

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

### Current Node Version

node@22.4.0, at least node@18.3.0

### git commit rule

- feat: 新增功能（这和语义化版本中的 MINOR 相对应）
- fix: 修复 bug （这和语义化版本中的 PATCH 相对应）
- docs: 只是更改文档
- style: 不影响代码含义的变化（空白、格式化、缺少分号等）
- refactor: 代码重构，既不修复错误也不添加功能
- perf: 改进性能的代码更改
- test: 添加确实测试或更正现有的测试
- build: 影响构建系统或外部依赖关系的更改（示例范围：gulp、broccoli、NPM）
- ci: 更改持续集成文件和脚本（示例范围：Travis、Circle、BrowserStack、SauceLabs）
- chore: 其他不修改src或test文件
- revert: commit 回退
