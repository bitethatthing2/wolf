import React from 'react';

const SalemMap: React.FC = () => {
  return (
    <div className="w-full rounded-lg overflow-hidden border border-white/10 shadow-md">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2824.155837503885!2d-123.0413951240534!3d44.94049986822883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54bfff43800426c7%3A0xe32b22509988966e!2sSide%20Hustle%20Bar!5e0!3m2!1sen!2sus!4v1744148875887!5m2!1sen!2sus" 
        width="100%" 
        height="450" 
        className="border-0" 
        allow="accelerometer; autoplay; clipboard-read; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; geolocation; microphone; camera; display-capture; fullscreen; magnetometer; payment; publickey-credentials-get; screen-wake-lock; serial; usb; xr-spatial-tracking"
        title="Side Hustle Bar Salem Location" 
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default SalemMap;
