import React from 'react'
import { Code2, Github, ExternalLink } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Code2 className="w-6 h-6 text-primary-400" />
              <span className="text-xl font-bold text-white">
                Pointeurs & Références
              </span>
            </div>
            <p className="text-gray-400">
              Guide pédagogique pour comprendre les différences entre
              pointeurs et références en C++
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#pointers"
                  className="hover:text-primary-400 transition-colors"
                >
                  Pointeurs
                </a>
              </li>
              <li>
                <a
                  href="#references"
                  className="hover:text-primary-400 transition-colors"
                >
                  Références
                </a>
              </li>
              <li>
                <a
                  href="#comparison"
                  className="hover:text-primary-400 transition-colors"
                >
                  Comparaison
                </a>
              </li>
              <li>
                <a
                  href="#quiz"
                  className="hover:text-primary-400 transition-colors"
                >
                  Quiz
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Ressources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://en.cppreference.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors flex items-center space-x-1"
                >
                  <span>cppreference.com</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
              <li>
                <a
                  href="https://learncpp.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors flex items-center space-x-1"
                >
                  <span>Learn C++</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
            </ul>
          </div>
        </div>

     
      </div>
    </footer>
  )
}

export default Footer


