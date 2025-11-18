import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'

const CodeExample = ({ code, language = 'cpp', title, explanation }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="section-card my-6">
      {title && (
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
      )}
      <div className="relative">
        <button
          onClick={copyToClipboard}
          className="absolute top-4 right-4 z-10 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span className="text-sm">Copié!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-sm">Copier</span>
            </>
          )}
        </button>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            borderRadius: '0.5rem',
            padding: '1.5rem',
            fontSize: '0.9rem',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
      {explanation && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-primary-500">
          <p className="text-gray-700 leading-relaxed">{explanation}</p>
        </div>
      )}
    </div>
  )
}

export default CodeExample

