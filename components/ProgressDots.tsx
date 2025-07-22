import React from 'react';
import { View } from 'react-native';
import { colors } from '../styles/common';

type Props = {
  current: number;
  total: number;
};

export default function ProgressDots({ current, total }: Props) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, marginTop: 32 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: current === i ? colors.primary : '#ccc',
          }}
        />
      ))}
    </View>
  );
}
