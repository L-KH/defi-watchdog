import Head from 'next/head';
import Layout from '../components/layout/Layout';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1000);
  };

  const contactMethods = [
    {
      icon: "📧",
      title: "Email Support",
      description: "Get in touch with our team",
      value: "support@defiwatchdog.com",
      action: "mailto:support@defiwatchdog.com"
    },
    {
      icon: "💬",
      title: "Live Chat",
      description: "Chat with our support team",
      value: "Available 24/7",
      action: "#"
    },
    {
      icon: "📱",
      title: "Telegram",
      description: "Join our community",
      value: "@defiwatchdog",
      action: "https://t.me/defiwatchdog"
    },
    {
      icon: "🐦",
      title: "Twitter",
      description: "Follow us for updates",
      value: "@defiwatchdog",
      action: "https://twitter.com/defiwatchdog"
    }
  ];

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'business', label: 'Business Partnership' },
    { value: 'security', label: 'Security Research' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' }
  ];

  const officeLocations = [
    {
      city: "Remote-First",
      description: "Global Team",
      details: "Our team operates remotely across multiple time zones to provide 24/7 support.",
      icon: "🌍"
    },
    {
      city: "Development Hub",
      description: "Blockchain Research",
      details: "Focused on advancing blockchain security research and AI model development.",
      icon: "🔬"
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Contact Us - DeFi Watchdog</title>
        <meta name="description" content="Get in touch with the DeFi Watchdog team. We're here to help with technical support, partnerships, and security inquiries." />
      </Head>

      <div className="bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center py-2 px-4 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                <span className="mr-2">💬</span>
                Contact Us
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Get in
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Touch</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Have questions about our platform? Need technical support? Want to explore partnerships? 
                We're here to help secure your DeFi journey.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Multiple Ways to Reach Us
              </h2>
              <p className="text-lg text-gray-600">
                Choose the method that works best for you. We're committed to responding quickly.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.action}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-center group"
                >
                  <div className="text-4xl mb-4">{method.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                  <p className="text-blue-600 font-medium group-hover:text-blue-700">{method.value}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Form */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                  
                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✅</span>
                        <p className="text-green-800">Thank you! Your message has been sent successfully.</p>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Your full name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                        Inquiry Type
                      </label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {inquiryTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief description of your inquiry"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending...
                        </span>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                </div>
                
                {/* Contact Info */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Locations</h3>
                    <div className="space-y-6">
                      {officeLocations.map((location, index) => (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                          <div className="flex items-start">
                            <span className="text-3xl mr-4">{location.icon}</span>
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">{location.city}</h4>
                              <p className="text-blue-600 font-medium mb-2">{location.description}</p>
                              <p className="text-gray-600 text-sm">{location.details}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Response Times</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">General Inquiries:</span>
                        <span className="font-medium">Within 24 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Technical Support:</span>
                        <span className="font-medium">Within 12 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Security Issues:</span>
                        <span className="font-medium">Within 2 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Business Inquiries:</span>
                        <span className="font-medium">Within 48 hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-gray-600">
                  Quick answers to common questions. Can't find what you're looking for? Contact us directly.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">How fast is the analysis?</h4>
                    <p className="text-gray-600">Our analysis typically completes in 1-4 minutes using 9 powerful tools in parallel.</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Which blockchains do you support?</h4>
                    <p className="text-gray-600">Currently supporting Linea, with more networks being added regularly.</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Do you offer enterprise solutions?</h4>
                    <p className="text-gray-600">Yes! Contact us to discuss custom enterprise security solutions for your organization.</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Is there a free tier?</h4>
                    <p className="text-gray-600">Yes, we offer free analysis with basic features and premium analysis for $0.10.</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">How accurate are the results?</h4>
                    <p className="text-gray-600">Our 9-tool approach provides comprehensive coverage and reduces false positives significantly.</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Can I integrate via API?</h4>
                    <p className="text-gray-600">API access is available for premium users and enterprise customers. Contact us for details.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
