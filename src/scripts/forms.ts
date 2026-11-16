/** Submit the website forms to /api/forms/ without leaving the page, and show the result under the button. */
export function enhanceForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-nvx-form]:not([data-ready])').forEach((form) => {
    form.dataset.ready = '1';
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = form.querySelector<HTMLElement>('.status')!;
      const btn = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
      btn.disabled = true;
      status.className = 'status';
      status.textContent = 'Sending…';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        if (!res.ok) {
          // 400 = something to fix in the form: show the server's message; anything else: generic fallback
          throw new Error(res.status === 400 || res.status === 429 ? body.message : undefined);
        }
        form.reset();
        status.classList.add('ok');
        status.textContent = body.message || 'Thank you! Your submission has been received.';
      } catch (err) {
        status.classList.add('err');
        // network failures are TypeErrors with browser wording - don't show those
        status.textContent = (!(err instanceof TypeError) && (err as Error).message) || 'Sorry, something went wrong. Please email us at hr@neoventrax.com.';
      } finally {
        btn.disabled = false;
      }
    });
  });
}
