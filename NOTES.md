# ASMR Stress Reliever Notes

OpenAI model: `gpt-5.6-luna`

## Run it
From this project folder, run `npm start`, then open http://localhost:8790.
Requires Node.js 24 (already installed). No installation or database needed.

## Done
- Preserved the exact project brief in BRIEF.md and the earlier mobile app.
- Built the web Version 1: type a feeling, press Next once, see your words and a real AI reply, choose Rain, Soft taps, or Brush, and make sounds with a sound pad.
- No login or videos. Three made-up example check-ins, with no real people.
- All browser saving is in web/storage.js. Saves on this computer only for now.
- Only Next asks AI. Thinking… disables the button. Failed requests explain how to check the key and connection.
- Server-only key read from .env; .env is ignored by Git and never served. openai-request.cjs contains the AI call and reads the AI instructions from BRIEF.md on every call.
- Quiet adjustable volume, Stop, short sounds with smooth fades, and stop when leaving the tab.
- Sounds are synthesized locally, avoiding corrupted audio files. No AAC files are needed for this version. Device listening tests are still required; format alone cannot guarantee good sound.
- Your typed check-in and reply are saved locally. Your words are sent to OpenAI on Next; API response storage is disabled.

## How to check / short video
1. Click the made-up example “Too much homework”, then Next. See Thinking… and the disabled button.
2. See your words and a kind AI reply. Choose a sound and tap the large pad, or move across it. Try all three sounds.
3. Lower volume and press Stop. Sounds should be gentle, with no pops or glitches.
4. Refresh the page: the check-in, AI reply, and sound choice should remain. No new AI call is made.
5. Clear saved check-in and refresh: the starting screen should return.
6. Try “What medicine should I take?”: the AI should decline health advice.
7. Test on a second device/browser before presenting. This server accepts only connections on this computer, so a second physical device needs a separately approved setup; use another browser here first.
8. With internet disconnected, Next should show the friendly key/connection message and become usable again.

## Next
- Complete real listening tests on different devices; record results honestly.
- Verify the competition registration and entry dates with an adult on the official competition site. The brief gives no exact dates; this app does not register or submit an entry.
- Check the APA source for the written entry. Keep claims modest: sounds may help some people relax, and do not guarantee relief or prove they work better than video.
- Make the up-to-4-minute demo and up-to-10-page PDF with an adult.

## Maybe Later
- Tested, licensed AAC/M4A recordings if synthesized sounds are replaced.
- Before-and-after calm ratings to measure whether a session helped.
- A real database, more sounds, competition materials, and phone sharing.
- Retire the earlier Expo app only if no longer needed.

## Verification today
- Web app opened successfully in Microsoft Edge; server returned HTTP 200.
- JavaScript syntax checks passed.
- Storage checks passed for save/read/clear, damaged data, and unavailable saving using an isolated test. Browser refresh persistence and sound listening still need manual verification.
- Real OpenAI request returned HTTP 401: the current .env key was rejected. Full AI flow and health refusal remain unverified until a valid key is saved locally. No key was displayed.
- Current save point captures the implementation with this known authentication blocker.

## Temporary key retest
- Replaced the local .env key at the user's request; .env remains ignored by Git.
- A real request to gpt-5.6-luna succeeded and returned a two-sentence reply beginning Okay,. This resolves the earlier HTTP 401 blocker.
- Revoke this temporary key after testing because it was shared in chat.
- Browser refresh persistence, health refusal, and device listening checks remain to be completed.

## Sound library preparation
- Central sound catalog in web/sounds.js generates the sound picker, with stable IDs and categories. The layout wraps and scrolls as the library grows.
- Saved the supplied YouTube reference and a review checklist in SOUND-RESOURCES.md. The video could not be fetched; its content and reuse permission have not been verified.
- The current three synthesized sounds remain playable; the reference is not imported audio.
- Next: collect sound names and original/permitted files, implement recorded playback, then complete listening checks before enabling new recordings.

## Haircut recording added
- Corrected the YouTube reference to coconut oil NeeDoh squishy using the user's description.
- Added the supplied stereo WAV as Haircut, with original creator credit. Tap the pad to play once; repeated touches do not stack recordings. Volume and Stop apply, and leaving the tab stops playback.
- Original WAV retained. AAC alternative, license verification before publication, and device listening tests remain next steps.
- Check: select Haircut, tap the pad, adjust volume, Stop, then try Rain to confirm switching stops the recording.
- Verification: WAV structure is valid stereo 48 kHz, 16-bit PCM; the audio route returned HTTP 200. Listening quality has not yet been verified.

## One game added: Fresh peel
- Read BRIEF.md first. Added one original, simplified peel activity inspired by the supplied Bored.com Fresh Peel link; its external game code and assets were not copied or embedded.
- Choose Fresh peel after the AI check-in. Drag right across the film to reveal the surface and generate quiet short sounds, or use Peel a little with keyboard/touch. Start again resets it.
- No scores, levels, accounts, extra AI calls, or new saved data. Existing volume and Stop apply; leaving the tab cancels dragging and stops sound.
- Check: peel by dragging, finish using Peel a little, reset, turn volume down, and press Stop while dragging. Device listening tests remain pending.
- Verification: syntax checks passed; isolated interaction checks passed for dragging, sound triggers, completion, reset, and Stop cancellation; running app served the activity. Visual browser and device listening checks remain pending.

## Original Fresh Peel link
- Added a prominent Play the original Fresh Peel link inside the Fresh peel choice. Opens https://www.bored.com/arcade/fresh-peel/ in a new tab.
- Clearly labeled the local version as our simple peel activity.
- Check: refresh the app, choose Fresh peel, and click Play the original Fresh Peel.
