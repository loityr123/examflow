/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type SchoolLevel = '초등' | '중등' | '고등';

interface FormData {
  name: string;
  phone: string;
  schoolLevel: SchoolLevel | '';
  grade: string;
  agreed: boolean;
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    schoolLevel: '',
    grade: '',
    agreed: false,
  });
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);

  // Auto-hyphenate phone number
  const formatPhone = (val: string) => {
    const digits = val.replace(/[^0-9]/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  const handleSchoolLevelSelect = (level: SchoolLevel) => {
    setFormData((prev) => ({ ...prev, schoolLevel: level, grade: '' }));
  };

  const validate = () => {
    if (!formData.name.trim()) return '이름을 입력해주세요';
    if (!/^010-\d{4}-\d{4}$/.test(formData.phone)) return '올바른 연락처를 입력해주세요';
    if (!formData.schoolLevel) return '학교급을 선택해주세요';
    if (!formData.grade) return '학년을 선택해주세요';
    if (!formData.agreed) return '개인정보 동의가 필요합니다';
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      alert(error);
      return;
    }
    alert('상담 신청이 완료되었습니다! 빠르게 연락드리겠습니다 😊');
    setIsModalOpen(false);
    // Reset form
    setFormData({
      name: '',
      phone: '',
      schoolLevel: '',
      grade: '',
      agreed: false,
    });
  };

  const getGradeOptions = () => {
    if (!formData.schoolLevel) return [];
    const count = formData.schoolLevel === '초등' ? 6 : 3;
    return Array.from({ length: count }, (_, i) => `${i + 1}학년`);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="relative min-h-screen bg-gray-100 font-sans">
      {/* Background Image Container */}
      <div className="relative mx-auto w-full max-w-[800px] overflow-hidden bg-white shadow-xl">
        <img
          id="landing-image"
          src="examflow.png"
          alt="Landing Background"
          className="block w-full"
          referrerPolicy="no-referrer"
        />

        {/* Overlay CTA Buttons */}
        {/* Top Button */}
        <button
  id="cta-top"
  onClick={openModal}
  className="absolute top-[12%] left-[28%] right-[28%] h-[3%] cursor-pointer border-none bg-transparent outline-none"
  aria-label="학습방향 점검하기"
/>
        {/* Bottom Button */}
        <button
          id="cta-bottom"
          onClick={openModal}
          className="absolute top-[93.5%] left-1/2 h-[3%] w-[58%] -translate-x-1/2 cursor-pointer border-none bg-transparent outline-none"
          aria-label="무료 상담 신청하기"
        />
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Dim Backdrop */}
            <motion.div
              id="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/70"
            />

            {/* Modal Content */}
            <motion.div
              id="modal-box"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[360px] overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="bg-linear-to-r from-blue-600 to-blue-400 py-4 text-center">
                <h2 className="text-lg font-bold text-white">무료 학습 상담 신청</h2>
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-white hover:opacity-80"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  {/* Name Input */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">이름 (필수)</label>
                    <input
                      type="text"
                      placeholder="이름을 입력해주세요"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">연락처 (필수)</label>
                    <input
                      type="tel"
                      placeholder="010-0000-0000"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      maxLength={13}
                    />
                  </div>

                  {/* School Level Selection (Tabs) */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">학년 선택 (필수)</label>
                    <div className="flex gap-2">
                      {(['초등', '중등', '고등'] as SchoolLevel[]).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => handleSchoolLevelSelect(level)}
                          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                            formData.schoolLevel === level
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grade Dropdown */}
                  <div>
                    <div className="relative">
                      <select
                        disabled={!formData.schoolLevel}
                        className={`w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 focus:border-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400`}
                        value={formData.grade}
                        onChange={(e) => setFormData((prev) => ({ ...prev, grade: e.target.value }))}
                      >
                        <option value="">학년을 선택해 주세요</option>
                        {getGradeOptions().map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                        <ChevronDown size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Privacy Agreement */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between">
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={formData.agreed}
                          onChange={(e) => setFormData((prev) => ({ ...prev, agreed: e.target.checked }))}
                        />
                        <span>개인정보 수집 및 이용에 동의합니다 (필수)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPrivacyDetails(!showPrivacyDetails)}
                        className="text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600"
                      >
                        [내용보기]
                      </button>
                    </div>

                    {/* Privacy Details Toggle */}
                    <AnimatePresence>
                      {showPrivacyDetails && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-2 overflow-hidden rounded-lg bg-gray-50 p-3 text-[11px] leading-relaxed text-gray-500"
                        >
                          <p>• 수집항목: 이름, 연락처, 학년</p>
                          <p>• 수집목적: 학습 상담 서비스 제공</p>
                          <p>• 보유기간: 상담 완료 후 5년</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-400 py-4 text-lg font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  무료 상담 신청하기
                  <Check size={20} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
