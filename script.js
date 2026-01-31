document.addEventListener('DOMContentLoaded', function() {
  // Copy of old project: block mobile fullscreen interruptions for video
  document.addEventListener('webkitbeginfullscreen', (e) => {
    e.preventDefault();
    if (e.target && e.target.webkitExitFullscreen) {
      e.target.webkitExitFullscreen();
    }
  }, true);
  document.addEventListener('webkitendfullscreen', (e) => {
    e.preventDefault();
  }, true);
  document.addEventListener('fullscreenchange', (e) => {
    if (document.fullscreenElement && document.fullscreenElement.tagName === 'VIDEO') {
      document.exitFullscreen();
    }
  });
  const audio = document.getElementById('bg-audio');
  const loading = document.getElementById('loading');
  const topFrost = document.getElementById('top-frost');
  const bottomFrost = document.getElementById('bottom-frost');
  const img = document.querySelector('.fullscreen-image');
  let entered = false;
  // Preload audio for mobile readiness (learned from old project)
  let audioReady = false;
  const preloadAudio = new Audio('sexi.mp3');
  preloadAudio.loop = true;
  preloadAudio.preload = 'auto';
  preloadAudio.muted = true;
  preloadAudio.addEventListener('canplaythrough', function() { audioReady = true; }, { once: true });
  preloadAudio.addEventListener('error', function() { audioReady = false; });
  try { preloadAudio.play().catch(() => {}); } catch(_e) { }
  // Old-project style external audio preload (sexi.mp3)
  let exAudioReady = false;
  const exAudio = new Audio('sexi.mp3');
  exAudio.loop = true;
  exAudio.preload = 'auto';
  exAudio.muted = true;
  exAudio.addEventListener('canplaythrough', function() { exAudioReady = true; }, { once: true });
  exAudio.addEventListener('error', function() { exAudioReady = false; });
  try { exAudio.play().catch(() => {}); } catch(_e) { }
  const waitForExAudio = () => new Promise(resolve => {
    if (exAudioReady) return resolve();
    const t = setInterval(() => {
      if (exAudioReady) { clearInterval(t); resolve(); }
    }, 50);
  });
  const waitForAudio = () => new Promise(resolve => {
    if (audioReady) return resolve();
    const t = setInterval(() => {
      if (audioReady) { clearInterval(t); resolve(); }
    }, 50);
  });

  // Frosting heights updates
  const updateFrost = () => {
    if (!img) return;
    const rect = img.getBoundingClientRect();
    const topH = Math.max(0, rect.top);
    const bottomH = Math.max(0, window.innerHeight - rect.bottom);
    if (topFrost) topFrost.style.height = topH + 'px';
    if (bottomFrost) bottomFrost.style.height = bottomH + 'px';
  };
  // Update on resize/load
  window.addEventListener('resize', updateFrost);
  window.addEventListener('load', updateFrost);
  if (img.complete) updateFrost();

  // Enter flow: tap to enter starts audio and hides loading overlay
  const enterSite = async () => {
    if (entered) return;
    entered = true;
    // Ensure audio is allowed to play on this gesture
    if (audio.muted) audio.muted = false;
    // Ensure audible volume (no mute toggle by user)
    audio.volume = 1.0;
    // Use external audio technique to guarantee playback on mobile
    await waitForExAudio();
    exAudio.muted = false;
    exAudio.volume = 1.0;
    exAudio.currentTime = 0;
    exAudio.play().catch(() => {
      // If play fails due to policy, user interaction should fix it
    });
    loading.classList.add('hidden');
    // Also hide frost overlays after entering
    if (topFrost) topFrost.style.display = 'none';
    if (bottomFrost) bottomFrost.style.display = 'none';
  };
  loading.addEventListener('pointerdown', enterSite, { once: true });
  loading.addEventListener('click', enterSite, { once: true });
  loading.addEventListener('touchstart', enterSite, { passive: true, once: true });

  // Stop audio if page is closed/unloaded
  window.addEventListener('beforeunload', function() {
    try { audio.pause(); } catch(e) {}
  });
});
