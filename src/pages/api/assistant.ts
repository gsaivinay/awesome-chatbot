import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { supporting_style, users_query } = req.query;

    const llmPrompt = `COMFORTING_INSTRUCTIONS: You need to make the user feel awesome, compliment them a lot! Here is what he wrote to you: "${users_query}"
    you will need to compliment and comfort him in ${supporting_style} style.
    Try to be funny and verbose, but super nice and pleasing at the same time.
    Please follow these rules:
    1. Let your message be long, and with calm emojis.
    2. Tell the user how awesome he is, and how much you love him.
    3. Tell him how much you love his work, and how much you appreciate him.
    4. Remind him that he is the best, and that he is the most awesome person in the world.
  
    Thought: Now I know the final answer`;

    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(llmPrompt);
}
