import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { revalidatePath } from "next/cache";

export const GET = async (request) => {
    try {
        await connectToDB()

        const prompts = await Prompt.find({}).populate('creator')

            //To dynamically get the path
        const path = request.nextUrl.searchParams.get("path") || "/";

        revalidatePath(path);

        return new Response(JSON.stringify(prompts), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch all prompts", { status: 500 })
    }
} 

