"use client"
import { useState } from "react";

interface ImageGeneratorProps {
    generateImage: (
        text: string
    ) => Promise<{ success: boolean; imageUrl: string; error?: string }>;
}

export default function ImageGenerator({ generateImage }: ImageGeneratorProps) {
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [lastPrompt, setLastPrompt] = useState<string | null>(null); 
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLastPrompt(inputText);
        setIsLoading(true);
        setIsLoading(true);
        setImageSrc(null);
        setError(null);

        try {
            const result = await generateImage(inputText);
            if (!result.success) {
                throw new Error(result.error || "Failed to generate image");
            }

            if (result.imageUrl) {
                const img = new Image();
                img.onload = () => {
                    setImageSrc(result.imageUrl);
                };
                img.src = result.imageUrl;
            } else {
                throw new Error("No image URL received");
            }

            setInputText("");
        } catch (error) {
            console.error("Error:", error);
            setError(
                error instanceof Error ? error.message : "Failed to generate image"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-between p-8">
        <main className="flex-1">
         {lastPrompt && (
            <input
              type="text"
              value={lastPrompt}
              readOnly
              className="mb-4 text-lg p-3 block w-full border rounded focus:outline-none text-black"
              placeholder="Last prompt appears here..."
            />
          )}
          {imageSrc && (
    <div className="w-full max-w-2xl rounded-lg overflow-hidden shadow-lg">
      <img
        src={imageSrc}
        alt="Generated artwork"
        className="w-full h-auto"
        style={{ width: '30%', height: '30%' }}
      />
    </div>
  )}
        </main>
  
        <footer className="w-full max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="flex-1 p-3 rounded-lg bg-black/[.05] dark:bg-white/[.06] border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                placeholder="Describe the image you want to generate..."
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-lg bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors disabled:opacity-50"
              >
                {isLoading ? "Generating..." : "Generate"}
              </button>
            </div>
          </form>
        </footer>
      </div>
    );
}
