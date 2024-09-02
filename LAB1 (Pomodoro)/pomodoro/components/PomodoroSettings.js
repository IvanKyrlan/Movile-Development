import React, { useState, useEffect, memo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Switch,
} from 'react-native';
import PropTypes from 'prop-types';

import sharedStyles from './styles/sharedStyles';

const NUM_CHARS = new Set(
  Array(10)
    .fill(0)
    .map((_, i) => i.toString()),
);

const MIN_TIMER_PERIOD = 1;
const MAX_TIMER_PERIOD = 60;

const styles = StyleSheet.create({
  settingContainer: {
    marginBottom: 10,
  },
  timerControlContainer: {
    marginHorizontal: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: 600,
    color: '#fff',
  },
  timerPeriodInput: {
    color: '#fff',
    width: 32,
    fontSize: 24,
  },
  settingSwitch: {
    marginHorizontal: 10,
    marginTop: 5,
  },
});

function TimerSettings({
  workMins,
  breakMins,
  workPhase,
  updateTimer,
  clickSound,
  playAlarm,
  togglePlayAlarm,
  vibrationOn,
  toggleVibration,
}) {
  const [workingPeriodInputString, setWorkPeriodString] = useState(
    workMins.toString(),
  );
  const [breakPeriodInputString, setBreakPeriodString] = useState(
    breakMins.toString(),
  );

  useEffect(() => {
    setWorkPeriodString(workMins.toString());
    setBreakPeriodString(breakMins.toString());
  }, [workMins, breakMins]);

  function handleTimerInputChange(inputText, setStateFunc) {
    const nums = [];

    for (const char of inputText) {
      if (NUM_CHARS.has(char)) {
        nums.push(char);
      }
    }

    setStateFunc(nums.join(''));
  }

  function handleTimerInputSubmit(workMinsInput) {
    if (workMinsInput) {
      const newWorkMins = workingPeriodInputString
        ? Math.min(parseInt(workingPeriodInputString), MAX_TIMER_PERIOD)
        : workMins;

      updateTimer(newWorkMins, workMinsInput);
      setWorkPeriodString(newWorkMins.toString());
    } else {
      const newBreakMins = breakPeriodInputString
        ? Math.min(parseInt(breakPeriodInputString), MAX_TIMER_PERIOD)
        : breakMins;

      updateTimer(newBreakMins, workMinsInput);
      setBreakPeriodString(newBreakMins.toString());
    }
  }

  return (
    <View style={styles.settingContainer}>
      <View
        style={[
          sharedStyles.flexRow,
          sharedStyles.flexWrap,
          sharedStyles.fullWidth,
        ]}
      >
        <View style={[sharedStyles.flexRow, styles.timerControlContainer]}>
          <Text style={styles.label}>Working Time : </Text>
          <Pressable
            style={({ pressed }) => [
              sharedStyles.button,
              pressed ? sharedStyles.buttonPressed : null,
            ]}
            accessibilityLabel="Decrement work period"
            onPress={() => {
              clickSound.playAsync();
              updateTimer(workMins - 1, true);
            }}
            disabled={workMins <= MIN_TIMER_PERIOD ? true : false}
          >
            <Text style={sharedStyles.buttonText}>-</Text>
          </Pressable>
          <TextInput
            style={styles.timerPeriodInput}
            accessibilityLabel={`Set working period in minutes. Minimum: ${MIN_TIMER_PERIOD} minute. Maximum: ${MAX_TIMER_PERIOD}`}
            value={workingPeriodInputString}
            keyboardType="numeric"
            onChangeText={(inputText) =>
              handleTimerInputChange(inputText, setWorkPeriodString)
            }
            onSubmitEditing={() => handleTimerInputSubmit(true)}
            onBlur={() => handleTimerInputSubmit(true)}
            maxLength={2}
          ></TextInput>

          <Pressable
            style={({ pressed }) => [
              sharedStyles.button,
              pressed ? sharedStyles.buttonPressed : null,
            ]}
            accessibilityLabel="Increment work period"
            onPress={() => {
              clickSound.playAsync();
              updateTimer(workMins + 1, true);
            }}
            disabled={workMins >= MAX_TIMER_PERIOD ? true : false}
          >
            <Text style={sharedStyles.buttonText}>+</Text>
          </Pressable>
        </View>
        <View style={[sharedStyles.flexRow, styles.timerControlContainer]}>
          <Text style={styles.label}>Break Time : {'     '}</Text>
          <Pressable
            style={({ pressed }) => [
              sharedStyles.button,
              pressed ? sharedStyles.buttonPressed : null,
            ]}
            title="-"
            accessibilityLabel="Decrement break period"
            onPress={() => {
              clickSound.playAsync();
              updateTimer(breakMins - 1, false);
            }}
            disabled={breakMins <= MIN_TIMER_PERIOD ? true : false}
          >
            <Text style={sharedStyles.buttonText}>-</Text>
          </Pressable>
          <TextInput
            style={styles.timerPeriodInput}
            accessibilityLabel={`Set break period in minutes. Minimum: ${MIN_TIMER_PERIOD} minute. Maximum: ${MAX_TIMER_PERIOD}`}
            value={breakPeriodInputString}
            keyboardType="numeric"
            onChangeText={(inputText) =>
              handleTimerInputChange(inputText, setBreakPeriodString)
            }
            onSubmitEditing={() => handleTimerInputSubmit(false)}
            onBlur={() => handleTimerInputSubmit(false)}
            maxLength={2}
          ></TextInput>

          <Pressable
            style={({ pressed }) => [
              sharedStyles.button,
              pressed ? sharedStyles.buttonPressed : null,
            ]}
            accessibilityLabel="Increment break period"
            onPress={() => {
              clickSound.playAsync();
              updateTimer(breakMins + 1, false);
            }}
            disabled={breakMins >= MAX_TIMER_PERIOD ? true : false}
          >
            <Text style={sharedStyles.buttonText}>+</Text>
          </Pressable>
        </View>
      </View>
      <View style={[sharedStyles.flexRow, sharedStyles.fullWidth]}>
        <View style={[sharedStyles.flexRow, styles.timerControlContainer]}>
          <Text style={styles.label}>Sound: </Text>
          <Switch
            style={styles.settingSwitch}
            accessibilityLabel={`Turn ${
              playAlarm ? 'off' : 'on'
            } audible Timer alarm`}
            activeThumbColor={
              workPhase ? 'rgb(217, 66, 61)' : 'rgb(24, 108, 168)'
            }
            trackColor={{
              true: 'rgba(255,255,255,0.3)',
              false: 'rgba(255,255,255,0.7)',
            }}
            value={playAlarm}
            onValueChange={() => togglePlayAlarm()}
          ></Switch>
        </View>
        <View style={[sharedStyles.flexRow, styles.timerControlContainer]}>
          <Text style={styles.label}>Vibration: </Text>
          <Switch
            style={styles.settingSwitch}
            accessibilityLabel={`Turn ${
              vibrationOn ? 'off' : 'on'
            } Timer vibration`}
            activeThumbColor={
              workPhase ? 'rgb(217, 66, 61)' : 'rgb(24, 108, 168)'
            }
            trackColor={{
              true: 'rgba(255,255,255,0.3)',
              false: 'rgba(255,255,255,0.7)',
            }}
            value={vibrationOn}
            onValueChange={() => toggleVibration()}
          ></Switch>
        </View>
      </View>
    </View>
  );
}

TimerSettings.propTypes = {
  workMins: PropTypes.number.isRequired,
  breakMins: PropTypes.number.isRequired,
  workPhase: PropTypes.bool.isRequired,
  updateTimer: PropTypes.func.isRequired,
  clickSound: PropTypes.shape({ playAsync: PropTypes.func }),
  playAlarm: PropTypes.bool.isRequired,
  togglePlayAlarm: PropTypes.func.isRequired,
  vibrationOn: PropTypes.bool.isRequired,
  toggleVibration: PropTypes.func.isRequired,
};

export default memo(TimerSettings);
