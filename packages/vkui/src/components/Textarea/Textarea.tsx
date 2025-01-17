import * as React from 'react';
import { classNames } from '@vkontakte/vkjs';
import { useAdaptivity } from '../../hooks/useAdaptivity';
import { useEnsuredControl } from '../../hooks/useEnsuredControl';
import { useExternRef } from '../../hooks/useExternRef';
import { HasAlign, HasRef, HasRootRef } from '../../types';
import { FormField, FormFieldProps } from '../FormField/FormField';
import { Text } from '../Typography/Text/Text';
import styles from './Textarea.module.css';

const sizeYClassNames = {
  none: styles['Textarea--sizeY-none'],
  ['compact']: styles['Textarea--sizeY-compact'],
};

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onResize'>,
    HasRef<HTMLTextAreaElement>,
    HasRootRef<HTMLElement>,
    Pick<React.CSSProperties, 'maxHeight'>,
    HasAlign,
    Pick<FormFieldProps, 'status' | 'mode'> {
  grow?: boolean;
  onResize?(el: HTMLTextAreaElement): void;
  defaultValue?: string;
}

/**
 * @see https://vkcom.github.io/VKUI/#/Textarea
 */
export const Textarea = ({
  defaultValue = '',
  grow = true,
  style,
  onResize,
  className,
  getRootRef,
  getRef,
  rows = 2,
  maxHeight,
  status,
  onChange: onChangeProp,
  value: valueProp,
  align,
  mode,
  ...restProps
}: TextareaProps) => {
  const [value, onChange] = useEnsuredControl({
    defaultValue,
    onChange: onChangeProp,
    value: valueProp,
  });
  const currentScrollHeight = React.useRef<number>();
  const elementRef = useExternRef(getRef);
  const { sizeY = 'none' } = useAdaptivity();

  // autosize input
  React.useEffect(() => {
    const el = elementRef.current;

    if (grow && el?.offsetParent) {
      el.style.height = '';
      el.style.height = `${el.scrollHeight}px`;

      if (el.scrollHeight !== currentScrollHeight.current && onResize) {
        onResize(el);
        currentScrollHeight.current = el.scrollHeight;
      }
    }
  }, [grow, value, sizeY, elementRef, onResize]);

  return (
    <FormField
      className={classNames(
        styles['Textarea'],
        sizeY !== 'regular' && sizeYClassNames[sizeY],
        align === 'right' && styles['Textarea--align-right'],
        align === 'center' && styles['Textarea--align-center'],
        className,
      )}
      style={style}
      getRootRef={getRootRef}
      disabled={restProps.disabled}
      status={status}
      mode={mode}
    >
      <Text
        {...restProps}
        Component="textarea"
        normalize={false}
        style={{ maxHeight }}
        rows={rows}
        className={styles['Textarea__el']}
        value={value}
        onChange={onChange}
        getRootRef={elementRef}
      />
    </FormField>
  );
};
