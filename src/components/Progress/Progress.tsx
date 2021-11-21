import * as React from 'react';
import { getClassName } from '../../helpers/getClassName';
import { HasRootRef } from '../../types';
import { usePlatform } from '../../hooks/usePlatform';
import './Progress.css';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement>, HasRootRef<HTMLDivElement> {
  value?: number;
}

const PROGRESS_MAX_VALUE = 100;
const PROGRESS_MIN_VALUE = 0;

const Progress: React.FC<ProgressProps> = ({ value, getRootRef, ...restProps }: ProgressProps) => {
  const platform = usePlatform();

  const progress = value > PROGRESS_MIN_VALUE ?
    value < PROGRESS_MAX_VALUE ?
      value
      :
      PROGRESS_MAX_VALUE
    :
    PROGRESS_MIN_VALUE;
  
  return (
    <div
      aria-valuenow={value}
      {...restProps}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      ref={getRootRef}
      vkuiClass={getClassName('Progress', platform)}
    >
      <div vkuiClass="Progress__bg" aria-hidden="true" />
      <div vkuiClass="Progress__in" style={{ width: `${progress}%` }} aria-hidden="true" />
    </div>
  );
};

Progress.defaultProps = {
  value: 0,
};

export default Progress;
