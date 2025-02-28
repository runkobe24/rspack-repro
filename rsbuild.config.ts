import { defineConfig } from "@rsbuild/core";
import { pluginVue } from "@rsbuild/plugin-vue";
import { pluginEslint } from "@rsbuild/plugin-eslint";
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { pluginStylus } from '@rsbuild/plugin-stylus';
import { VueLoaderPlugin } from 'vue-loader'
const path = require('path')

export default defineConfig({
  output: {
    // assetPrefix: './',
    distPath: {
      // root: path.resolve(__dirname, 'dist'),
      // assets: './dist',
      js: './js',
      css: './css',
      // html: '.',
      image: './img',
      svg: './img',
      jsAsync: './js',
      cssAsync: './css',
      font: './fonts'
    },
    filename: {
      css:
        process.env.NODE_ENV === 'production'
          ? '[name].[contenthash:8].css'
          : '[name].css',
    },

    // manifest: true
  },

  source: {
    // 指定入口文件
    entry: {
      index: './src/index.ts',
    },

    define: {
    },
  },

  performance: {
    buildCache: true
  },

  plugins: [
    pluginVue(),
    pluginEslint({
      enable: process.env.NODE_ENV === "development",
      eslintPluginOptions: {
        // cwd: '/.eslintrc.js',
        // overrideConfigFile: './.eslintrc.js',
        useEslintrc: true,
        failOnError: true,
        // 设置为 true 时，出现 ESLint 警告也将导致构建失败（可按需选择）
        failOnWarning: true,
        emitWarning: true,
        emitError: true,
        extensions: ["js", "vue"],
      },
    }),
    pluginStylus({
      stylusOptions: {
        import: [path.join(__dirname, "./src/lib/stylus/vars.styl")],
      }
    }), 
  ],
  
  tools: {
    lightningcssLoader: false,
    rspack: {
      plugins: [
        new VueLoaderPlugin(),
        new ForkTsCheckerWebpackPlugin({
          issue: {
            exclude: [{code: 'TS2322 TS2538'}],
          },
          typescript: {
            extensions: {
              vue: {
                enabled: true,
                compiler: '@vue/compiler-sfc',
              },
            }
          }
        }),
      ],
      optimization: {
        // 这里需要修改，目前会导致热更新失效，所以注释掉
        // 因为production模式默认为deterministic，所以不影响
        // moduleIds: 'deterministic',
        // 计算真实hash值
        moduleIds: process.env.NODE_ENV === 'production' ? 'deterministic' : 'named',
        realContentHash: true,
        runtimeChunk: 'single',
        splitChunks: {
          cacheGroups: {
            // 将其他 npm 模块抽离出来
            vendor: {
              chunks: 'all',
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                // antd 打包到独立文件
                if (/(ant-design-vue|@ant-design[\\/])/.test(module?.resource || '')) {
                  return 'antd'
                }
                // echarts 太大
                if (/zrender|echarts/.test(module?.resource || '')) {
                  return 'echarts'
                }
                // js基础第三方库，并用自身的包名来命名
                if (/(jsbarcode|sortablejs|jsqr|cropperjs|js-pinyin|aes-js)/.test(module?.resource || '')) {
                  return RegExp.$1.replace('@', '')
                }
                // 把vue-i8n打包到独立文件
                if (/vue-i18n/.test(module?.resource || '')) {
                  return 'vue-i18n'
                }
                // sentry开头的 打包到独立文件
                if (/@sentry|@sentry[-/]/.test(module?.resource || '')) {
                  return 'sentry'
                }
                if (/tinymce/.test(module?.resource || '')) {
                  return 'tinymce'
                }
                if (/chuangkit/.test(module.resource || '')) {
                  return 'poster'
                }
                return 'vendor'
              },
              minSize: 0,
              priority: 10
            },
            region: {
              chunks: 'all',
              test: /[\\/]config[\\/]region/,
              name: 'region-data'
            }
          }
        }
      }
    }
  },
});
