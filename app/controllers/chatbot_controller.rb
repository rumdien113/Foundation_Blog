# chatbot_controller.rb

class ChatbotController < ApplicationController

  before_action :load_intents

  def converse
    intent = find_intent(params[:question])
  
    if intent && intent != "null"
      response = { answer: intent['response'] }
    else
      response = { answer: "Hmm, I'm not sure I have an answer for that yet." }
    end
  
    if response["answer"] != "null"
      render json: response
    else
      render json: { answer: "Hmm, I'm not sure I have an answer for that yet." }
    end
  end
  

  private

  def load_intents
    file = File.read('app/intents.json')
    @intents = JSON.parse(file)
  end

  def find_intent(question)
    question_words = question.downcase.split(' ')
  
    max_score = 0
    best_match = "Xin lỗi, tôi không có dữ liệu. Tôi đang trong quá trình training."
  
    @intents.each do |intent|
      sample_words = intent['question'].downcase.split(' ')
  
      # Calculate Jaccard similarity
      intersection = (question_words & sample_words).size
      union = (question_words | sample_words).size
      score = intersection.to_f / union
  
      if score >= 0.4  # Adjust the threshold as needed
        return intent if score > max_score
        max_score = score
        best_match = intent
      end
    end
  
    return best_match
  end
  
end