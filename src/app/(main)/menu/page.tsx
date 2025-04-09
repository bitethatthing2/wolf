import { menuData } from '@/lib/menu-data';
import { MenuItem } from '@/components/features/menu/menu-item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { MenuSection as MenuSectionType } from '@/types';
import { UtensilsCrossed, Wine } from "lucide-react";

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-black dark:text-white">Our Menu</h1>
          <p className="text-gray-600 dark:text-gray-400">Fresh, delicious, made just for you</p>
        </div>

        <Tabs defaultValue="food" className="max-w-3xl mx-auto">
          <div className="bg-slate-800 dark:bg-white rounded-lg mb-8 overflow-hidden">
            <TabsList className="grid w-full grid-cols-2 border-0 bg-transparent p-0 h-auto">
              <TabsTrigger 
                value="food" 
                className="data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black data-[state=inactive]:bg-slate-800 data-[state=inactive]:text-slate-400 dark:data-[state=inactive]:bg-white dark:data-[state=inactive]:text-slate-500 rounded-none py-3 text-base font-bold uppercase transition-colors"
              >
                <UtensilsCrossed className="w-4 h-4 mr-2" />
                FOOD
              </TabsTrigger>
              <TabsTrigger 
                value="drinks" 
                className="data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black data-[state=inactive]:bg-slate-800 data-[state=inactive]:text-slate-400 dark:data-[state=inactive]:bg-white dark:data-[state=inactive]:text-slate-500 rounded-none py-3 text-base font-bold uppercase transition-colors"
              >
                <Wine className="w-4 h-4 mr-2" />
                DRINKS
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="food" id="food" className="space-y-12 scroll-mt-20">
            {menuData.food.map((section: MenuSectionType) => (
              <div key={section.title} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-black dark:text-white uppercase">
                  {section.title}
                </h2>
                <div>
                  {section.items?.map((item, index) => (
                    <MenuItem key={index} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="drinks" id="drinks" className="space-y-12 scroll-mt-20">
            {menuData.drinks.map((section: MenuSectionType) => (
              <div 
                key={section.title} 
                id={
                  section.title === 'HAPPY HOUR' ? 'happy-hour' :
                  section.title === 'HOUSE FAVORITES' ? 'drinks-house-favorites' :
                  undefined
                }
                className={`mb-12 ${['HAPPY HOUR', 'HOUSE FAVORITES'].includes(section.title) ? 'scroll-mt-20' : ''}`}
              >
                <h2 className="text-2xl font-bold mb-6 text-black dark:text-white uppercase">
                  {section.title}
                </h2>
                <div>
                  {section.items?.map((item, index) => (
                    <MenuItem key={index} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}