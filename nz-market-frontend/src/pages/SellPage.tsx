import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  X, 
  MapPin, 
  DollarSign, 
  Tag, 
  FileText,
  Camera,
  Plus,
  Minus
} from 'lucide-react';
import { categories, conditions } from '../data/mockItems';

interface SellPageProps {
  language: 'en' | 'zh';
}

interface FormData {
  title: string;
  description: string;
  price: string;
  condition: string;
  category: string;
  location: string;
  quantity: number;
  images: string[];
  tags: string[];
}

const SellPage: React.FC<SellPageProps> = ({ language }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    condition: '',
    category: '',
    location: '',
    quantity: 1,
    images: [],
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { number: 1, title: language === 'en' ? 'Basic Info' : '基本信息' },
    { number: 2, title: language === 'en' ? 'Photos' : '照片' },
    { number: 3, title: language === 'en' ? 'Details' : '详细信息' },
    { number: 4, title: language === 'en' ? 'Review' : '确认' }
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 10) // Max 10 images
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    navigate('/me/items');
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.title && formData.description && formData.price && formData.condition && formData.category;
      case 2:
        return formData.images.length > 0;
      case 3:
        return formData.location;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 4 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Item Title' : '商品标题'} *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder={language === 'en' ? 'e.g., MacBook Pro 13" 2020' : '例如：MacBook Pro 13" 2020'}
                className="input-field"
                maxLength={200}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.title.length}/200 {language === 'en' ? 'characters' : '字符'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Description' : '商品描述'} *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={language === 'en' ? 'Describe your item in detail...' : '详细描述您的商品...'}
                className="input-field h-32 resize-none"
                maxLength={5000}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/5000 {language === 'en' ? 'characters' : '字符'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Price (NZD)' : '价格 (新西兰元)'} *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    className="input-field pl-10"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Quantity' : '数量'}
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleInputChange('quantity', Math.max(1, formData.quantity - 1))}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                    className="flex-1 px-3 py-2 text-center border-0 focus:outline-none"
                    min="1"
                  />
                  <button
                    onClick={() => handleInputChange('quantity', formData.quantity + 1)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Category' : '分类'} *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="input-field"
                >
                  <option value="">{language === 'en' ? 'Select category' : '选择分类'}</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Condition' : '成色'} *
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  className="input-field"
                >
                  <option value="">{language === 'en' ? 'Select condition' : '选择成色'}</option>
                  {conditions.map(condition => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'en' ? 'Upload Photos' : '上传照片'}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === 'en' 
                  ? 'Add up to 10 photos. The first photo will be your main image.'
                  : '最多可添加10张照片。第一张照片将作为主图。'
                }
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-primary-600 text-white px-2 py-1 rounded text-xs">
                      {language === 'en' ? 'Main' : '主图'}
                    </div>
                  )}
                </div>
              ))}

              {formData.images.length < 10 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {language === 'en' ? 'Add Photo' : '添加照片'}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Location' : '位置'} *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder={language === 'en' ? 'e.g., Auckland CBD' : '例如：奥克兰市中心'}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Tags' : '标签'}
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder={language === 'en' ? 'Add a tag' : '添加标签'}
                  className="flex-1 input-field"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  onClick={addTag}
                  className="btn-primary"
                >
                  <Tag className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'en' ? 'Review Your Listing' : '确认您的商品'}
              </h3>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{formData.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{formData.description}</p>
                  <div className="text-2xl font-bold text-primary-600 mb-4">
                    NZD ${parseFloat(formData.price || '0').toLocaleString()}
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>{language === 'en' ? 'Category:' : '分类：'}</strong> {formData.category}</p>
                    <p><strong>{language === 'en' ? 'Condition:' : '成色：'}</strong> {conditions.find(c => c.value === formData.condition)?.label}</p>
                    <p><strong>{language === 'en' ? 'Quantity:' : '数量：'}</strong> {formData.quantity}</p>
                    <p><strong>{language === 'en' ? 'Location:' : '位置：'}</strong> {formData.location}</p>
                    {formData.tags.length > 0 && (
                      <p><strong>{language === 'en' ? 'Tags:' : '标签：'}</strong> {formData.tags.map(tag => `#${tag}`).join(', ')}</p>
                    )}
                  </div>
                </div>
                <div>
                  {formData.images.length > 0 && (
                    <img
                      src={formData.images[0]}
                      alt={formData.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'en' ? 'Sell an Item' : '出售商品'}
          </h1>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'List your item for sale in just a few simple steps'
              : '只需几个简单步骤即可列出您的商品'
            }
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {step.number}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.number ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {language === 'en' ? 'Previous' : '上一步'}
          </button>

          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {language === 'en' ? 'Next' : '下一步'}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {language === 'en' ? 'Publishing...' : '发布中...'}
                </div>
              ) : (
                language === 'en' ? 'Publish Listing' : '发布商品'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellPage;
