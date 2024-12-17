import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  UserGroupIcon,
  MenuIcon,
  XIcon,
  CheckIcon,
  ShoppingBagIcon
} from '@heroicons/react/outline';
import Products from './pages/Products';
import Marketplace from './pages/Marketplace';
import Dashboard from './pages/Dashboard';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  const menuItems = [
    { id: 'home', name: 'Dashboard', icon: HomeIcon },
    { id: 'products', name: 'Produse', icon: ShoppingCartIcon },
    { id: 'marketplace', name: 'Marketplace', icon: ShoppingBagIcon },
    { id: 'subscription', name: 'Subscripție', icon: CreditCardIcon },
    { id: 'users', name: 'Utilizatori', icon: UserGroupIcon },
  ];

  const handleUpgradeClick = () => {
    setActiveTab('subscription');
  };

  const subscriptionPlans = [
    {
      name: "Free",
      price: "0",
      features: [
        "2 Marketplace-uri",
        "Până la 50 produse",
        "Export manual între marketplace-uri",
        "Suport prin email",
        "Actualizări săptămânale",
        "Dashboard de bază"
      ],
      gradient: "from-gray-600 to-gray-700",
      recommended: false
    },
    {
      name: "Pro",
      price: "29",
      features: [
        "3 Marketplace-uri",
        "Până la 500 produse",
        "Export automat",
        "Suport prioritar",
        "Actualizări în timp real",
        "API access",
        "Statistici de bază"
      ],
      gradient: "from-blue-400 to-purple-600",
      recommended: true
    },
    {
      name: "Business",
      price: "99",
      features: [
        "Marketplace-uri nelimitate",
        "Produse nelimitate",
        "Export automat avansat",
        "Suport 24/7",
        "Actualizări instant",
        "API access nelimitat",
        "Statistici avansate",
        "Dashboard personalizat",
        "Training dedicat"
      ],
      gradient: "from-purple-400 to-pink-600",
      recommended: false
    }
  ];

  const renderSubscriptionPage = () => (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-white mb-6"
        >
          Planuri de Subscripție
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/70 text-xl"
        >
          Alegeți planul perfect pentru afacerea dumneavoastră. 
          <span className="text-white">Upgrade oricând</span> pentru funcționalități suplimentare.
        </motion.p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 px-4">
        {subscriptionPlans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className={`relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105
              ${plan.recommended ? 'ring-2 ring-blue-400 scale-105 lg:scale-110' : ''}
            `}
          >
            {plan.recommended && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-bl-2xl text-sm font-medium transform rotate-0 shadow-lg">
                Recomandat
              </div>
            )}

            <div className={`p-8 bg-gradient-to-br ${plan.gradient} relative overflow-hidden`}>
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full transform -translate-x-12 translate-y-12" />
              
              <h3 className="text-3xl font-bold text-white mb-4 relative z-10">{plan.name}</h3>
              <div className="flex items-baseline gap-2 relative z-10">
                <span className="text-5xl font-bold text-white">${plan.price}</span>
                <span className="text-white/70 text-xl">/lună</span>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <ul className="space-y-4">
                {plan.features.map((feature, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3 text-white group"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                      <CheckIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="group-hover:text-white transition-colors">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-4 rounded-xl font-medium text-lg transition-all duration-300
                  ${plan.recommended 
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white/20 text-white hover:bg-white/30'
                  }
                `}
              >
                {plan.name === "Free" ? "Începe Gratuit" : "Alege Planul"}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FAQ Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-24 bg-white/5 backdrop-blur-sm rounded-3xl p-12"
      >
        <h3 className="text-4xl font-bold text-white mb-12 text-center">Întrebări Frecvente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            {
              question: "Pot să schimb planul mai târziu?",
              answer: "Da, puteți face upgrade sau downgrade oricând. Modificările se aplică la următoarea perioadă de facturare.",
              icon: "🔄"
            },
            {
              question: "Cum sunt calculate produsele?",
              answer: "Limita de produse se referă la numărul total de produse pe care le puteți sincroniza între marketplace-uri.",
              icon: "📊"
            },
            {
              question: "Ce înseamnă export automat?",
              answer: "Produsele sunt sincronizate automat între marketplace-uri fără intervenție manuală, la intervale regulate.",
              icon: "⚡"
            },
            {
              question: "Există perioadă minimă de contract?",
              answer: "Nu, puteți anula subscripția în orice moment. Vă vom returna diferența pentru perioada neutilizată.",
              icon: "📅"
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-8 hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{faq.icon}</span>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {faq.question}
                  </h4>
                  <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-white/70 text-lg">
            Ai alte întrebări? {" "}
            <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Contactează-ne
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1f3c]">
      <div className="flex">
        {/* Sidebar Toggle Button - Mobile */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#232a4f] hover:bg-[#2a325a] rounded-lg transition-colors"
        >
          {isSidebarOpen ? (
            <XIcon className="w-6 h-6 text-white" />
          ) : (
            <MenuIcon className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Sidebar */}
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", bounce: 0.2 }}
            className="fixed lg:relative w-72 h-screen bg-[#232a4f] border-r border-white/10 p-6 overflow-hidden"
          >
            <div className="mb-12">
              <h1 className="text-3xl font-bold text-white text-center">
                Product Export
              </h1>
              <div className="mt-2 w-full h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            <nav className="space-y-4">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (index + 2) }}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300
                    ${activeTab === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg'
                      : 'bg-[#1a1f3c] hover:bg-[#2a325a]'
                    }
                    relative overflow-hidden`}
                >
                  <item.icon className="w-6 h-6 text-white relative z-10" />
                  <span className="font-medium text-white relative z-10">
                    {item.name}
                  </span>
                </motion.button>
              ))}
            </nav>

            {/* Bottom section */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-[#1a1f3c] rounded-xl p-4 text-center"
              >
                <p className="text-blue-300 text-sm">
                  Versiunea Pro
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpgradeClick}
                  className="mt-2 w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg text-white text-sm font-medium transition-all"
                >
                  Upgrade Acum
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`flex-1 p-4 lg:p-6 ${!isSidebarOpen ? 'lg:ml-0' : 'lg:ml-72'}`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#232a4f] rounded-2xl p-6 lg:p-8 min-h-[calc(100vh-3rem)] shadow-xl border border-white/10">
              {activeTab === 'subscription' ? (
                renderSubscriptionPage()
              ) : activeTab === 'products' ? (
                <Products />
              ) : activeTab === 'marketplace' ? (
                <Marketplace />
              ) : (
                <Dashboard />
              )}
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}

export default App;
