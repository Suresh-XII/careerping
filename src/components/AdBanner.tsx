import React, { useEffect } from 'react';

interface AdBannerProps {
  variant?: 'horizontal' | 'sidebar' | 'in-feed';
  slotId?: string;
  className?: string;
}

/**
 * AdBanner Component
 * Integrates Google AdSense and third-party advertising networks.
 * Fully compliant with Google AdSense Better Ads Standards:
 * - Clear "ADVERTISEMENT" labeling
 * - Non-intrusive layout (does NOT block user navigation or apply buttons)
 * - Safe error handling (graceful degradation if ad-blocker is active)
 */
export const AdBanner: React.FC<AdBannerProps> = ({
  variant = 'horizontal',
  slotId,
  className = ''
}) => {
  const adsenseClientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-7188164081014168';

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      }
    } catch {
      // AdSense push safely caught if blocked or already initialized
    }
  }, []);

  // Responsive styling per ad slot type
  const containerStyles = {
    horizontal: 'w-full min-h-[90px] max-w-5xl mx-auto my-6',
    sidebar: 'w-full min-h-[250px] my-4',
    'in-feed': 'w-full min-h-[100px] my-4'
  }[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-3 text-center transition-all ${containerStyles} ${className}`}
      aria-label="Advertisement"
    >
      {/* Google AdSense Mandatory Label */}
      <div className="mb-2 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        <span>Advertisement</span>
      </div>

      {/* Google AdSense Standard Tag */}
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={adsenseClientId}
        data-ad-slot={slotId || '1234567890'}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />

      {/* Unobtrusive Fallback / Placeholder when AdSense is pending or script is blocked */}
      <div className="flex flex-col items-center justify-center py-4 text-xs text-slate-400">
        <span className="font-medium text-slate-500">Sponsored Space</span>
        <span className="text-[11px] text-slate-400">Google AdSense Integration Ready</span>
      </div>
    </div>
  );
};
