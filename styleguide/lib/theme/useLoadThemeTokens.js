import * as React from 'react';

/**
 * Загружает токены для конкретной темы.
 * @param {string} themeName
 * @param {object} appearanceOptions
 * @param {Document} doc
 * @return {boolean}
 */
export function useLoadThemeTokens(themeName, appearanceOptions, doc = document) {
  const [pending, setPending] = React.useState(false);
  const promiseRef = React.useRef(null);

  React.useEffect(() => {
    if (pending || promiseRef.current !== null) {
      return;
    }

    setPending(true);
    promiseRef.current = Promise.allSettled(
      appearanceOptions.map(({ url, disabled }) => {
        if (disabled || doc.querySelector(`link[href="${url}"]`)) {
          return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
          const linkEl = document.createElement('link');
          linkEl.addEventListener('load', resolve);
          linkEl.addEventListener('error', reject);
          linkEl.rel = 'stylesheet';
          linkEl.href = url;
          // Note: добавляем в конец body, чтобы гарантировано перебить базовые токены из `@vkontakte/vkui/dist/vkui.css`
          doc.body.appendChild(linkEl);
        });
      }),
    );

    promiseRef.current
      .catch((error) => {
        console.warn(`Error to load ${themeName}: ${error}`);
      })
      .finally(() => {
        promiseRef.current = null;
        setPending(false);
      });
  }, [pending, themeName, appearanceOptions]);

  return !pending;
}
