import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`mb-8 text-center ${className}`}>
      <h1 className="text-4xl font-bold mb-2 text-white uppercase tracking-wide">{title}</h1>
      {subtitle && (
        <p className="text-lg text-white/80">{subtitle}</p>
      )}
    </div>
  );
};

export default PageHeader;
