// scripts/generate_brand_film.mjs
// Renders the 1920x1080 24-second 16:9 brand film to docs/media/apt-infosoft-brand-film.mp4
// (H.264, crf 22, no audio, <= 12 MB).

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from '@playwright/test';
import { renderBrandFilmFrame } from '../src/motion/scene-engine.ts';

const MEDIA_DIR = path.resolve('docs/media');
fs.mkdirSync(MEDIA_DIR, { recursive: true });

function getFfmpegPath() {
  const localAppData = process.env.LOCALAPPDATA || '';
  const pwDir = path.join(localAppData, 'ms-playwright');
  if (fs.existsSync(pwDir)) {
    const list = fs.readdirSync(pwDir).filter(d => d.startsWith('ffmpeg'));
    for (const dir of list) {
      const p = path.join(pwDir, dir, 'ffmpeg-win64.exe');
      if (fs.existsSync(p)) return p;
    }
  }
  return 'ffmpeg';
}

const FFMPEG_BIN = getFfmpegPath();
console.log(`Using FFmpeg at: ${FFMPEG_BIN}`);

async function renderFilm() {
  const tempDir = path.resolve('docs/media/temp_frames');
  fs.mkdirSync(tempDir, { recursive: true });

  const FPS = 12; // 12 fps provides smooth animation while maintaining fast render and small size
  const TOTAL_DURATION_SEC = 24.0;
  const TOTAL_FRAMES = Math.round(TOTAL_DURATION_SEC * FPS);

  console.log(`Rendering ${TOTAL_FRAMES} frames (1920x1080 @ ${FPS}fps) for 24-second brand film...`);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  for (let f = 0; f < TOTAL_FRAMES; f++) {
    const tSec = f / FPS;
    const html = renderBrandFilmFrame(tSec);
    await page.setContent(html, { waitUntil: 'load' });
    const fPath = path.join(tempDir, `frame_${String(f).padStart(4, '0')}.png`);
    await page.screenshot({ path: fPath });

    if (f % 48 === 0) {
      console.log(`Rendered frame ${f} / ${TOTAL_FRAMES} (${tSec.toFixed(1)}s / 24.0s)`);
    }
  }

  await page.close();
  await browser.close();

  const outMp4 = path.join(MEDIA_DIR, 'apt-infosoft-brand-film.mp4');
  console.log(`Encoding H.264 MP4 to ${outMp4}...`);

  execFileSync(FFMPEG_BIN, [
    '-y',
    '-framerate', String(FPS),
    '-i', path.join(tempDir, 'frame_%04d.png'),
    '-c:v', 'libx264',
    '-crf', '22',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    outMp4,
  ], { stdio: 'pipe' });

  // Cleanup temp frames
  fs.rmSync(tempDir, { recursive: true, force: true });

  const stat = fs.statSync(outMp4);
  const sizeMb = (stat.size / (1024 * 1024)).toFixed(2);
  console.log(`Brand film encoded successfully: ${outMp4} (${sizeMb} MB, <= 12 MB target)`);
}

renderFilm().catch(err => {
  console.error(err);
  process.exit(1);
});

