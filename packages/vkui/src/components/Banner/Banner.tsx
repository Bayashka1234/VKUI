import * as React from 'react';
import { classNames } from '@vkontakte/vkjs';
import { usePlatform } from '../../hooks/usePlatform';
import { Platform } from '../../lib/platform';
import { hasReactNode } from '../../lib/utils';
import {
  Icon24Chevron,
  Icon24DismissSubstract,
  Icon24DismissDark,
  Icon24Cancel,
} from '@vkontakte/icons';
import { Tappable } from '../Tappable/Tappable';
import { IconButton } from '../IconButton/IconButton';
import { Headline } from '../Typography/Headline/Headline';
import { Subhead } from '../Typography/Subhead/Subhead';
import { Text } from '../Typography/Text/Text';
import { Title } from '../Typography/Title/Title';
import styles from './Banner.module.css';

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Тип баннера.
   */
  mode?: 'tint' | 'image';
  size?: 's' | 'm';
  /**
   * Тип действия в правой части баннера.
   *
   * - `dismiss` – отображается иконка крестика, при клике на неё сработает свойство `onDismiss`.
   * - `expand` – отображается иконка шеврона, которая подразумевает, что при клике на баннер можно куда-то перейти.
   */
  asideMode?: 'dismiss' | 'expand';
  /**
   * Срабатывает при клике на иконку крестика при `asideMode="dismiss"`.
   */
  onDismiss?: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * `aria-label` для кнопки при `asideMode="dismiss". Необходим, чтобы кнопка была доступной.
   */
  dismissLabel?: string;
  /**
   * Содержимое, отображаемое в левой части баннера.
   */
  before?: React.ReactNode;
  /**
   * Заголовок. <br />
   * При использовании этого свойства рекомендуется не указывать `text`.
   */
  header?: React.ReactNode;
  /**
   * Подзаголовок. <br />
   * При использовании этого свойства рекомендуется не указывать `text`.
   */
  subheader?: React.ReactNode;
  /**
   * Текст баннера. <br />
   * Это свойство следует использовать без указания `header` и `subheader`.
   */
  text?: React.ReactNode;
  /**
   * При использовании `mode="image"`.
   *
   * - `light` – в качестве фона используется светлое изображение, цвет текста в баннере будет тёмным.
   * - `dark` – в качестве фона используется тёмное изображение, цвет текста будет светлым.
   */
  imageTheme?: 'light' | 'dark';
  /**
   * При использовании `mode="image"`.
   *
   * Элемент, который нужно стилизовать цветом и/или фоном. Этот элемент будет растянут на 100% ширины и высоты баннера.
   */
  background?: React.ReactNode;
  /**
   * Кнопки-действия. Принимает [`Button`](https://vkcom.github.io/VKUI/#/Button).
   *
   * - В режиме `tint` или `image` со светлым фоном используйте только с параметрами:
   *    - `mode="primary"`
   *    - `mode="secondary"`
   * - В режиме `image` с тёмным фоном используйте с параметрами:
   *    - `appearance="overlay"`.
   *
   * Для набора кнопок используйте [`ButtonGroup`](https://vkcom.github.io/VKUI/#/ButtonGroup) с параметрами:
   *
   * - `gap="m" mode="horizontal" stretched`
   * - `gap="m" mode="vertical" stretched`
   */
  actions?: React.ReactNode;
}

/**
 * @see https://vkcom.github.io/VKUI/#/Banner
 */
export const Banner = ({
  mode = 'tint',
  imageTheme = 'dark',
  size = 's',
  before,
  asideMode,
  header,
  subheader,
  text,
  children,
  background,
  actions,
  onDismiss,
  dismissLabel = 'Скрыть',
  className,
  ...restProps
}: BannerProps) => {
  const platform = usePlatform();

  const HeaderTypography = size === 'm' ? Title : Headline;
  const SubheaderTypography = size === 'm' ? Text : Subhead;

  const IconDismissIOS = mode === 'image' ? Icon24DismissDark : Icon24DismissSubstract;

  const content = (
    <React.Fragment>
      {mode === 'image' && background && (
        <div aria-hidden className={styles['Banner__bg']}>
          {background}
        </div>
      )}

      {before && <div className={styles['Banner__before']}>{before}</div>}

      <div className={styles['Banner__content']}>
        {hasReactNode(header) && (
          <HeaderTypography
            Component="span"
            className={styles['Banner__header']}
            weight="2"
            level={size === 'm' ? '2' : '1'}
          >
            {header}
          </HeaderTypography>
        )}
        {hasReactNode(subheader) && (
          <SubheaderTypography Component="span" className={styles['Banner__subheader']}>
            {subheader}
          </SubheaderTypography>
        )}
        {hasReactNode(text) && <Text className={styles['Banner__text']}>{text}</Text>}
        {hasReactNode(actions) && React.Children.count(actions) > 0 && (
          <div className={styles['Banner__actions']}>{actions}</div>
        )}
      </div>
    </React.Fragment>
  );

  return (
    <section
      {...restProps}
      className={classNames(
        styles['Banner'],
        platform === Platform.IOS && styles['Banner--ios'],
        styles[`Banner--mode-${mode}`],
        styles[`Banner--size-${size}`],
        mode === 'image' && imageTheme === 'dark' && styles['Banner--inverted'],
        className,
      )}
    >
      {asideMode === 'expand' ? (
        <Tappable
          className={styles['Banner__in']}
          activeMode={platform === Platform.IOS ? 'opacity' : 'background'}
          role="button"
        >
          {content}

          <div className={styles['Banner__aside']}>
            <Icon24Chevron />
          </div>
        </Tappable>
      ) : (
        <div className={styles['Banner__in']}>
          {content}

          {asideMode === 'dismiss' && (
            <div className={styles['Banner__aside']}>
              <IconButton
                aria-label={dismissLabel}
                className={styles['Banner__dismiss']}
                onClick={onDismiss}
                hoverMode="opacity"
                hasActive={false}
              >
                {platform === Platform.IOS ? <IconDismissIOS /> : <Icon24Cancel />}
              </IconButton>
            </div>
          )}
        </div>
      )}
    </section>
  );
};