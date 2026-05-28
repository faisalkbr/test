import { Fragment } from 'react';
import { Link } from 'react-router-dom';

export default function PageHeader({ breadcrumb, title, description, actions }) {
  return (
    <div className="border-b border-ink-100 px-10 pt-6 pb-[22px] bg-bg">
      {breadcrumb && (
        <div className="text-[12.5px] text-ink-500 mb-2.5 flex gap-1.5 items-center">
          {breadcrumb.map((b, i) => {
            const isLast = i === breadcrumb.length - 1;
            return (
              <Fragment key={`${i}-${b.label}`}>
                {b.to && !isLast ? (
                  <Link
                    to={b.to}
                    className="text-ink-500 hover:text-ink-900 transition-colors"
                  >
                    {b.label}
                  </Link>
                ) : (
                  <span className={isLast ? 'text-ink-900' : ''}>{b.label}</span>
                )}
                {!isLast && <span className="text-ink-300">/</span>}
              </Fragment>
            );
          })}
        </div>
      )}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="m-0 text-ink-950 text-[26px] font-medium tracking-[-0.02em]">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 mb-0 text-sm text-ink-500 max-w-[600px]">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex gap-2 items-center">{actions}</div>
        )}
      </div>
    </div>
  );
}
