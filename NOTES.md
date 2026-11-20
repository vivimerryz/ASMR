# ASMR Stress Reliever Notes

OpenAI model: `gpt-5.6-luna`

## Run it
From this project folder, run `npm start`, then open http://localhost:8790.
Requires Node.js 24 (already installed). No installation or database needed.

## MindDo AI key setup
- The AI key comes from `getKey()` in keygen.cjs. Only server code calls it; the browser never receives the MindDo token or OpenAI key.
- For local use, put your MindDo service address and token in `.env`. That file is ignored by Git.
- `getKey()` calls `KEYGEN_URL/api/lookup-key`, caches the returned key until `expiresAt`, and refreshes once if OpenAI rejects the key. It does not retry in a loop.
- When a request fails, the server returns `error.message` and `error.fix`; the page shows the message and the server logs the fix hint without printing credentials.
- The MindDo key helper was verified against the live model-list request on 2026-11-20. Available models: `gpt-4o`, `gpt-4o-2024-08-06`, `gpt-4o-2024-11-20`, `gpt-4o-mini`, `gpt-4o-mini-2024-07-18`, and `gpt-5.6-luna`.

## Vercel setup
- Vercel serves the static page from `web/` using `outputDirectory` in vercel.json and runs `/api/calm` as the Node.js function in `api/calm.js`.
- The function bundles BRIEF.md and NOTES.md for the AI instructions and model name. The 60-second function limit is configured in vercel.json for the AI request.
- In Vercel Project Settings → Environment Variables, add `KEYGEN_URL` and `KEYGEN_TOKEN` for each environment you plan to use (Production and Preview, for example). Online, getKey() reads only those process environment variables and does not read `.env`.
- Keep the project Root Directory at the repository root so Vercel finds vercel.json and api/calm.js. No separate build command or other environment variables are needed.
- Local use still starts with `npm start`; getKey() reads the ignored `.env` file on your computer.
- The local server still allows requests from localhost only. If invoked in a Vercel runtime, it now allows only HTTPS requests from that same hosted domain, so the old “Please open the app on this computer” rejection is removed for same-site online use.
- Check: a real local server request returned an AI reply and a valid sound pick; a mocked Vercel-function check confirmed it uses process.env without reading `.env`; syntax, JSON config, and `.env` ignore checks passed.

## Done
- Preserved the exact project brief in BRIEF.md and the earlier mobile app.
- Built the web Version 1: type a feeling, press Next once, see your words and a real AI reply, choose Rain, Soft taps, or Brush, and make sounds with a sound pad.
- No login or videos. Three made-up example check-ins, with no real people.
- All browser saving is in web/storage.js. Saves on this computer only for now.
- Only Next asks AI. Thinking… disables the button. Failed requests explain how to check the key and connection.
- Server-only AI key comes from `getKey()` in keygen.cjs; it requests and caches a MindDo key until it expires. `.env` is ignored by Git and never served. openai-request.cjs contains the AI call and reads the AI instructions from BRIEF.md on every call.
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

## Five sounds added
- Added light brushing, keyboard scratching, squishy fruit sounds, chewing a cracker, and crunchy eating to the sound picker using the provided files.
- Sound playback uses the existing audio player, volume, and Stop controls.
- Audio files are locally stored in web/audio; exact reuse terms and multi-device listening checks still need confirmation.


## Color palette
- Applied the requested lavender, pink, and blue palette throughout the interface.

## YouTube ASMR links
- Added five user-provided YouTube links to the studio under More ASMR videos. Each opens in a new tab; link labels are generic because video descriptions weren't provided.

- Added the sixth user-provided YouTube link to More ASMR videos. It opens in a new tab.

## Expandable video and game lists
- Moved the six existing video links into web/resources.js and added a separate game link list there, beginning with the existing Fresh Peel link.
- Added a collapsed “See ASMR games” menu alongside videos; future links can be added to these two lists. Existing AI picks, sounds, and Fresh Peel activity remain connected.
- Added six more YouTube links (ASMR videos 7–12) and the Playgama ASMR games page to the matching lists in web/resources.js.
- Check: run npm start, complete a check-in, open each menu and click its links, then try the AI-picked sound/game and the Fresh Peel activity.
- Verification: JavaScript syntax and catalog checks passed for 12 videos and 2 game links. The server now serves web/resources.js so the browser can load the expanded lists. Localhost/browser clicks still need to be confirmed.


## Mood based recommendations
- Next now sends mood plus available sound/video IDs and names to the AI. The AI returns one validated recommendation ID; the app selects it and displays the matching video link or sound.
- Other video links are inside a closed menu. AI is instructed to avoid eating sounds for frightening or unrelated moods.

