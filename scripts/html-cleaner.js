// Get the raw HTML from HTTP Request
const rawHtml = $('HTTP Request').item.json.data;

// Clean the HTML with better paragraph preservation
let cleanText = rawHtml
  // Remove script tags and content
  .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  // Remove style tags and content
  .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
  // Add newlines after block elements BEFORE removing tags
  .replace(/<\/(p|div|h1|h2|h3|h4|h5|h6|li|tr|br)>/gi, '\n')
  .replace(/<br\s*\/?>/gi, '\n')
  // Remove all HTML tags
  .replace(/<[^>]+>/g, '')
  // Decode HTML entities
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  // Clean up whitespace
  .replace(/\s*\n\s*/g, '\n')  // Normalize newlines
  .replace(/\n{3,}/g, '\n\n')  // Max 2 consecutive newlines
  .replace(/  +/g, ' ')        // Multiple spaces to single space
  .replace(/^\s+/gm, '')       // Remove leading spaces
  .trim();

// Get data from previous node
const previousData = $input.item.json;

// Return the clean text plus all previous data
return { 
  json: {
    ...previousData,
    cleanJobDescription: cleanText
  }
};
