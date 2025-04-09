import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LocationDirectionButtonsProps {
  address: string;
  className?: string;
}

export function LocationDirectionButtons({ address, className }: LocationDirectionButtonsProps) {
  const encodedAddress = encodeURIComponent(address);
  
  const openGoogleMaps = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
  };

  const openAppleMaps = () => {
    window.open(`http://maps.apple.com/?daddr=${encodedAddress}`, '_blank');
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <Button 
        onClick={openGoogleMaps}
        className="flex-1 bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90"
      >
        Google Maps
      </Button>
      <Button 
        onClick={openAppleMaps}
        className="flex-1 bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90"
      >
        Apple Maps
      </Button>
    </div>
  );
}
