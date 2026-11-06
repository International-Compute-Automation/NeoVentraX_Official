/** Progressive enhancement: submit forms with fetch when a real endpoint is configured. */
export function enhanceForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-nvx-form]:not([data-ready])').forEach((form) => {
    form.dataset.ready = '1';
    if (form.action.startsWith('mailto:')) return; // no endpoint configured: let the mail client handle it
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = form.querySelector<HTMLElement>('.status')!;
      const btn = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
      btn.disabled = true;
      status.className = 'status';
      status.textContent = 'Sending…';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        status.classList.add('ok');
        status.textContent = 'Thank you! Your submission has been received.';
      } catch {
        status.classList.add('err');
        status.textContent = 'Sorry, something went wrong. Please email us at hr@neoventrax.com.';
      } finally {
        btn.disabled = false;
      }
    });
  });
}
