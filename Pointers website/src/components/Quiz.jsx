import React, { useState } from 'react'
import { CheckCircle, XCircle, RotateCcw, Trophy, Brain } from 'lucide-react'

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)

  const questions = [
    {
      question: 'Quelle est la syntaxe correcte pour déclarer un pointeur vers un entier?',
      options: [
        'int ptr;',
        'int* ptr;',
        'int &ptr;',
        'int ptr*;',
      ],
      correct: 1,
      explanation: 'Un pointeur se déclare avec l\'opérateur * après le type: int* ptr;',
    },
    {
      question: 'Quelle est la syntaxe correcte pour déclarer une référence vers un entier?',
      options: [
        'int ref;',
        'int* ref;',
        'int& ref = x;',
        'int ref&;',
      ],
      correct: 2,
      explanation: 'Une référence se déclare avec & et doit être initialisée: int& ref = x;',
    },
    {
      question: 'Un pointeur peut-il être nullptr?',
      options: [
        'Oui, c\'est une caractéristique importante des pointeurs',
        'Non, un pointeur doit toujours pointer vers quelque chose',
        'Seulement en C, pas en C++',
        'Seulement avec des pointeurs intelligents',
      ],
      correct: 0,
      explanation: 'Oui, un pointeur peut être nullptr, ce qui permet de représenter aucune valeur.',
    },
    {
      question: 'Une référence peut-elle être réassignée à une autre variable?',
      options: [
        'Oui, comme un pointeur',
        'Non, une référence est liée à sa variable initiale',
        'Oui, mais seulement avec l\'opérateur =',
        'Dépend de la version de C++',
      ],
      correct: 1,
      explanation: 'Non, une référence ne peut pas être réassignée. Elle reste liée à sa variable initiale.',
    },
    {
      question: 'Quel opérateur utilise-t-on pour déréférencer un pointeur?',
      options: [
        '&',
        '*',
        '->',
        '::',
      ],
      correct: 1,
      explanation: 'L\'opérateur * est utilisé pour déréférencer un pointeur et accéder à la valeur pointée.',
    },
    {
      question: 'Quel est l\'avantage principal des références par rapport aux pointeurs?',
      options: [
        'Elles sont plus rapides',
        'Elles prennent moins de mémoire',
        'Syntaxe plus simple et plus sûre',
        'Elles permettent l\'allocation dynamique',
      ],
      correct: 2,
      explanation: 'Les références offrent une syntaxe plus simple et sont plus sûres car elles ne peuvent pas être nulles.',
    },
    {
      question: 'Dans quel cas devrait-on utiliser un pointeur plutôt qu\'une référence?',
      options: [
        'Pour passer des paramètres à une fonction',
        'Pour l\'allocation dynamique de mémoire',
        'Pour retourner une valeur depuis une fonction',
        'Pour les boucles for basées sur des plages',
      ],
      correct: 1,
      explanation: 'Les pointeurs sont nécessaires pour l\'allocation dynamique avec new/delete.',
    },
    {
      question: 'Que fait l\'opérateur & lorsqu\'il est utilisé avec une variable?',
      options: [
        'Il crée une référence',
        'Il récupère l\'adresse mémoire de la variable',
        'Il déréférence un pointeur',
        'Il effectue une opération ET binaire',
      ],
      correct: 1,
      explanation: 'L\'opérateur & récupère l\'adresse mémoire d\'une variable, utile pour les pointeurs.',
    },
  ]

  const handleAnswer = (index) => {
    if (answered) return
    setSelectedAnswer(index)
    setAnswered(true)
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      setShowResult(true)
    }
  }

  const handleReset = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnswered(false)
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <section id="quiz" className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto max-w-4xl">
          <div className="section-card text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Quiz Terminé!
            </h2>
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
              {score}/{questions.length}
            </div>
            <div className="text-3xl font-semibold text-gray-700 mb-8">
              {percentage}% de bonnes réponses
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Recommencer le quiz</span>
            </button>
          </div>
        </div>
      </section>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <section id="quiz" className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-6">
            <Brain className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Quiz Interactif
          </h2>
          <p className="text-xl text-gray-600">
            Testez vos connaissances sur les pointeurs et références
          </p>
        </div>

        <div className="section-card">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Question {currentQuestion + 1} sur {questions.length}
              </span>
              <span className="text-sm font-medium text-gray-600">
                Score: {score}/{currentQuestion + (answered ? 1 : 0)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {currentQ.options.map((option, index) => {
              const isCorrect = index === currentQ.correct
              const isSelected = selectedAnswer === index
              let buttonClass =
                'w-full text-left p-4 rounded-lg border-2 transition-all duration-200 font-medium'

              if (answered) {
                if (isCorrect) {
                  buttonClass += ' bg-green-50 border-green-500 text-green-900'
                } else if (isSelected && !isCorrect) {
                  buttonClass += ' bg-red-50 border-red-500 text-red-900'
                } else {
                  buttonClass += ' bg-gray-50 border-gray-300 text-gray-600'
                }
              } else {
                buttonClass +=
                  ' bg-white border-gray-300 text-gray-700 hover:border-primary-500 hover:bg-primary-50 cursor-pointer'
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={answered}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {answered && isSelected && (
                      <div>
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                    )}
                    {answered && !isSelected && isCorrect && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {answered && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                selectedAnswer === currentQ.correct
                  ? 'bg-green-50 border-l-4 border-green-500'
                  : 'bg-red-50 border-l-4 border-red-500'
              }`}
            >
              <p className="text-gray-700">
                <strong>Explication:</strong> {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {answered && (
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              {currentQuestion < questions.length - 1
                ? 'Question suivante →'
                : 'Voir les résultats'}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default Quiz


