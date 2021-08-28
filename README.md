# wasm-loader

Wrapper for [@assemblyscript/loader](https://www.npmjs.com/package/@assemblyscript/loader) package to support older versions of Safari (desktop [3.1 - 14.1] / mobile [11 - 14.7])

- [API Docs](https://playerony.github.io/wasm-loader)

- [can I use - instantiate](https://caniuse.com/?search=instantiate)

- [can I use - instantiateStreaming](https://caniuse.com/?search=instantiateStreaming)

# Installation ([npm](https://www.npmjs.com/package/@playerony/wasm-loader))

```
npm i @playerony/wasm-loader
```

```
yarn add @playerony/wasm-loader
```

# Usage

```js
import getWasmLoader from '@playerony/wasm-loader';

const defaultImports = {
  index: {
    log(valueA, valueB) {
      console.log(valueA, valueB);
    },
  },
};

const wasmLoader = getWasmLoader(defaultImports);

const { memory, ...otherPropsYouDefinedInWasmFile } = await wasmLoader('/build/optimized.wasm');
```
