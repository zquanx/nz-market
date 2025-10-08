import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, User, ShoppingBag, Shield, HelpCircle } from 'lucide-react';

interface FooterProps {
  language: 'en' | 'zh';
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    en: {
      company: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' },
        { label: 'Blog', href: '/blog' }
      ],
      support: [
        { label: 'Help Center', href: '/help' },
        { label: 'Safety Tips', href: '/safety' },
        { label: 'Community Guidelines', href: '/guidelines' },
        { label: 'Contact Us', href: '/contact' }
      ],
      legal: [
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'Accessibility', href: '/accessibility' }
      ]
    },
    zh: {
      company: [
        { label: '关于我们', href: '/about' },
        { label: '招聘', href: '/careers' },
        { label: '新闻', href: '/press' },
        { label: '博客', href: '/blog' }
      ],
      support: [
        { label: '帮助中心', href: '/help' },
        { label: '安全提示', href: '/safety' },
        { label: '社区准则', href: '/guidelines' },
        { label: '联系我们', href: '/contact' }
      ],
      legal: [
        { label: '服务条款', href: '/terms' },
        { label: '隐私政策', href: '/privacy' },
        { label: 'Cookie政策', href: '/cookies' },
        { label: '无障碍访问', href: '/accessibility' }
      ]
    }
  };

  const quickActions = [
    { icon: Heart, label: language === 'en' ? 'Favorites' : '收藏', href: '/favorites' },
    { icon: MessageCircle, label: language === 'en' ? 'Messages' : '消息', href: '/chat' },
    { icon: User, label: language === 'en' ? 'Profile' : '个人资料', href: '/me' },
    { icon: ShoppingBag, label: language === 'en' ? 'My Items' : '我的商品', href: '/me/items' }
  ];

  const links = footerLinks[language];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <span className="text-xl font-bold">Kiwi Market</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                {language === 'en' 
                  ? 'New Zealand\'s trusted marketplace for buying and selling second-hand items. Safe, secure, and sustainable.'
                  : '新西兰值得信赖的二手商品交易平台。安全、可靠、可持续。'
                }
              </p>
              
              {/* Quick Actions */}
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.href}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    <action.icon className="w-4 h-4" />
                    <span>{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {language === 'en' ? 'Company' : '公司'}
              </h3>
              <ul className="space-y-2">
                {links.company.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {language === 'en' ? 'Support' : '支持'}
              </h3>
              <ul className="space-y-2">
                {links.support.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {language === 'en' ? 'Legal' : '法律'}
              </h3>
              <ul className="space-y-2">
                {links.legal.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-400">
                <Shield className="w-5 h-5" />
                <span className="text-sm">
                  {language === 'en' ? 'Secure Payments' : '安全支付'}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <HelpCircle className="w-5 h-5" />
                <span className="text-sm">
                  {language === 'en' ? '24/7 Support' : '24/7 支持'}
                </span>
              </div>
            </div>
            
            <div className="text-gray-400 text-sm">
              {language === 'en' 
                ? `© ${currentYear} Kiwi Market. All rights reserved.`
                : `© ${currentYear} Kiwi Market. 保留所有权利。`
              }
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <div className="text-gray-400 text-xs">
              {language === 'en' 
                ? 'Made with ❤️ in New Zealand'
                : '在新西兰用心制作 ❤️'
              }
            </div>
            <div className="flex items-center space-x-4 text-gray-400 text-xs">
              <span>{language === 'en' ? 'Version 1.0.0' : '版本 1.0.0'}</span>
              <span>•</span>
              <span>{language === 'en' ? 'Last updated: Jan 2024' : '最后更新：2024年1月'}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
