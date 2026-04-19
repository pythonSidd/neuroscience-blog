import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function generateBlogFromIdea(idea: string): Promise<{
  title: string;
  content: string;
  excerpt: string;
  category: 'research' | 'tutorial' | 'insight';
  readTime: number;
}> {
  try {
    const prompt = `You are an expert neuroscience writer. Based on the following blog idea, create a comprehensive blog post.

Blog Idea: "${idea}"

Please provide:
1. A compelling blog title
2. A brief excerpt (150 characters max)
3. The full blog post content in markdown format
4. Categorize as 'research', 'tutorial', or 'insight'
5. Estimate reading time in minutes

Format your response as JSON:
{
  "title": "Blog Title Here",
  "excerpt": "Brief excerpt...",
  "content": "Full markdown content...",
  "category": "research|tutorial|insight",
  "readTime": 5
}

Make sure the content is well-structured with proper markdown formatting (headings, lists, code blocks where appropriate).`;

    const message = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      title: parsed.title || 'Untitled',
      content: parsed.content || '',
      excerpt: parsed.excerpt || '',
      category: parsed.category || 'insight',
      readTime: parsed.readTime || 5,
    };
  } catch (error) {
    console.error('Error generating blog from AI:', error);
    throw error;
  }
}

export async function improveBlogContent(content: string, instruction: string): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `Please improve the following blog content based on this instruction: "${instruction}"\n\nCurrent content:\n${content}`,
        },
      ],
    });

    return message.content[0].type === 'text' ? message.content[0].text : '';
  } catch (error) {
    console.error('Error improving blog content:', error);
    throw error;
  }
}
