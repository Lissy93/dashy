import React from 'react';
import UpdateBanner from '../components/UpdateBanner';

export default function Root({ children }) {
  return (
    <>
      <UpdateBanner />
      {children}
    </>
  );
}
