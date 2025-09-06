import React from 'react';
import { Brain, Crown, Zap } from 'lucide-react';

const Header = ({ subscription, scansUsed, onUpgrade }) => {
  return (
    <header className="bg-surface border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-2 rounded-lg">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text">JobMatch AI</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Usage indicator */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              {subscription.type === 'free' ? (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < scansUsed ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted">
                    {scansUsed}/3 free scans
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-accent-600">
                  <Crown className="w-4 h-4" />
                  <span className="font-medium">Pro</span>
                </div>
              )}
            </div>

            {/* Upgrade button */}
            {subscription.type === 'free' && (
              <button
                onClick={onUpgrade}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Upgrade to Pro</span>
                <span className="sm:hidden">Pro</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;