import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {darkTheme} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';

function QuranScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quran</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  title: {
    ...typography.title,
    color: darkTheme.textPrimary,
  },
});

export default QuranScreen;
