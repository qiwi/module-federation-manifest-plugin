export interface ModuleFederationManifest {
  /**
   * Application name
   */
  name: string
  /**
   * Application version
   */
  version: string
  /**
   * Public path used in Webpack build
   */
  publicPath: string
  /**
   * Container entrypoint, can be `undefined` if application doesn't have entry (e.g. no modules exported)
   */
  entry?: {
    /**
     * Entrypoint file path relative to public path
     */
    path: string
  }
  /**
   * Exposed container modules
   */
  exposes?: {
    /**
     * Module name that will be used to load module from another container
     */
    [request: string]: {
      /**
       * Additional name for chunk
       */
      name?: string
    }
  }
  /**
   * Consumed shared modules in whole container
   */
  consumes?: {
    /**
     * Consumed module name
     */
    [k: string]: {
      /**
       * Exact or semantic version
       */
      version: string
      shareScope: string
      singleton: boolean
      eager: boolean
      strictVersion: boolean
    }[]
  }
  /**
   * Provided shared modules in whole container
   */
  provides?: {
    /**
     * Shared module name
     */
    [k: string]: {
      /**
       * Exact version
       */
      version: string
      shareScope: string
    }[]
  }
  /**
   * Used remotes
   */
  remotes?: {
    /**
     * Remote name
     */
    [k: string]: {
      /**
       * Which modules will be loaded from remote
       */
      modules: string[]
    }
  }
}
