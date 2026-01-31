document.addEventListener('DOMContentLoaded', function() {
  const audio = document.getElementById('bg-audio');
  const loading = document.getElementById('loading');
  const topFrost = document.getElementById('top-frost');
  const bottomFrost = document.getElementById('bottom-frost');
  const img = document.querySelector('.fullscreen-image');

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
  const enterSite = () => {
    if (audio.muted) audio.muted = false;
    audio.currentTime = 0;
    audio.play().catch(() => {
      // If play fails due to policy, user interaction should fix it
    });
    loading.classList.add('hidden');
    // Also hide frost overlays after entering
    if (topFrost) topFrost.style.display = 'none';
    if (bottomFrost) bottomFrost.style.display = 'none';
  };
  loading.addEventListener('pointerdown', enterSite, { once: true });

  // Stop audio if page is closed/unloaded
  window.addEventListener('beforeunload', function() {
    try { audio.pause(); } catch(e) {}
  });
});
