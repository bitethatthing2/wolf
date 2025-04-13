import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  author: string;
  category: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "authentic-flour-tortillas",
    title: "Authentic Homemade Flour Tortillas: Chef Becky's Family Recipe",
    excerpt: "Learn the secrets to making perfect, authentic Mexican flour tortillas from scratch with Chef Becky's traditional family recipe.",
    content: "Growing up in a traditional Mexican household, I learned that the foundation of any great Mexican meal starts with the perfect tortilla. Today, I'm sharing my family's treasured flour tortilla recipe that has been passed down through generations. The key to authentic tortillas isn't just in the ingredients, but in the technique...",
    date: "April 7, 2025",
    image: "/blog-flour-tortillas.png",
    author: "Chef Rebeckah Sanchez",
    category: "Traditional Recipes"
  },
  {
    id: "birria-tacos-secrets",
    title: "Birria Tacos: The Ultimate Guide to This Trending Mexican Dish",
    excerpt: "Master the art of making restaurant-quality Birria Tacos with Chef Becky's step-by-step instructions and secret techniques.",
    content: "Birria tacos have taken social media by storm, and for good reason! This traditional dish from Jalisco, Mexico features tender, slow-cooked meat infused with a rich, flavorful consommé. The secret to truly exceptional birria is in the marinade and cooking method...",
    date: "March 30, 2025",
    image: "/blog-tacos-birria.png",
    author: "Chef Rebeckah Sanchez",
    category: "Trending Recipes"
  },
  {
    id: "mexican-cooking-secrets",
    title: "10 Mexican Cooking Secrets Only Professional Chefs Know",
    excerpt: "Chef Becky reveals the professional techniques and ingredients that make authentic Mexican cuisine so irresistible.",
    content: "After years in professional kitchens and learning from my family's culinary traditions, I've gathered cooking secrets that transform ordinary Mexican dishes into extraordinary culinary experiences. From using the right chiles to mastering the perfect salsa, these techniques will elevate your home cooking...",
    date: "March 22, 2025",
    image: "/blog-mexican-chef-secrets.png",
    author: "Chef Rebeckah Sanchez",
    category: "Chef Tips"
  },
  {
    id: "authentic-salsa-verde",
    title: "Perfect Salsa Verde: From Basic to Extraordinary",
    excerpt: "Discover how to make restaurant-quality salsa verde at home with Chef Becky's authentic techniques and ingredient tips.",
    content: "A great salsa verde can transform any Mexican dish from good to unforgettable. In this guide, I'll walk you through creating the perfect balance of tangy tomatillos, spicy chiles, and aromatic cilantro. The secret lies in roasting the ingredients to bring out their complex flavors...",
    date: "March 15, 2025",
    image: "/blog-salsa-verde.png",
    author: "Chef Rebeckah Sanchez",
    category: "Sauces & Condiments"
  },
  {
    id: "mexican-street-corn",
    title: "Elote: Mastering Mexican Street Corn at Home",
    excerpt: "Learn how to recreate the irresistible flavors of authentic Mexican street corn with Chef Becky's insider techniques.",
    content: "Elote, or Mexican street corn, is a perfect example of how simple ingredients can create an explosion of flavor. The combination of sweet corn, tangy lime, creamy mayo, salty cotija cheese, and spicy chile powder creates a harmony of flavors that's impossible to resist...",
    date: "March 8, 2025",
    image: "/blog-make-elote.png",
    author: "Chef Rebeckah Sanchez",
    category: "Street Food Favorites"
  },
  {
    id: "authentic-guacamole",
    title: "The Art of Perfect Guacamole: Chef Becky's Method",
    excerpt: "Elevate your guacamole game with Chef Becky's authentic techniques and ingredient selection secrets.",
    content: "Great guacamole is about more than just mashing avocados. It's about understanding the perfect balance of ingredients, the right technique for texture, and knowing when to serve it. In this guide, I'll share my professional secrets for creating guacamole that will impress even the most discerning Mexican food enthusiasts...",
    date: "March 1, 2025",
    image: "/blog-guacamole.png",
    author: "Chef Rebeckah Sanchez",
    category: "Essential Techniques"
  }
];

export default function ChefBlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-black dark:text-white">Sabores de México</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Authentic Mexican recipes, cooking techniques, and culinary secrets from Side Hustle Bar's Executive Chef Rebeckah Sanchez. Bring the flavors of Mexico to your home kitchen with these tried-and-true recipes.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-black dark:bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              {post.image && (
                <div className="relative w-full aspect-[16/9]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-600 mb-2">
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.author}</span>
                </div>
                <h2 className="text-xl font-bold text-white dark:text-black">
                  {post.title}
                </h2>
                <p className="text-gray-400 dark:text-gray-600 mt-2">
                  {post.excerpt}
                </p>
                <div className="mt-4">
                  <Button 
                    className="bg-white text-black dark:bg-black dark:text-white hover:bg-white/90 dark:hover:bg-black/90"
                  >
                    Read Full Recipe
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}