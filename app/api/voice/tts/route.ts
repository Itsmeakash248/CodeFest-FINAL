import { NextRequest, NextResponse } from 'next/server';

const cache = new Map<string, { audio: ArrayBuffer; contentType: string }>();
const MAX_CACHE = 24;

const DEFAULT_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'XrExE9yKIg1WjnnlVkGX';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = typeof body.text === 'string' ? body.text.trim().slice(0, 900) : '';

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKeys = (process.env.ELEVENLABS_API_KEY || '')
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    if (apiKeys.length === 0) {
      return NextResponse.json(
        { error: 'ElevenLabs not configured on server', fallback: 'browser' },
        { status: 503 }
      );
    }

    const voiceId = typeof body.voiceId === 'string' && body.voiceId ? body.voiceId : DEFAULT_VOICE_ID;
    const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_flash_v2_5';
    const cacheKey = `${voiceId}:${text}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      return new Response(cached.audio, {
        headers: {
          'Content-Type': cached.contentType,
          'Cache-Control': 'private, max-age=3600',
        },
      });
    }

    let audioBuffer: ArrayBuffer | null = null;
    let contentType = 'audio/mpeg';

    for (const apiKey of apiKeys) {
      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`,
          {
            method: 'POST',
            headers: {
              'xi-api-key': apiKey,
              'Content-Type': 'application/json',
              Accept: 'audio/mpeg',
            },
            body: JSON.stringify({
              text,
              model_id: modelId,
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
              },
            }),
          }
        );

        if (!response.ok) {
          const errText = await response.text();
          console.warn('[ElevenLabs TTS] Key failed, trying next key:', errText.slice(0, 100));
          continue;
        }

        audioBuffer = await response.arrayBuffer();
        contentType = response.headers.get('content-type') || 'audio/mpeg';
        break;
      } catch (err) {
        console.warn('[ElevenLabs TTS] Error calling ElevenLabs, trying next key:', (err as Error)?.message);
      }
    }

    if (!audioBuffer) {
      return NextResponse.json({ error: 'TTS upstream error on all keys', fallback: 'browser' }, { status: 502 });
    }

    if (cache.size >= MAX_CACHE) {
      const oldest = cache.keys().next().value;
      if (oldest) cache.delete(oldest);
    }
    cache.set(cacheKey, { audio: audioBuffer, contentType });

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('[API /api/voice/tts] Exception:', error);
    return NextResponse.json({ error: 'Internal TTS failure', fallback: 'browser' }, { status: 500 });
  }
}
