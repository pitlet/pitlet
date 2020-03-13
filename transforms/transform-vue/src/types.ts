export interface Asset {
  readonly id: string
  readonly content: string
}

interface ChildAssetAbstract {
  /**
   * The type of the asset.
   */
  readonly type: string
  readonly id: string
}

/**
 * An asset that doesn't exist on the filesystem.
 */
export interface ChildAssetVirtual extends ChildAssetAbstract {
  /**
   * The content of the virtual asset.
   */
  readonly content: string
}

/**
 * An asset that exists on the file system.
 */
export interface ChildAssetActual extends ChildAssetAbstract {
  /**
   * The import path that corresponds to this asset.
   */
  readonly importee: string
}

export interface TransformedAsset extends Asset {
  readonly directDependencies?: readonly string[]
  readonly importMapActual?: {
    readonly [key: string]: ChildAssetActual
  }
  readonly importMapVirtual?: {
    readonly [key: string]: ChildAssetVirtual
  }
}

export interface TransformApi {
  readonly getFileName: (asset: Asset) => string
}

export type Transform<
  Api extends Partial<TransformApi>,
  Options extends object
> = (api: Api, options: Options) => (asset: Asset) => Promise<Asset>
