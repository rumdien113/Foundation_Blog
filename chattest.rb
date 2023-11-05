require 'openai'
OpenAI.api_key = "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" 

response = OpenAI::Client.new.completions(
  engine: "text-davinci-002",
  prompt: "Hello world",
  max_tokens: 5
)

puts response