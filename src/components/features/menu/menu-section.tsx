import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { MenuIcon } from "@/components/common/menu-icon"
import type { MenuSection as MenuSectionType } from "@/types"

interface MenuSectionProps {
  section: MenuSectionType;
  className?: string;
}

export function MenuSection({ section, className }: MenuSectionProps) {
  const { title, items = [], icon } = section;
  
  return (
    <Card className={cn("w-full bg-card", className)}>
      <CardHeader className="border-b py-3">
        <div className="flex items-center gap-2">
          {icon && (
            <MenuIcon 
              icon={icon} 
              size={24}
              className="text-foreground flex-shrink-0" 
            />
          )}
          <CardTitle className="text-xl font-bold tracking-tight">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-lg border p-3"
            >
              <div className="grid grid-cols-[auto_1fr_auto] gap-2">
                {item.icon && (
                  <div className="pt-1">
                    <MenuIcon 
                      icon={item.icon} 
                      size={18}
                      className="text-foreground flex-shrink-0" 
                    />
                  </div>
                )}
                <div className="overflow-hidden">
                  <h3 className="font-semibold leading-tight tracking-tight">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  {item.options && item.options.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {item.options.map((option, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground">
                          • {option}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.note && (
                    <p className="text-xs italic text-muted-foreground mt-1">
                      {item.note}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-base font-semibold whitespace-nowrap">
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
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
