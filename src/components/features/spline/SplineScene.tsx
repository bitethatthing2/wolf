import Spline from '@splinetool/react-spline';
import React from 'react';

const SplineScene: React.FC = () => (
  <div className="w-full max-w-2xl mx-auto aspect-[16/9] rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-lg bg-slate-100 dark:bg-slate-900">
    <Spline scene="https://prod.spline.design/M9kYxLP7PKUqvZAO/scene.splinecode" />
  </div>
);

export default SplineScene;
