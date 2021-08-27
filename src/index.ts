/**
 * @packageDocumentation Wrapper for @assemblyscript/loader package to support older versions of Safari (desktop [3.1 - 14.1] / mobile [11 - 14.7])
 */

import * as loader from '@assemblyscript/loader';

export type TImports = loader.Imports | undefined;

/**
 * Type of the function return after 'wasmLoader' function call
 *
 * @public
 */
export type TWasmFetcher = (
  path: string,
  imports?: TImports,
) => Promise<loader.ASUtil | Record<string, unknown>>;

/**
 * Closure wrapper to allow user to keep a default imports configuration in memory.
 *
 * Function use 'instantiateStreaming' to process *.wasm file,
 * but if it is not possible to use, we use a 'instantiate' function.
 *
 * @param defaultImports - default imports
 *
 * @public
 */
function wasmLoader(defaultImports?: TImports): TWasmFetcher {
  /**
   * Process *.wasm file content as bytes using a 'instantiate' function.
   *
   * @param path - path to *.wasm file
   * @param imports - it will overwrite a defaultImports passed above
   *
   * @private
   */
  async function wasmFallback(path: string, imports: TImports = defaultImports) {
    const response = await fetch(path);
    const bytes = await response.arrayBuffer();

    const instance = await loader.instantiate(bytes, imports);

    return instance?.exports;
  }

  /**
   * Process *.wasm file content using 'instantiateStreaming' function.
   *
   * @param path - path to *.wasm file
   * @param imports - it will overwrite a defaultImports passed above
   *
   * @public
   */
  async function wasmFetcher(path: string, imports: TImports = defaultImports) {
    if (!loader.instantiateStreaming) {
      return wasmFallback(path, imports);
    }

    const response = await fetch(path);
    const instance = await loader.instantiateStreaming(response, imports);

    return instance?.exports;
  }

  return wasmFetcher;
}

export default wasmLoader;
