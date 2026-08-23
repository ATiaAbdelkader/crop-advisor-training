# Managed Preview HMR Verification

## 2026-08-23

The reported Vite connection error used an unreachable local fallback target at `localhost:5173` from the managed HTTPS preview. The development middleware now specifies secure WebSocket protocol with the managed HTTPS client port, so Vite generates an external `wss` connection target using the preview hostname rather than its local fallback.

The managed preview was opened successfully over its public HTTPS URL after the server restart. The external browser console produced no new Vite WebSocket error during this verification.

An internal `127.0.0.1` preview capture may briefly log a closed-before-opened secure WebSocket during a managed-server restart because it is not served through the public HTTPS proxy. This sandbox-only capture path is not a learner-facing access route. The public managed-preview route was then verified with a safe `Home.tsx` hot update: the development server emitted the HMR update and the browser received the corresponding hot-update events followed by a connected event.

After the origin-aware client adjustment, the local `http://127.0.0.1:3000` route loaded successfully. Its browser console contained only the standard React development notice and no Vite WebSocket connection error.

The public managed-preview route was also reopened after the same adjustment. It rendered the learner dashboard and its browser console contained no Vite WebSocket connection error.

With the managed-preview route open, a harmless `Home.tsx` accessibility-label edit produced a Vite client HMR update and a browser `hot updated` event. The subsequent browser diagnostics recorded connected events only, with no fresh Vite WebSocket failure.

The local route was opened again before a matching harmless frontend edit. Its browser console remained free of Vite WebSocket connection errors after the update request.

The development server emitted the local `Home.tsx` HMR update, the browser recorded the corresponding hot-update events, and a subsequent connected event was logged. This completed the two-path validation without a fresh connection failure.
