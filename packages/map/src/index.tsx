import React, {
  CSSProperties,
  useMemo,
  PropsWithChildren,
  useEffect,
  useCallback,
  useState,
} from 'react'
import {
  GoogleMap,
  GoogleMapProps,
  useLoadScript,
} from '@react-google-maps/api'
import { Spinner } from '@titicaca/core-elements'

import { getGeometry, literalToString } from './utilities'

export * from './map'
export * from './utilities'
export * from './marker'
export * from './polygon'
export * from './polyline'

const MAX_LAT = (Math.atan(Math.sinh(Math.PI)) * 180) / Math.PI
const DEFAULT_MAP_HEIGHT = 180

const DEFAULT_BOUNDS_PADDING = {
  top: 20,
  right: 22,
  left: 22,
  bottom: 20,
}

const DEFAULT_MAP_OPTIONS: google.maps.MapOptions = {
  noClear: true,
  // MapOptions에서 명시된 disableDefaultUI props을 사용하기 위해 naming-convention을 disabled 합니다.
  // eslint-disable-next-line @typescript-eslint/naming-convention
  disableDefaultUI: true,
  clickableIcons: false,
  gestureHandling: 'greedy',
  // 지도 뷰를 제외한 회색 영역으로 움직임을 방지
  restriction: {
    latLngBounds: {
      north: MAX_LAT,
      south: -MAX_LAT,
      west: -180,
      east: 180,
    },
    strictBounds: true,
  },
}

const DEFAULT_MAP_CONTAINER_STYLE: CSSProperties = {
  width: '100%',
  height: DEFAULT_MAP_HEIGHT,
}

export interface WithGoogleMapProps extends GoogleMapProps {
  coordinates: [number, number][]
  googleMapLoadOptions: {
    /** goole map api key */
    googleMapsApiKey: string
    /** region default: kr - https://developers.google.com/maps/faq#languagesupport */
    region?: string
    /**
     * google map additional libraries
     * default: ['geometry'] - https://developers.google.com/maps/documentation/javascript/libraries */
    // libraries?: Libraries
  }
  padding?:
    | number
    | {
        top?: number
        right?: number
        bottom?: number
        left?: number
      }
  onLoad?: (map: google.maps.Map) => void
}

const GOOGLE_MAP_LIBRARIES = ['geometry' as const]

export default function MapView({
  coordinates,
  options: originOptions,
  mapContainerStyle: originMapContainerStyle,
  googleMapLoadOptions: { googleMapsApiKey, region = 'kr' },
  padding = DEFAULT_BOUNDS_PADDING,
  children,
  onLoad,
  ...props
}: PropsWithChildren<WithGoogleMapProps>) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    region,
    libraries: GOOGLE_MAP_LIBRARIES,
  })
  const [map, setMap] = useState<google.maps.Map>()

  const { center, bounds, zoom } = getGeometry(coordinates)

  const options = useMemo(() => {
    return {
      ...DEFAULT_MAP_OPTIONS,
      center,
      zoom,
      ...originOptions,
    }
  }, [coordinates, originOptions])

  const mapContainerStyle: CSSProperties = useMemo(
    () => ({
      ...DEFAULT_MAP_CONTAINER_STYLE,
      ...originMapContainerStyle,
    }),
    [originMapContainerStyle],
  )

  const handleOnLoad = useCallback(
    (map: google.maps.Map) => {
      onLoad && onLoad(map)

      if (!bounds) {
        setMap(map)
        return
      }

      google.maps.event.addListenerOnce(map, 'idle', () => {
        map.fitBounds(bounds, padding)
        setMap(map)
      })
    },
    [bounds, onLoad, padding],
  )

  useEffect(() => {
    if (!bounds) {
      return
    }
    map?.fitBounds(bounds)
  }, [literalToString(bounds)]) // eslint-disable-line react-hooks/exhaustive-deps

  return loadError ? (
    <div>Map cannot be loaded right now, sorry.</div>
  ) : isLoaded ? (
    <GoogleMap
      options={options}
      onLoad={handleOnLoad}
      mapContainerStyle={mapContainerStyle}
      {...(props as GoogleMapProps)}
    >
      {children}
    </GoogleMap>
  ) : (
    <Spinner />
  )
}
