import { NextResponse } from "next/server";
import {put} from "@vercel/blob";
import crypto from "crypto";


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;
    console.log(text)
    const apiSecret = request.headers.get("X-API-SECRET");
    if (apiSecret !== process.env.API_KEY) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }
    const modalApiUrl = process.env.MODEL_URL;
    const url = new URL(modalApiUrl||"");
    url.searchParams.set("prompt",text)
    console.log("Requesting url: ", url.toString());
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        "X-API-key" :process.env.API_KEY || "",
        Accept: "image/jpeg",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Response:", errorText);
      throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
      );
  }
  
    
    const filename = `${crypto.randomUUID()}.jpg`;
    const imageBuffer = await response.arrayBuffer();
    const blob = await put(filename, imageBuffer, {
      access: "public",
      contentType: "image/jpeg",
  });
    
    return NextResponse.json({
      success: true,
      imageUrl: blob.url,
    })

  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
