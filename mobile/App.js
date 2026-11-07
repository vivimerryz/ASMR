import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { HELPER_URL } from './helper-config';

const rainSound = require('./assets/asmr-rain.wav');

export default function App() {
  const player = useAudioPlayer(rainSound);
  const audioStatus = useAudioPlayerStatus(player);
  const [stressText, setStressText] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setAudioModeAsync({
      interruptionMode: 'mixWithOthers',
      playsInSilentMode: true,
    }).catch(() => {
      setError('The sound settings could not load. You can still try the app.');
    });
  }, []);

  const handleNext = async () => {
    const message = stressText.trim();
    if (!message || isThinking) {
      return;
    }

    setSubmittedText(message);
    setAiReply('');
    setError('');
    setIsThinking(true);

    try {
      const response = await fetch(`${HELPER_URL}/calm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      if (!response.ok || !data.reply) {
        throw new Error('Helper request failed.');
      }
      setAiReply(data.reply);
    } catch {
      setError('I could not connect. Check the key and make sure the helper is running.');
    } finally {
      setIsThinking(false);
    }
  };

  const handleAsmr = async () => {
    setError('');
    if (!audioStatus.isLoaded) {
      setError('The ASMR sound is still loading. Please try again in a moment.');
      return;
    }

    if (audioStatus.playing) {
      player.pause();
      return;
    }

    // expo-audio exposes volume as a player property; keep the demo at a gentle level.
    // eslint-disable-next-line react-hooks/immutability
    player.volume = 0.35;
    await player.seekTo(0);
    player.play();
  };

  const handleStartOver = () => {
    player.pause();
    setStressText('');
    setSubmittedText('');
    setAiReply('');
    setError('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>ASMR STRESS RELIEVER</Text>
        <Text style={styles.title}>Let’s make a calm moment.</Text>
        <Text style={styles.subtitle}>
          Tell me what is making you stressed. Then choose a gentle sound.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>What is bothering you?</Text>
          <TextInput
            accessibilityLabel="What is bothering you?"
            editable={!isThinking}
            maxLength={200}
            multiline
            onChangeText={setStressText}
            placeholder="For example: I have too much homework."
            placeholderTextColor="#8b8ba7"
            style={styles.input}
            value={stressText}
          />
          <Pressable
            accessibilityRole="button"
            disabled={!stressText.trim() || isThinking}
            onPress={handleNext}
            style={({ pressed }) => [
              styles.primaryButton,
              (!stressText.trim() || isThinking) && styles.disabledButton,
              pressed && styles.pressedButton,
            ]}
          >
            {isThinking ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color="#17172a" size="small" />
                <Text style={styles.primaryButtonText}>Thinking…</Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>Next</Text>
            )}
          </Pressable>
        </View>

        {submittedText ? (
          <View style={styles.card}>
            <Text style={styles.label}>You wrote:</Text>
            <Text style={styles.quote}>“{submittedText}”</Text>
            {aiReply ? <Text style={styles.reply}>{aiReply}</Text> : null}

            <View style={styles.soundBox}>
              <Text style={styles.soundTitle}>Gentle rain</Text>
              <Text style={styles.soundText}>Audio only. Keep the volume comfortable.</Text>
              <Pressable
                accessibilityRole="button"
                disabled={!audioStatus.isLoaded}
                onPress={handleAsmr}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  !audioStatus.isLoaded && styles.disabledButton,
                  pressed && styles.pressedButton,
                ]}
              >
                <Text style={styles.secondaryButtonText}>
                  {!audioStatus.isLoaded
                    ? 'Loading sound…'
                    : audioStatus.playing
                      ? 'Pause ASMR'
                      : 'Start ASMR'}
                </Text>
              </Pressable>
            </View>

            <Pressable onPress={handleStartOver} style={styles.textButton}>
              <Text style={styles.textButtonLabel}>Start over</Text>
            </Pressable>
          </View>
        ) : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.footer}>ASMR can support a calm moment. It is not a replacement for professional help.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#17172a',
    flex: 1,
  },
  container: {
    alignItems: 'stretch',
    gap: 18,
    padding: 24,
    paddingBottom: 48,
    paddingTop: 56,
  },
  eyebrow: {
    color: '#a9a4ff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 39,
  },
  subtitle: {
    color: '#c7c6df',
    fontSize: 17,
    lineHeight: 25,
  },
  card: {
    backgroundColor: '#252542',
    borderColor: '#3b3b62',
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
    padding: 18,
  },
  label: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#17172a',
    borderColor: '#4f4d7d',
    borderRadius: 16,
    borderWidth: 1,
    color: '#ffffff',
    fontSize: 17,
    minHeight: 106,
    padding: 14,
    textAlignVertical: 'top',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#f4dc7a',
    borderRadius: 16,
    minHeight: 54,
    justifyContent: 'center',
  },
  buttonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryButtonText: {
    color: '#17172a',
    fontSize: 18,
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.45,
  },
  pressedButton: {
    opacity: 0.8,
  },
  quote: {
    color: '#f4dc7a',
    fontSize: 19,
    lineHeight: 27,
  },
  reply: {
    color: '#e8e7f7',
    fontSize: 17,
    lineHeight: 25,
  },
  soundBox: {
    backgroundColor: '#32325a',
    borderRadius: 18,
    gap: 10,
    padding: 16,
  },
  soundTitle: {
    color: '#ffffff',
    fontSize: 23,
    fontWeight: '800',
  },
  soundText: {
    color: '#cac9e2',
    fontSize: 15,
    lineHeight: 21,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#a9a4ff',
    borderRadius: 14,
    minHeight: 50,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#17172a',
    fontSize: 17,
    fontWeight: '800',
  },
  textButton: {
    alignItems: 'center',
    padding: 6,
  },
  textButtonLabel: {
    color: '#c7c6df',
    fontSize: 16,
    fontWeight: '700',
  },
  error: {
    backgroundColor: '#4b2934',
    borderRadius: 14,
    color: '#ffd8e0',
    fontSize: 15,
    lineHeight: 21,
    padding: 14,
  },
  footer: {
    color: '#9695b6',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
});
