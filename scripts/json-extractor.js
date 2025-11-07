// Get the OpenAI response text from the correct location
const text = $input.item.json.output[0].content[0].text;

// Extract the JSON from the "DATA FOR LOGGING:" section
const jsonMatch = text.match(/DATA FOR LOGGING:[\s\S]*?```json\s*([\s\S]*?)\s*```/);

if (jsonMatch && jsonMatch[1]) {
  // Parse the JSON
  const jobData = JSON.parse(jsonMatch[1]);
  
  // Return it as structured data
  return { json: jobData };
} else {
  throw new Error('Could not find JSON data in response');
}
