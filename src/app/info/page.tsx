'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { 
  Stethoscope, 
  Zap, 
  Droplets, 
  Heart, 
  Shield, 
  Clock, 
  CheckCircle, 
  Star,
  Phone,
  Calendar
} from 'lucide-react';

export default function InfoPage() {
  const [activeTab, setActiveTab] = useState<'laser' | 'iv'>('laser');

  const laserTreatments = [
    {
      name: "Laser Hair Removal",
      description: "Safe and effective permanent hair reduction using advanced laser technology",
      benefits: ["Permanent results", "No downtime", "Suitable for all skin types", "Minimal discomfort"],
      duration: "15-60 minutes",
      sessions: "6-8 sessions recommended"
    },
    {
      name: "Laser Skin Resurfacing",
      description: "Improve skin texture, reduce fine lines, and treat sun damage with precision laser therapy",
      benefits: ["Reduced fine lines", "Improved skin texture", "Even skin tone", "Minimal recovery time"],
      duration: "30-90 minutes",
      sessions: "1-3 sessions recommended"
    },
    {
      name: "Laser Acne Treatment",
      description: "Target acne bacteria and reduce inflammation with specialized laser wavelengths",
      benefits: ["Reduced acne breakouts", "Improved skin clarity", "Reduced inflammation", "Long-lasting results"],
      duration: "20-45 minutes",
      sessions: "4-6 sessions recommended"
    },
    {
      name: "Laser Tattoo Removal",
      description: "Safe and effective tattoo removal using Q-switched laser technology",
      benefits: ["Safe for all skin types", "Minimal scarring risk", "Effective on all ink colors", "Gradual fading process"],
      duration: "15-30 minutes",
      sessions: "6-12 sessions recommended"
    }
  ];

  const ivTherapies = [
    {
      name: "Vitamin C Infusion",
      description: "High-dose vitamin C therapy to boost immunity and promote healthy skin",
      benefits: ["Immune system support", "Antioxidant protection", "Skin health improvement", "Energy boost"],
      duration: "30-45 minutes",
      frequency: "Weekly or bi-weekly"
    },
    {
      name: "Hydration Therapy",
      description: "Restore optimal hydration levels with electrolyte-balanced IV fluids",
      benefits: ["Rapid rehydration", "Electrolyte balance", "Improved energy", "Better skin appearance"],
      duration: "20-30 minutes",
      frequency: "As needed"
    },
    {
      name: "Myers' Cocktail",
      description: "Comprehensive vitamin and mineral infusion for overall wellness and energy",
      benefits: ["Enhanced energy levels", "Improved mood", "Better sleep quality", "Overall wellness"],
      duration: "45-60 minutes",
      frequency: "Weekly or monthly"
    },
    {
      name: "Glutathione Therapy",
      description: "Powerful antioxidant therapy for detoxification and skin brightening",
      benefits: ["Detoxification support", "Skin brightening", "Anti-aging effects", "Immune support"],
      duration: "30-45 minutes",
      frequency: "Weekly or bi-weekly"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      service: "Laser Hair Removal",
      rating: 5,
      comment: "Amazing results! The laser treatment was comfortable and the staff was incredibly professional. Highly recommend!"
    },
    {
      name: "Michael Chen",
      service: "IV Vitamin Therapy",
      rating: 5,
      comment: "The Myers' Cocktail gave me so much energy and improved my overall well-being. Great experience!"
    },
    {
      name: "Emily Rodriguez",
      service: "Laser Skin Resurfacing",
      rating: 5,
      comment: "My skin looks so much better after the laser treatment. The results exceeded my expectations."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Our Medical Services
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover our advanced laser treatments and IV nutrition therapy services 
                designed to enhance your health and well-being.
              </p>
            </div>

            {/* Service Tabs */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 justify-center">
                  <button
                    onClick={() => setActiveTab('laser')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'laser'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <Zap className="h-5 w-5 mr-2" />
                      Laser Treatments
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('iv')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'iv'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <Droplets className="h-5 w-5 mr-2" />
                      IV Nutrition Therapy
                    </div>
                  </button>
                </nav>
              </div>
            </div>

            {/* Laser Treatments */}
            {activeTab === 'laser' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Advanced Laser Treatments
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    State-of-the-art laser technology for safe, effective, and comfortable treatments
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {laserTreatments.map((treatment, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg mr-4">
                          <Zap className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{treatment.name}</h3>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{treatment.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Benefits:</h4>
                        <ul className="space-y-1">
                          {treatment.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">Duration: {treatment.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">{treatment.sessions}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* IV Nutrition Therapy */}
            {activeTab === 'iv' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    IV Nutrition Therapy
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Personalized vitamin and mineral infusions for optimal health and wellness
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {ivTherapies.map((therapy, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-green-100 rounded-lg mr-4">
                          <Droplets className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{therapy.name}</h3>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{therapy.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Benefits:</h4>
                        <ul className="space-y-1">
                          {therapy.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">Duration: {therapy.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">{therapy.frequency}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why Choose Us */}
            <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                Why Choose MartClinic Direct?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Certified Professionals</h3>
                  <p className="text-gray-600">Our team consists of licensed medical professionals with specialized training in laser treatments and IV therapy.</p>
                </div>
                
                <div className="text-center">
                  <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Care</h3>
                  <p className="text-gray-600">Every treatment is tailored to your specific needs and health goals for optimal results.</p>
                </div>
                
                <div className="text-center">
                  <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Stethoscope className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Technology</h3>
                  <p className="text-gray-600">We use the latest medical-grade equipment and techniques for safe, effective treatments.</p>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                What Our Patients Say
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">&ldquo;{testimonial.comment}&rdquo;</p>
                    <div className="border-t pt-4">
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.service}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="mt-16 bg-blue-600 rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Schedule a consultation to discuss your treatment options and health goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
                  <Phone className="h-5 w-5 mr-2" />
                  Call (555) 123-4567
                </button>
                <button className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>
        </main>
    </div>
  );
}
