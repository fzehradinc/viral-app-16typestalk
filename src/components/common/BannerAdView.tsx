/**
 * BannerAdView — Google AdMob banner reklam bileşeni.
 * Yüklenmeden önce görünmez, yüklenince 50px yükseklik.
 */

import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import * as adService from '../../services/adService';

function BannerAdView(): React.JSX.Element {
  const [visible, setVisible] = useState(false);
  const adUnitId = adService.getBannerAdUnitId();

  return (
    <View style={visible ? styles.container : styles.hidden}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={{requestNonPersonalizedAdsOnly: true}}
        onAdLoaded={() => setVisible(true)}
        onAdFailedToLoad={() => setVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  hidden: {
    height: 0,
    overflow: 'hidden',
  },
});

export default BannerAdView;
