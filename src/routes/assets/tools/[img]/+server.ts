import type { RequestHandler } from "@sveltejs/kit";
import { readFile } from "node:fs/promises";

export const GET: RequestHandler = async ({params}) => {
    const filePath = `./assets/tools/${params.img}`;

    const file = await readFile(filePath);
    return new Response(file, {
        headers: {
            "Cache-Control": "public, max-age=3600" // 1 hour
        }
    });
};