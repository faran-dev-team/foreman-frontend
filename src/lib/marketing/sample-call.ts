/**
 * Audio behind the hero's "Hear a Sample Call (30 Sec)" button.
 *
 * TODO(gcc): replace with the 30-second Gulf Arabic -> Urdu technician-brief
 * recording. `/audio/demo-call.wav` is the existing 60-second demo and is a
 * placeholder until that recording exists. Override with
 * NEXT_PUBLIC_SAMPLE_CALL_URL without a code change.
 */
export const SAMPLE_CALL_AUDIO_URL =
  process.env.NEXT_PUBLIC_SAMPLE_CALL_URL?.trim() || "/audio/demo-call.wav";
