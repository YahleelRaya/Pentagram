import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    // TODO: Call your Image Generation API here
    // For now, we'll just echo back the text
    const modalApiUrl = `https://yahleelraya--pentagram-inference-generate-dev.modal.run?prompt=${encodeURIComponent(text)}`;

    const response = await fetch(modalApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`  
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to generate image: ${response.statusText}`);
    }
    const imageBlob = await response.blob();

    return new Response(imageBlob, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
      },
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
