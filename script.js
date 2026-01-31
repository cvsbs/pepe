document.addEventListener('DOMContentLoaded', function() {
  const audio = document.getElementById('bg-audio');
  const loading = document.getElementById('loading');

  // The audio is muted initially; we wait for the first tap to enter
  const enterSite = () => {
    if (audio.muted) audio.muted = false;
    audio.currentTime = 0;
    audio.play().catch(() => {
      // If play fails due to policy, user interaction should fix it
    });
    loading.classList.add('hidden');
  };
  loading.addEventListener('pointerdown', enterSite, { once: true });

  // Stop audio if page is closed/unloaded
  window.addEventListener('beforeunload', function() {
    try { audio.pause(); } catch(e) {}
  });
});
