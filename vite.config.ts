import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import styleImport from 'vite-plugin-style-import'
import { minifyHtml, injectHtml } from "vite-plugin-html";//引入html插件

//mode:当前环境变量标识符
// https://vitejs.dev/config/
export default ({ mode }) => { //mode=当前执行的编译环境变量

    const env = loadEnv(mode, process.cwd())//获取当前编译环境的env.[mode]下所有变量

    return defineConfig({
        base: env.VITE_APP_PUBLIC_PATH,
        resolve: {
            alias: { //别名
                "@": resolve("src"),
                "@assets": resolve("src/assets"),
                "@components": resolve("src/components"),
                "@routes": resolve("src/routes"),
                "@views": resolve("src/views"),
                "@utils": resolve("src/utils"),
                "@hooks": resolve("src/hooks"),
                "@api": resolve("src/api"),
            },
        },
        server: {
            proxy: {
                // 选项写法
                "/api": {
                    target: "http://192.168.1.142:8602/admin/",
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/api/, ""),
                },
            },
        },
        plugins: [
            vue(),
            minifyHtml(),//最小化
            injectHtml({ injectData: env }),//注入所有变量到index.html
            styleImport({
                libs: [{
                    libraryName: 'element-plus',
                    esModule: true,
                    ensureStyleFile: true,
                    resolveStyle: (name) => {
                        name = name.slice(3)
                        return `element-plus/packages/theme-chalk/src/${name}.scss`;
                    },
                    resolveComponent: (name) => {
                        return `element-plus/lib/${name}`;
                    },
                }]
            })
        ]
    })
}
