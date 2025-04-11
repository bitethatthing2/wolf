'use client';

import React, { useState, useEffect } from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface ReviewData {
  author: string;
  rating: number;
  text: string;
  photoUrl?: string;
  date: string;
}

// Sample reviews as a fallback
const SAMPLE_REVIEWS: ReviewData[] = [
  {
    author: "John Smith",
    rating: 5,
    text: "Amazing atmosphere! The food was delicious and the staff were so friendly. I'll definitely be coming back again soon.",
    date: "2 months ago"
  },
  {
    author: "Emily Johnson",
    rating: 5,
    text: "This place has the best sports viewing experience in town! Great selection of drinks and the nachos are incredible.",
    date: "3 weeks ago"
  },
  {
    author: "Michael Davis",
    rating: 4,
    text: "Really enjoyed my evening here. Good food, good drinks, and good vibes. The only reason for 4 stars instead of 5 is that it was pretty busy and took a while to get served.",
    date: "1 month ago"
  },
  {
    author: "Sarah Williams",
    rating: 5,
    text: "Perfect spot to watch the game! The atmosphere is electric and the staff are super attentive. Love this place!",
    date: "2 weeks ago"
  }
];

const GoogleReviewsSection: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setMounted(true);
    
    // Use the sample reviews data since we can't fetch directly from Google
    setTimeout(() => {
      setReviews(SAMPLE_REVIEWS);
      setLoading(false);
    }, 1000);
  }, []);
  
  // If not mounted yet, return null to avoid flash of unstyled content
  if (!mounted) return null;
  
  // Determine color scheme based on current theme
  const isDark = theme === 'dark';
  
  // Loading state
  if (loading) {
    return (
      <section className={`py-12 sm:py-16 md:py-20 ${isDark ? 'bg-gray-950/90' : 'bg-white'} w-full relative overflow-hidden`}>
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
          <div className="text-center mb-6">
            <h2 className={`section-title text-center mx-auto mb-4 text-2xl sm:text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-black'} uppercase tracking-wider`}>Customer Reviews</h2>
          </div>
          <div className={`w-full overflow-hidden rounded-xl ${isDark ? 'border border-white/10' : 'border border-black/10'} shadow-lg`}>
            <div className={`${isDark ? 'bg-gray-900/60' : 'bg-gray-50/70'} backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-lg flex justify-center items-center min-h-[400px]`}>
              <div className="animate-pulse text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mx-auto flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading reviews...</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className={`py-12 sm:py-16 md:py-20 ${isDark ? 'bg-gray-950/90' : 'bg-white'} w-full relative overflow-hidden`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className={`absolute top-[25%] left-[10%] w-32 h-32 rounded-full ${isDark ? 'bg-white/5' : 'bg-black/5'} blur-3xl`}></div>
        <div className={`absolute bottom-[20%] right-[15%] w-24 h-24 rounded-full ${isDark ? 'bg-white/5' : 'bg-black/5'} blur-2xl`}></div>
      </div>
      
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h2 className={`section-title text-center mx-auto mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-black'} uppercase tracking-wider`}>Customer Reviews</h2>
          <div className="flex flex-row items-center justify-center gap-1 mb-4">
            {/* 5 stars in a row */}
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                <Star className="h-4 w-4 text-white" fill="white" />
              </div>
            ))}
          </div>
          <p className={`text-center text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-700'} max-w-2xl mx-auto`}>
            See what our satisfied customers have to say about their experience at Side Hustle Bar
          </p>
        </div>
        
        <div className={`w-full overflow-hidden rounded-xl ${isDark ? 'border border-white/10' : 'border border-black/10'} shadow-lg`}>
          <div className={`${isDark ? 'bg-gray-900/60' : 'bg-gray-50/70'} backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-lg`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50 hover:bg-gray-800/80' : 'bg-white/70 hover:bg-white'} transition-colors border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <div className="flex items-start mb-3">
                    <div className={`w-10 h-10 rounded-full mr-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center overflow-hidden`}>
                      {review.photoUrl ? (
                        <img src={review.photoUrl} alt={review.author} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-semibold">{review.author.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{review.author}</h4>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-400'}`}
                              fill={star <= review.rating ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{review.text}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <a 
                href="https://g.page/r/CQhNxIBnWss2EB0/review" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'} transition-colors text-sm font-medium`}
              >
                <span>Write a Review</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 md:mt-10 text-center">
          <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
            Thank you for your feedback! It helps us improve and provide the best experience possible.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviewsSection;