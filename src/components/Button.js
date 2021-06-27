import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import './../styles/Button.scss';

export default function Button({ children, to, color }) {
  return (
    <Link to={to}>
      <button className={clsx('button', color && 'color-btn', `btn-${color}`)}>
        {children}
      </button>
    </Link>
  );
}
