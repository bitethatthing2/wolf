import type { MenuItem as MenuItemType } from "@/types"
import { MenuIcon } from "@/components/common/menu-icon"
import { cn } from "@/lib/utils"

interface MenuItemProps {
  item: MenuItemType;
  className?: string;
}

export function MenuItem({ item, className }: MenuItemProps) {
  return (
    <div className={cn("p-3 mb-3 bg-black dark:bg-white rounded-lg", className)}>
      <div className="grid grid-cols-[auto_1fr_auto] gap-2">
        {item.icon && (
          <div className="pt-1">
            <MenuIcon 
              icon={item.icon} 
              size={18}
              className="text-white dark:text-black flex-shrink-0" 
            />
          </div>
        )}
        <div className="overflow-hidden">
          <h3 className="text-base font-bold text-white dark:text-black uppercase">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-gray-400 dark:text-gray-600 text-xs mt-1 line-clamp-2">
              {item.description}
            </p>
          )}
          {item.options && item.options.length > 0 && (
            <ul className="mt-1 space-y-0.5">
              {item.options.map((option, index) => (
                <li key={index} className="text-gray-400 dark:text-gray-600 text-xs">
                  • {option}
                </li>
              ))}
            </ul>
          )}
          {item.note && (
            <p className="text-gray-500 dark:text-gray-500 text-xs italic mt-1">
              {item.note}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="bg-white text-black dark:bg-black dark:text-white px-2 py-0.5 rounded-full text-sm font-bold whitespace-nowrap">
            {item.price}
          </div>
          <div className="flex flex-col gap-1 mt-1">
            {item.popular && (
              <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                Popular
              </span>
            )}
            {item.spicy && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                Spicy
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
