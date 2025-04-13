import React from "react";
import { MexicanFoodIcons } from "./MexicanFoodIcons";

function MexicanFoodIconsDemo() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Mexican Food Icons</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(MexicanFoodIcons).map(([name, Icon]) => (
          <div
            key={name}
            className="flex flex-col items-center justify-center gap-2 rounded-lg border border-gray-800 p-4 bg-black text-white hover:border-primary transition-colors"
          >
            <Icon className="h-12 w-12 text-primary" />
            <span className="text-sm capitalize">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MexicanFoodIconsDemo; 