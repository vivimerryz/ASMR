# ASMR Stress Reliever Notes

## OpenAI model

The OpenAI key can use `gpt-5.6-luna`.

## Run it

1. Open a new terminal in the project root and run `node ai-helper.js`.
2. Open a second terminal, go to `mobile`, and run `npx expo start --lan`.
3. Scan the Expo QR code with Expo Go on the same Wi-Fi as this computer.

The app currently reaches the helper at `http://192.168.1.112:8787`. If this computer gets a new local IP address, update `mobile/helper-config.js` and restart Expo.

## SDK

The phone app uses Expo SDK 57. `npx expo install --fix` completed, and `npx expo-doctor` passed all 21 checks.

## Done

- Saved the project brief in `BRIEF.md`.
- Created the Expo blank app in `mobile` using SDK 57.
- Added a simple, friendly stress prompt and one AI response.
- Added a local gentle-rain audio demo with a low-volume default and pause button.
- Added a Node.js helper that reads the API key from the root `.env`, reads this file for the model, and reads `BRIEF.md` as the AI instructions for every request.
- Added friendly error text when the key, Wi-Fi, or helper is unavailable.

## Maybe Later

- Add more sound choices, such as soft tapping and paper sounds.
- Replace the demo WAV with tested, licensed AAC/M4A audio after testing several phones.
- Add a before-and-after calm rating so the project can measure whether the sound helped.
- Add a parent/teacher safety screen before testing with children.

## Next

- Start the helper and Expo, then test the complete flow on the phone.
- Test the audio on more than one device and check that the computer and phone stay on the same Wi-Fi.
- Capture the main flow for the short competition video and begin the written entry.

## Verified

- The Android development bundle returned HTTP 200.
- Expo Doctor passed all 21 checks.
- Expo lint passed.
- The local helper returned a successful AI response without exposing the API key.
- A scan image is saved as `Expo-QR.png` for `exp://192.168.1.112:8081`.
