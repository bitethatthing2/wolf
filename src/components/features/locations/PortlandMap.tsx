import React from 'react';

const PortlandMap: React.FC = () => {
  return (
    <div className="w-full rounded-lg overflow-hidden border border-white/10 shadow-md">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d359654.2626714958!2d-123.1637501726135!3d45.23163496674077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54950bbb77279f67%3A0xfb5a916203b1c05a!2sSide%20Hustle!5e0!3m2!1sen!2sus!4v1744148907839!5m2!1sen!2sus" 
        width="100%" 
        height="450" 
        className="border-0" 
        allow="accelerometer; autoplay; clipboard-read; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; geolocation; microphone; camera; display-capture; fullscreen; magnetometer; payment; publickey-credentials-get; screen-wake-lock; serial; usb; xr-spatial-tracking"
        title="Side Hustle Portland Location" 
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default PortlandMap;
