import React from 'react';
import { X, Crown, Check, Zap } from 'lucide-react';

const SubscriptionModal = ({ onClose, onUpgrade, scansUsed }) => {
  const features = [
    'Unlimited resume and cover letter scans',
    'Advanced AI rewriting with multiple style options',
    'Industry-specific tone adjustments',
    'Priority processing (faster results)',
    'Export optimized documents in multiple formats',
    'Email support and optimization tips'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-white p-2 rounded-lg">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text">Upgrade to Pro</h2>
                <p className="text-sm text-muted">Unlock unlimited AI-powered optimization</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-muted hover:text-text p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Usage indicator */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full bg-red-500"
                  />
                ))}
              </div>
              <span className="text-red-800 font-medium">All free scans used</span>
            </div>
            <p className="text-red-700 text-sm">
              You've used all {scansUsed} of your free scans this month. Upgrade to Pro for unlimited access.
            </p>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-200 rounded-lg p-6 mb-6">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-text">$10</div>
              <div className="text-muted">/month</div>
            </div>
            
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-text">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onUpgrade}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Upgrade to Pro Now
            </button>
            
            <button
              onClick={onClose}
              className="btn-outline w-full"
            >
              Maybe Later
            </button>
          </div>

          {/* Trust indicators */}
          <div className="text-center mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-muted">
              Cancel anytime • 30-day money-back guarantee • Secure payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;