"use client"
import { useState, useEffect} from "react";
import Image from 'next/image'
interface ImageGeneratorProps {
    generateImage: (
        text: string
    ) => Promise<{ success: boolean; imageUrl: string; error?: string }>;
}

export default function ImageGenerator({ generateImage }: ImageGeneratorProps) {
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [lastPrompt, setLastPrompt] = useState<string | null>(null); 
    //const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [bookmarkedImages, setBookmarkedImages] = useState<string[]>([]);

    useEffect(() => {
        const savedBookmarks = JSON.parse(localStorage.getItem("bookmarkedImages") || "[]");
        setBookmarkedImages(savedBookmarks);
    }, []);

    // Save bookmarks to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("bookmarkedImages", JSON.stringify(bookmarkedImages));
    }, [bookmarkedImages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLastPrompt(inputText);
        setIsLoading(true);
        setIsLoading(true);
        //setImageSrc(null);
        setError(null);

        try {
            const result = await generateImage(inputText);
            if (!result.success) {
                throw new Error(result.error || "Failed to generate image");
            }

            if (result.imageUrl) {
                setImages(prevImages => [...prevImages, result.imageUrl]);
            } else {
                throw new Error("No image URL received");
            }

            setInputText("");
        } catch (caughtError) {
            console.error("Error:", caughtError);
            setError(
                caughtError instanceof Error ? caughtError.message : "Failed to generate image"
            );
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleBookmark = (image: string) => {
        if (!bookmarkedImages.includes(image)) {
            setBookmarkedImages((prev) => [...prev, image]);
        }
    };
    

    return (
      <div className="min-h-screen flex flex-col justify-between p-8">
          <main className="flex-1">
              {/* Header */}
              <header className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-white drop-shadow-md">
                      Unleash Your Imagination!
                  </h1>
              </header>
  
              {/* Form for prompt input and generate button */}
              <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mb-8">
                  <div className="flex gap-2">
                      <input
                          type="text"
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          className="flex-1 p-3 rounded-lg bg-black/[.05] dark:bg-white/[.06] border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                          placeholder="Describe the image you want to generate..."
                          disabled={isLoading}
                      />
                      <button
                          type="submit"
                          disabled={isLoading}
                          className="px-6 py-3 rounded-lg bg-foreground text-blue-700 hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors disabled:opacity-50"
                      >
                          {isLoading ? "Generating..." : "Generate"}
                      </button>
                  </div>
              </form>
              {/* Render the Clear button and image stack when images exist */}
              {images.length > 0 && (
                  <div>
                      {/* Clear button */}
                      <button
                          onClick={() => setImages([])}
                          className="mb-4 px-6 py-3 rounded-lg bg-red-500 text-white hover:bg-red-700 transition-colors"
                      >
                          Clear Images
                      </button>
  
                      {/* Stacked images */}
                      <div className="flex flex-wrap gap-4">
                          {images.map((image, index) => (
                              <div key={index} className="relative group w-full max-w-xs rounded-lg overflow-hidden shadow-lg">
                                  <Image
                                      src={image}
                                      alt={`Generated artwork ${index + 1}`}
                                      className="w-full h-auto"
                                  />
                                     {/* Bookmark Button */}
                             <button
                              onClick={() => handleBookmark(image)}
                              className="absolute top-2 right-2 rounded-full p-2 z-10 transition-opacity
                              ${bookmarkedImages.includes(image) ? 'bg-white text-black' : 'bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100'}}"
                                >
                               <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-white"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 3v18l7-5 7 5V3H5z"
                    />
                </svg>
                             </button>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </main>
      </div>
  );
  
}
