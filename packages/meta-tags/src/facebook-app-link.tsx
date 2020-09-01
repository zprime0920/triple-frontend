import React, { Fragment } from 'react'

export function FacebookAppLink({
  appName = '트리플',
  iosAppStoreId = '1225499481',
  contentUrl = '/',
  appPackageName = 'com.titicacacorp.triple',
  appUrlScheme = 'triple',
}: {
  appName?: string
  iosAppStoreId?: string
  contentUrl?: string
  appPackageName?: string
  appUrlScheme?: string
}) {
  return (
    <Fragment>
      <meta property="al:ios:app_name" content={appName} />
      <meta property="al:android:app_name" content={appName} />
      <meta
        property="al:ios:url"
        content={`${appPackageName}://${encodeURIComponent(contentUrl)}`}
      />
      <meta property="al:ios:app_store_id" content={iosAppStoreId} />
      <meta
        property="al:android:url"
        content={`${appUrlScheme}://${encodeURIComponent(contentUrl)}`}
      />
      <meta property="al:android:package" content={appPackageName} />
    </Fragment>
  )
}
