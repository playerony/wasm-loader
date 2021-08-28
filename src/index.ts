/**
 * @packageDocumentation Wrapper for @assemblyscript/loader package to support older versions of Safari (desktop [3.1 - 14.1] / mobile [11 - 14.7]).
 */

import * as loader from '@assemblyscript/loader';

/**
 * WebAssembly imports with an optional env object and two levels of nesting.
 *
 * @public
 */
export type TImports = loader.Imports | undefined;

/**
 * Asynchronously instantiates an AssemblyScript module from anything that can be instantiated.
 *
 * @public
 */
export type TWasmFetcher = <T extends Record<string, unknown>>(
  path: string,
  imports?: TImports,
) => Promise<loader.ASUtil & T>;

/**
 * Closure wrapper to allow user to keep a default imports configuration in memory.
 *
 * Function use 'instantiateStreaming' to process *.wasm file,
 * but if it is not possible to use, we use a 'instantiate' function.
 *
 * @param defaultImports - default imports.
 *
 * @public
 */
function wasmLoader(defaultImports?: TImports): TWasmFetcher {
  /**
   * Process *.wasm file content as bytes using a 'instantiate' function.
   *
   * @param path - path to *.wasm file.
   * @param imports - it will overwrite a defaultImports passed above.
   *
   * @@internal
   */
  async function wasmFallback<T extends Record<string, unknown>>(
    path: string,
    imports: TImports = defaultImports,
  ): Promise<loader.ASUtil & T> {
    const response = await fetch(path);
    const bytes = await response.arrayBuffer();

    const instance = await loader.instantiate<T>(bytes, imports);

    return instance?.exports;
  }

  /**
   * Process *.wasm file content using 'instantiateStreaming' function.
   *
   * @param path - path to *.wasm file.
   * @param imports - it will overwrite a defaultImports passed above.
   *
   * @public
   */
  async function wasmFetcher<T extends Record<string, unknown>>(
    path: string,
    imports: TImports = defaultImports,
  ): Promise<loader.ASUtil & T> {
    if (!loader.instantiateStreaming) {
      return wasmFallback<T>(path, imports);
    }

    const response = await fetch(path);
    const instance = await loader.instantiateStreaming<T>(response, imports);

    return instance?.exports;
  }

  return wasmFetcher;
}

export default wasmLoader;
