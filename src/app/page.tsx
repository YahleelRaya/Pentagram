"use server";

import ImageGenerator from "./comp/image_generator";
import { generateImage } from "./actions/generate_image";

export default async function Home() {
    return <ImageGenerator generateImage={generateImage} />;
}
