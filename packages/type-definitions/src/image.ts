interface ImageURL {
  url: string
}

interface CamelSmallSquare {
  smallSquare: ImageURL
}

interface SnakeSmallSquare {
  // eslint-disable-next-line @typescript-eslint/camelcase
  small_square: ImageURL
}

type SmallSquare = CamelSmallSquare | SnakeSmallSquare

export type BaseSizes = 'small' | 'medium' | 'large'

export type GlobalSizes =
  | 'mini'
  | 'tiny'
  | 'big'
  | 'huge'
  | 'massive'
  | BaseSizes

export type GlobalColors = 'blue' | 'gray' | 'white' | 'red'

export type Ratio =
  | '4:1'
  | '5:3'
  | '11:7'
  | '4:3'
  | '1:1'
  | '10:11'
  | '5:8'
  | '9:5'

export type FrameRatioAndSizes =
  | Exclude<GlobalSizes, 'tiny' | 'massive'>
  | 'original'
  | Ratio

export interface ImageMeta {
  id: string
  type?: string
  title?: string | null
  description?: string | null
  sourceUrl?: string
  width?: number
  height?: number
  cloudinaryId?: string
  cloudinaryBucket?: string
  sizes: {
    full: ImageURL
    large: ImageURL
  } & SmallSquare
  video?: {
    full: { url: string }
    large: { url: string }
  } & SmallSquare
  attachmentId?: string
  /* TODO: Remove FrameRatioAndSizes from core-elements */
  frame?: FrameRatioAndSizes
  link?: {
    href: string
    label?: string
  }
}
