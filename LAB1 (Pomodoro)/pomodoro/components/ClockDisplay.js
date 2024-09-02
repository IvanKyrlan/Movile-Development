import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

function msToClockVals(ms) {
  if (ms < 0) {
    ms = Math.abs(ms);
  }
  const min = Math.floor(ms / 60000);
  const sec = Math.floor(ms / 1000) % 60;
  const tenths = Math.floor(ms / 100) % 10;

  return [min, sec, tenths];
}

const styles = StyleSheet.create({
  timerClockContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  clockDisplay: {
    color: '#fff',
    // fontSize: 64,
    fontWeight: 600,
  },
  tenthsDisplay: {
    color: '#fff',
    // fontSize: 32,
    fontWeight: 500,
  },
});

function ClockDisplay({
  currentTimerMilliSecs,
  showTenths,
  fontSize,
  fontColor,
}) {
  const [mins, secs, tenths] = msToClockVals(currentTimerMilliSecs);

  fontSize = fontSize ? fontSize : 64;

  return (
    <View style={[styles.timerClockContainer, styles.flexRow]}>
      <Text
        style={[
          styles.clockDisplay,
          { fontSize: fontSize, color: fontColor || '#fff' },
        ]}
        accessibilityLabel={`
        Clock Time: ${Math.floor(currentTimerMilliSecs / 60)} minutes and ${
          currentTimerMilliSecs % 60
        } seconds`}
      >
        {`${currentTimerMilliSecs < 0 ? '-' : ''}${mins}:${secs
          .toString()
          .padStart(2, '0')}`}
      </Text>
      <Text
        style={[
          styles.tenthsDisplay,
          { fontSize: fontSize / 2, color: fontColor || '#fff' },
        ]}
      >
        {showTenths ? `${tenths}` : null}
      </Text>
    </View>
  );
}

ClockDisplay.propTypes = {
  currentTimerMilliSecs: PropTypes.number.isRequired,
  showTenths: PropTypes.bool,
  fontSize: PropTypes.number,
  fontColor: PropTypes.string,
};

export default memo(ClockDisplay);
