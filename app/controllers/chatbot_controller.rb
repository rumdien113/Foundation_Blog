class ChatbotController < ApplicationController

  def ask
    if params[:query].present?
      response = get_openai_response(params[:query])
      @answer = response.dig("choices", 0, "text") 
    end
  end

  private

  def get_openai_response(prompt)
    api_key = "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"
    OpenAI::Client.new(api_key: api_key).completions(
      engine: "text-davinci-002", 
      prompt: prompt,
      max_tokens: 100
    )
  end

end